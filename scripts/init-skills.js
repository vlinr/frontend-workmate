#!/usr/bin/env node

/**
 * init-skills.js - Frontend Development Skill Pack Initialization Script
 * 
 * Core Design: Three Core Directories (config only stores these 3, other paths via concatenation)
 * 
 * 1. project_work_dir - User project root directory (directory opened by user)
 * 2. project_ide_dir - Project IDE config root directory (e.g., .opencode/)
 * 3. static_config_dir - Static resources root directory (IDE config root, e.g., ~/.qoder)
 * 
 * Path Concatenation Rules:
 * - Static skill: {static_config_dir}/skills/{skill_name}/SKILL.md
 * - Static rule: {static_config_dir}/rules/{rule_name}.md
 * - Project skill: {project_ide_dir}/skills/fw-project-develop/SKILL.md
 * - Project rule: {project_ide_dir}/rules/fw-skill-rule.md
 * - Project state: {project_ide_dir}/rules/fw-session-state.md
 * - Modified code: {project_work_dir}/src/...
 * 
 * Static Skill Copy Logic:
 * - Source: skills/curated/ and skills/external/ (inside frontend-workmate)
 * - Target: {static_config_dir}/skills/ (at the same level as frontend-workmate)
 * 
 * Improved Logic:
 * - Skill sync: Check version number or SKILL.md content changes, update if changed
 * - Config file: Validate three core directories, update if incorrect
 * - Rules file: Check template for changes, update if changed
 * - State file: Preserve existing content, do not overwrite (contains task data)
 */

const fs = require("fs");
const path = require("path");

// IDE directory names (configurable) - Common AI editor config directories
const IDE_DIR_NAMES = [
  ".opencode",      // OpenCode
  ".trae",          // Trae IDE (ByteDance)
  ".cursor",        // Cursor IDE
  ".vscode",        // VS Code / VS Code Insiders
  ".claude",        // Claude Code
  ".codex",         // Codex
  ".windsurf",      // Windsurf (Codeium)
  ".kiro",          // Kiro
  ".continue",      // Continue
  ".aider",         // Aider
  ".idea",          // IntelliJ IDEA
  ".zed",           // Zed editor
  ".replit",        // Replit
  ".amp",           // AMP Code
  ".agents",        // agents.md format
];

// Source skill directory names (configurable)
const SOURCE_SKILL_DIRS = ["curated", "external"];

function printHelp() {
  console.log("Usage: node scripts/init-skills.js [options]");
  console.log("");
  console.log("Options:");
  console.log("  --workdir <path>    Project work directory. Default: process.cwd()");
  console.log("  --ide <name>        IDE config directory name. Default: auto-detect");
  console.log("  --dirs <list>       Source skill directories. Default: curated,external");
  console.log("  --force             Force update all skills and rules (ignore version check)");
  console.log("  --dry-run           Show planned actions without executing");
  console.log("  --help, -h          Show this help");
}

function parseArgs(argv) {
  const options = {
    workdir: null,
    ide: null,
    dirs: SOURCE_SKILL_DIRS,
    force: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg === "--workdir" && next) {
      options.workdir = next;
      i++;
    } else if (arg === "--ide" && next) {
      options.ide = next;
      i++;
    } else if (arg === "--dirs" && next) {
      options.dirs = next.split(",").map(s => s.trim()).filter(Boolean);
      i++;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    }
  }

  return options;
}

/**
 * Detect IDE directory name
 * Search for existing IDE directory name in the project directory
 */
function detectIdeDirName(projectWorkDir) {
  for (const ideName of IDE_DIR_NAMES) {
    const idePath = path.resolve(projectWorkDir, ideName);
    if (fs.existsSync(idePath)) {
      return ideName;
    }
  }
  // Default to .opencode
  return ".opencode";
}

/**
 * Detect three core directories
 * Config file only stores these 3, other paths via concatenation
 */
function detectPaths(options) {
  // 1. Static resources root directory: determined by script location (IDE config root, e.g., ~/.qoder)
  const scriptsDir = __dirname;                                              // scripts directory
  const skillPackageDir = path.resolve(scriptsDir, "..");                    // frontend-workmate directory
  const skillsDir = path.resolve(skillPackageDir, "..");                     // skills directory
  const staticConfigDir = path.resolve(skillsDir, "..");                     // IDE config root directory (e.g., ~/.qoder)

  // 2. User project root directory: determined by options or process.cwd()
  const projectWorkDir = options.workdir || process.cwd();

  // 3. Project IDE config root directory: derived from project work directory
  const ideDirName = options.ide || detectIdeDirName(projectWorkDir);
  const projectIdeDir = path.resolve(projectWorkDir, ideDirName);

  // For internal processing (not stored in config)
  const staticSkillsSourceDir = path.resolve(skillPackageDir, "skills");     // Source skill directory

  console.log("[detect] Three core directories (stored in config):");
  console.log(`  1. project_work_dir:    ${projectWorkDir}`);
  console.log(`  2. project_ide_dir:     ${projectIdeDir}`);
  console.log(`  3. static_config_dir:   ${staticConfigDir} (IDE config root directory)`);
  console.log("");
  console.log("[detect] Derived paths (computed at runtime):");
  console.log(`  - Static skill: {static_config_dir}/skills/{skill_name}/`);
  console.log(`  - Static rule: {static_config_dir}/rules/{rule_name}`);
  console.log(`  - This skill pack: ${skillPackageDir}`);
  console.log(`  - Project skill: ${projectIdeDir}/skills/fw-project-develop/`);

  return {
    // Three core directories (stored in config)
    staticConfigDir,
    projectWorkDir,
    projectIdeDir,
    // Internal processing (not stored in config)
    skillPackageDir,
    staticSkillsSourceDir,
    ideDirName,
  };
}

function ensureDirectory(dirPath, dryRun) {
  if (!dryRun && !fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`[create] Directory: ${dirPath}`);
  }
}

function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

/**
 * Get skill version information
 * Extract description or other identifier from SKILL.md YAML frontmatter
 */
function getSkillVersion(skillDir) {
  const skillMdPath = path.resolve(skillDir, "SKILL.md");
  if (!fileExists(skillMdPath)) {
    return null;
  }
  
  const content = fs.readFileSync(skillMdPath, "utf-8");
  // Extract description from frontmatter as version identifier
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const descMatch = frontmatter.match(/description:\s*(.+)/);
    if (descMatch) {
      return descMatch[1].trim();
    }
  }
  
  // If no description, use file modification time as version
  const stat = fs.statSync(skillMdPath);
  return stat.mtimeMs.toString();
}

/**
 * Check if skill needs update
 * Compare SKILL.md content between source and target directories
 */
function needsSkillUpdate(sourceDir, targetDir, force) {
  if (!directoryExists(targetDir)) {
    return { needsUpdate: true, reason: "target_missing" };
  }
  
  if (force) {
    return { needsUpdate: true, reason: "force_update" };
  }
  
  // Check if source directory still exists (if exists, means not cleaned yet, needs sync)
  if (directoryExists(sourceDir)) {
    return { needsUpdate: true, reason: "source_still_exists" };
  }
  
  const sourceVersion = getSkillVersion(sourceDir);
  const targetVersion = getSkillVersion(targetDir);
  
  if (sourceVersion !== targetVersion) {
    return { needsUpdate: true, reason: "version_changed", sourceVersion, targetVersion };
  }
  
  return { needsUpdate: false, reason: "version_match" };
}

/**
 * Sync static skill directories (improved version)
 * 
 * New logic:
 * 1. If target doesn't exist → copy
 * 2. If source directory still exists → update (skill pack has changes)
 * 3. If force=true → force update
 * 4. Otherwise check version changes → update if changed
 */
function syncStaticSkills(skillPackageDir, staticConfigDir, dirNames, force, dryRun) {
  const results = [];
  const targetSkillsDir = path.resolve(staticConfigDir, "skills");  // Target: ~/.qoder/skills/

  for (const dirName of dirNames) {
    const sourceCategoryDir = path.resolve(skillPackageDir, "skills", dirName);

    if (!directoryExists(sourceCategoryDir)) {
      console.log(`[skip] Source category not found: ${sourceCategoryDir}`);
      results.push({ dirName, status: "source_missing", sourceCategoryDir });
      continue;
    }

    // Traverse subdirectories, check if update needed
    const childDirs = fs.readdirSync(sourceCategoryDir);
    
    for (const childName of childDirs) {
      const childSourceDir = path.resolve(sourceCategoryDir, childName);
      const childTargetDir = path.resolve(targetSkillsDir, childName);

      if (!directoryExists(childSourceDir)) {
        continue;
      }

// Improved: check if update needed
      const updateCheck = needsSkillUpdate(childSourceDir, childTargetDir, force);
      
      if (!updateCheck.needsUpdate) {
        console.log(`[skip] ${childName}: ${updateCheck.reason}`);
        results.push({ 
          category: dirName, 
          skillName: childName, 
          status: "no_update_needed", 
          reason: updateCheck.reason,
          sourceDir: childSourceDir, 
          targetDir: childTargetDir 
        });
        continue;
      }

      // Needs update: remove target directory (if exists), then copy
      if (!dryRun) {
        if (directoryExists(childTargetDir)) {
          fs.rmSync(childTargetDir, { recursive: true, force: true });
          console.log(`[remove] Old version: ${childTargetDir}`);
        }
        fs.cpSync(childSourceDir, childTargetDir, { recursive: true, force: true });
        console.log(`[${updateCheck.reason === "target_missing" ? "copy" : "update"}] ${childSourceDir} -> ${childTargetDir}`);
      } else {
        console.log(`[dry-run] Would ${updateCheck.reason === "target_missing" ? "copy" : "update"}: ${childSourceDir} -> ${childTargetDir}`);
      }

      results.push({ 
        category: dirName, 
        skillName: childName, 
        status: updateCheck.reason === "target_missing" ? "copied" : "updated", 
        reason: updateCheck.reason,
        sourceDir: childSourceDir, 
        targetDir: childTargetDir 
      });
    }
  }

  return results;
}

/**
 * Clean up source directories
 * Delete frontend-workmate/skills/curated/ and skills/external/
 */
function cleanupSourceDirs(skillPackageDir, dirNames, dryRun) {
  for (const dirName of dirNames) {
    const sourceDir = path.resolve(skillPackageDir, "skills", dirName);

    if (directoryExists(sourceDir)) {
      if (!dryRun) {
        fs.rmSync(sourceDir, { recursive: true, force: true });
        console.log(`[remove] Source category directory: ${sourceDir}`);
      } else {
        console.log(`[dry-run] Would remove: ${sourceDir}`);
      }
    }
  }
}

/**
 * Check if config file needs update
 * Validate three core directories are correct
 */
function needsConfigUpdate(configFilePath, paths) {
  if (!fileExists(configFilePath)) {
    return { needsUpdate: true, reason: "config_missing" };
  }
  
  try {
    const existingConfig = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    
    // Check three core directories are correct
    const errors = [];
    
    if (existingConfig.project_work_dir !== paths.projectWorkDir) {
      errors.push({
        field: "project_work_dir",
        expected: paths.projectWorkDir,
        actual: existingConfig.project_work_dir
      });
    }
    
    if (existingConfig.project_ide_dir !== paths.projectIdeDir) {
      errors.push({
        field: "project_ide_dir",
        expected: paths.projectIdeDir,
        actual: existingConfig.project_ide_dir
      });
    }
    
    if (existingConfig.static_config_dir !== paths.staticConfigDir) {
      errors.push({
        field: "static_config_dir",
        expected: paths.staticConfigDir,
        actual: existingConfig.static_config_dir
      });
    }
    
    if (errors.length > 0) {
      return { needsUpdate: true, reason: "path_mismatch", errors };
    }
    
    return { needsUpdate: false, reason: "config_valid" };
  } catch (e) {
    return { needsUpdate: true, reason: "config_parse_error", error: e.message };
  }
}

/**
 * Create or update project config file (improved version)
 * 
 * New logic:
 * 1. Config doesn't exist → create
 * 2. Config exists but paths incorrect → update
 * 3. Config correct → skip
 */
function createOrUpdateConfigFile(paths, dryRun) {
  const configFilePath = path.resolve(paths.projectIdeDir, ".fw-session-config.json");

  // Only store 3 core directories
  const expectedConfig = {
    project_work_dir: paths.projectWorkDir,
    project_ide_dir: paths.projectIdeDir,
    static_config_dir: paths.staticConfigDir,
    created_at: new Date().toISOString(),
  };

  // Improved: check if update needed
  const updateCheck = needsConfigUpdate(configFilePath, paths);
  
  if (!updateCheck.needsUpdate) {
    console.log(`[skip] Config file valid: ${configFilePath}`);
    return { configFilePath, status: "config_valid" };
  }
  
  if (updateCheck.reason === "path_mismatch") {
    console.log(`[update] Config paths mismatch:`);
    for (const err of updateCheck.errors) {
      console.log(`  - ${err.field}: expected ${err.expected}, actual ${err.actual}`);
    }
  }

  if (!dryRun) {
    fs.writeFileSync(configFilePath, JSON.stringify(expectedConfig, null, 2), "utf-8");
    console.log(`[${updateCheck.reason === "config_missing" ? "create" : "update"}] Config file: ${configFilePath}`);
  } else {
    console.log(`[dry-run] Would ${updateCheck.reason === "config_missing" ? "create" : "update"}: ${configFilePath}`);
  }

  return { configFilePath, config: expectedConfig, status: updateCheck.reason };
}

/**
 * Check if rules file needs update
 * Compare template file and existing file content
 */
function needsRulesUpdate(templatePath, filePath) {
  if (!fileExists(filePath)) {
    return { needsUpdate: true, reason: "file_missing" };
  }
  
  if (!fileExists(templatePath)) {
    return { needsUpdate: false, reason: "template_missing" };
  }
  
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  
  // Compare content for equality
  if (templateContent !== fileContent) {
    return { needsUpdate: true, reason: "content_changed" };
  }
  
  return { needsUpdate: false, reason: "content_match" };
}

/**
 * Create or update project rules files (improved version)
 * 
 * New logic:
 * 1. File doesn't exist → create
 * 2. File exists but template changed → update
 * 3. Content matches → skip
 * 
 * Note: State file is not updated (preserve task data)
 */
function createOrUpdateProjectRules(paths, dryRun) {
  const ruleTemplatePath = path.resolve(paths.skillPackageDir, "templates", "fw-skill-rule.template.md");
  const stateTemplatePath = path.resolve(paths.skillPackageDir, "templates", "fw-session-state.template.md");
  const ruleFilePath = path.resolve(paths.projectIdeDir, "rules", "fw-skill-rule.md");
  const stateFilePath = path.resolve(paths.projectIdeDir, "rules", "fw-session-state.md");

  const results = {
    rule: { filePath: ruleFilePath },
    state: { filePath: stateFilePath }
  };

  // Process rule file (improved: check template changes)
  if (!fileExists(ruleTemplatePath)) {
    console.log(`[skip] Rule template not found: ${ruleTemplatePath}`);
    results.rule.status = "template_missing";
  } else {
    const ruleUpdateCheck = needsRulesUpdate(ruleTemplatePath, ruleFilePath);
    
    if (!ruleUpdateCheck.needsUpdate) {
      console.log(`[skip] Rule file content match: ${ruleFilePath}`);
      results.rule.status = "no_update_needed";
    } else {
      if (!dryRun) {
        const ruleTemplateContent = fs.readFileSync(ruleTemplatePath, "utf-8");
        fs.writeFileSync(ruleFilePath, ruleTemplateContent, "utf-8");
        console.log(`[${ruleUpdateCheck.reason === "file_missing" ? "create" : "update"}] Rule file: ${ruleFilePath}`);
      } else {
        console.log(`[dry-run] Would ${ruleUpdateCheck.reason === "file_missing" ? "create" : "update"}: ${ruleFilePath}`);
      }
      results.rule.status = ruleUpdateCheck.reason === "file_missing" ? "created" : "updated";
      results.rule.reason = ruleUpdateCheck.reason;
    }
  }

  // Process state file (preserve existing content, do not overwrite)
  if (!fileExists(stateFilePath)) {
    if (!fileExists(stateTemplatePath)) {
      console.log(`[skip] State template not found: ${stateTemplatePath}`);
      results.state.status = "template_missing";
    } else {
      if (!dryRun) {
        const stateTemplateContent = fs.readFileSync(stateTemplatePath, "utf-8");
        fs.writeFileSync(stateFilePath, stateTemplateContent, "utf-8");
        console.log(`[create] State file: ${stateFilePath}`);
      } else {
        console.log(`[dry-run] Would create: ${stateFilePath}`);
      }
      results.state.status = "created";
    }
  } else {
    console.log(`[skip] State file exists (preserving task data): ${stateFilePath}`);
    results.state.status = "preserved";
  }

  return results;
}

/**
 * Create project skill directory (fw-project-develop)
 */
function createProjectSkillsDir(paths, dryRun) {
  const projectSkillDir = path.resolve(paths.projectIdeDir, "skills", "fw-project-develop");

  if (!dryRun) {
    if (!fs.existsSync(projectSkillDir)) {
      fs.mkdirSync(projectSkillDir, { recursive: true });
      console.log(`[create] Project skill directory: ${projectSkillDir}`);
    } else {
      console.log(`[skip] Project skill directory already exists: ${projectSkillDir}`);
    }
  } else {
    console.log(`[dry-run] Would ensure: ${projectSkillDir}`);
  }

  return { projectSkillDir };
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log("");
  console.log("=== frontend-workmate init-skills ===");
  console.log("");
  console.log("Core Design: Three directories (config only stores these 3)");
  console.log("  1. project_work_dir  - User project root directory");
  console.log("  2. project_ide_dir   - Project IDE config root directory");
  console.log("  3. static_config_dir - Static resources root directory (IDE config root)");
  console.log("");
  console.log("Improved Logic:");
  console.log("  - Skill sync: Check version changes, update if changed");
  console.log("  - Config file: Validate path correctness, update if incorrect");
  console.log("  - Rules file: Check template changes, update if changed");
  console.log("  - State file: Preserve existing content (contains task data)");
  console.log("");
  console.log("Other paths via concatenation:");
  console.log("  - Static skill: {static_config_dir}/skills/{skill_name}/SKILL.md");
  console.log("  - Static rule: {static_config_dir}/rules/{rule_name}.md");
  console.log("  - Project skill: {project_ide_dir}/skills/fw-project-develop/SKILL.md");
  console.log("  - Project rule: {project_ide_dir}/rules/fw-skill-rule.md");
  console.log("  - Project state: {project_ide_dir}/rules/fw-session-state.md");
  console.log("");

  const paths = detectPaths(options);

  console.log("");
  console.log(`Mode: ${options.dryRun ? "dry-run" : "execute"}`);
  console.log(`Force update: ${options.force ? "yes" : "no"}`);
  console.log(`Source dirs: ${options.dirs.join(", ")}`);
  console.log("");

  // Sync static skills to {static_config_dir}/skills/
  console.log("=== Syncing static skills ===");
  const syncResults = syncStaticSkills(paths.skillPackageDir, paths.staticConfigDir, options.dirs, options.force, options.dryRun);

  // Ensure project IDE directory structure exists
  console.log("");
  console.log("=== Creating project IDE directories ===");
  ensureDirectory(paths.projectIdeDir, options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "skills"), options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "rules"), options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "output"), options.dryRun);

  // Create or update project config file
  console.log("");
  console.log("=== Creating/Updating config file ===");
  const configResult = createOrUpdateConfigFile(paths, options.dryRun);

  // Create or update project rules files
  console.log("");
  console.log("=== Creating/Updating project rules ===");
  const rulesResult = createOrUpdateProjectRules(paths, options.dryRun);

  // Create project skill directory
  console.log("");
  console.log("=== Creating project skill directory ===");
  const skillResult = createProjectSkillsDir(paths, options.dryRun);

  // Clean up source directories (after sync completes)
  if (!options.dryRun) {
    console.log("");
    console.log("=== Cleaning up source directories ===");
    cleanupSourceDirs(paths.skillPackageDir, options.dirs, options.dryRun);
  }

  // Output summary
  console.log("");
  console.log("=== Summary ===");
  console.log("");
  console.log("Three core directories stored in config:");
  console.log(`  project_work_dir:  ${paths.projectWorkDir}`);
  console.log(`  project_ide_dir:   ${paths.projectIdeDir}`);
  console.log(`  static_config_dir: ${paths.staticConfigDir}`);
  console.log("");
  console.log("Static skill sync:");
  const copiedSkills = syncResults.filter(r => r.status === "copied");
  const updatedSkills = syncResults.filter(r => r.status === "updated");
  const skippedSkills = syncResults.filter(r => r.status === "no_update_needed");
  const existingSkills = syncResults.filter(r => r.status === "target_exists");
  
  if (copiedSkills.length > 0) {
    console.log(`  Added (${copiedSkills.length}):`);
    for (const r of copiedSkills) {
      console.log(`    - ${r.skillName}`);
    }
  }
  
  if (updatedSkills.length > 0) {
    console.log(`  Updated (${updatedSkills.length}):`);
    for (const r of updatedSkills) {
      console.log(`    - ${r.skillName} (${r.reason})`);
    }
  }
  
  if (skippedSkills.length > 0) {
    console.log(`  No update needed (${skippedSkills.length}):`);
    for (const r of skippedSkills) {
      console.log(`    - ${r.skillName} (${r.reason})`);
    }
  }
  
  console.log("");
  console.log("Generated/Updated files:");
  console.log(`  Config file: ${configResult.configFilePath} (${configResult.status})`);
  console.log(`  Rule file: ${rulesResult.rule.filePath} (${rulesResult.rule.status})`);
  console.log(`  State file: ${rulesResult.state.filePath} (${rulesResult.state.status})`);
  console.log(`  Project skill: ${skillResult.projectSkillDir}`);
  console.log("");

  // Directory structure explanation
  console.log("=== Directory structure ===");
  console.log("");
  console.log("# Static resources root directory (static_config_dir)");
  console.log(`${paths.staticConfigDir}/`);
  console.log("  ├── skills/");
  console.log("  │   ├── frontend-workmate/    # This skill pack");
  console.log("  │   ├── fw-react-best-practices/");
  console.log("  │   ├── fw-systematic-debugging/");
  for (const r of [...copiedSkills, ...updatedSkills]) {
    console.log(`  │   ├── ${r.skillName}/`);
  }
  console.log("  │   └── ...");
  console.log("  ├── rules/");
  console.log("  │   └── ...");
  console.log("  └── ...");
  console.log("");
  console.log("# Project IDE config directory (project_ide_dir)");
  console.log(`${paths.projectIdeDir}/`);
  console.log("  ├── .fw-session-config.json");
  console.log("  ├── skills/");
  console.log("  │   └── fw-project-develop/");
  console.log("  ├── rules/");
  console.log("  │   ├── fw-skill-rule.md");
  console.log("  │   └── fw-session-state.md");
  console.log("  └── output/");
  console.log("");
  console.log("# Project work directory (project_work_dir)");
  console.log(`${paths.projectWorkDir}/`);
  console.log("  ├── src/");
  console.log("  ├── package.json");
  console.log("  └── ...");
  console.log("");
}

try {
  main();
} catch (error) {
  console.error("[error]", error.message);
  process.exit(1);
}