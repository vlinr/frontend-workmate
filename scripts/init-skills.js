#!/usr/bin/env node

/**
 * init-skills.js - 前端研发技能包初始化脚本
 * 
 * 核心设计：三个核心目录（配置文件仅存储这3个，其他路径通过拼接）
 * 
 * 1. project_work_dir - 用户项目根目录（用户打开的目录）
 * 2. project_ide_dir - 项目IDE配置根目录（如 .opencode/）
 * 3. static_config_dir - 静态资源根目录（IDE配置根目录，如 ~/.qoder）
 * 
 * 其他路径拼接规则：
 * - 静态技能：{static_config_dir}/skills/{技能名}/SKILL.md
 * - 静态规则：{static_config_dir}/rules/{规则名}.md
 * - 项目技能：{project_ide_dir}/skills/fw-project-develop/SKILL.md
 * - 项目规则：{project_ide_dir}/rules/fw-skill-rule.md
 * - 项目状态：{project_ide_dir}/rules/fw-session-state.md
 * - 改动代码：{project_work_dir}/src/...
 * 
 * 静态技能拷贝逻辑：
 * - 源目录：skills/curated/ 和 skills/external/（frontend-workmate 内）
 * - 目标目录：{static_config_dir}/skills/（与 frontend-workmate 同级）
 */

const fs = require("fs");
const path = require("path");

// IDE 目录名（可配置）- 常见AI编辑器配置目录
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

// 源技能目录名（可配置）
const SOURCE_SKILL_DIRS = ["curated", "external"];

function printHelp() {
  console.log("Usage: node scripts/init-skills.js [options]");
  console.log("");
  console.log("Options:");
  console.log("  --workdir <path>    Project work directory. Default: process.cwd()");
  console.log("  --ide <name>        IDE config directory name. Default: auto-detect");
  console.log("  --dirs <list>       Source skill directories. Default: curated,external");
  console.log("  --dry-run           Show planned actions without executing");
  console.log("  --help, -h          Show this help");
}

function parseArgs(argv) {
  const options = {
    workdir: null,
    ide: null,
    dirs: SOURCE_SKILL_DIRS,
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
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    }
  }

  return options;
}

/**
 * 检测 IDE 目录名
 * 在项目目录下查找已存在的 IDE 目录名
 */
function detectIdeDirName(projectWorkDir) {
  for (const ideName of IDE_DIR_NAMES) {
    const idePath = path.resolve(projectWorkDir, ideName);
    if (fs.existsSync(idePath)) {
      return ideName;
    }
  }
  // 默认使用 .opencode
  return ".opencode";
}

/**
 * 检测三个核心目录
 * 配置文件只存储这3个，其他路径通过拼接
 */
function detectPaths(options) {
  // 1. 静态资源根目录：通过脚本位置确定（IDE配置根目录，如 ~/.qoder）
  const scriptsDir = __dirname;                                              // scripts 目录
  const skillPackageDir = path.resolve(scriptsDir, "..");                    // frontend-workmate 目录
  const skillsDir = path.resolve(skillPackageDir, "..");                     // skills 目录
  const staticConfigDir = path.resolve(skillsDir, "..");                     // IDE配置根目录（如 ~/.qoder）

  // 2. 用户项目根目录：通过参数或 process.cwd() 确定
  const projectWorkDir = options.workdir || process.cwd();

  // 3. 项目IDE配置根目录：基于项目工作目录推导
  const ideDirName = options.ide || detectIdeDirName(projectWorkDir);
  const projectIdeDir = path.resolve(projectWorkDir, ideDirName);

  // 用于内部处理（不存入配置文件）
  const staticSkillsSourceDir = path.resolve(skillPackageDir, "skills");     // 源技能目录

  console.log("[detect] Three core directories (stored in config):");
  console.log(`  1. project_work_dir:    ${projectWorkDir}`);
  console.log(`  2. project_ide_dir:     ${projectIdeDir}`);
  console.log(`  3. static_config_dir:   ${staticConfigDir} (IDE配置根目录)`);
  console.log("");
  console.log("[detect] Derived paths (computed at runtime):");
  console.log(`  - 静态技能: {static_config_dir}/skills/{技能名}/`);
  console.log(`  - 静态规则: {static_config_dir}/rules/{规则名}`);
  console.log(`  - 本技能包: ${skillPackageDir}`);
  console.log(`  - 项目技能: {project_ide_dir}/skills/fw-project-develop/`);

  return {
    // 三核心目录（存入配置）
    staticConfigDir,
    projectWorkDir,
    projectIdeDir,
    // 内部处理（不存入配置）
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
 * 同步静态技能目录
 * 将 skills/curated/ 下的技能拷贝到 {static_config_dir}/skills/
 */
function syncStaticSkills(skillPackageDir, staticConfigDir, dirNames, dryRun) {
  const results = [];
  const targetSkillsDir = path.resolve(staticConfigDir, "skills");  // 目标: ~/.qoder/skills/

  for (const dirName of dirNames) {
    const sourceCategoryDir = path.resolve(skillPackageDir, "skills", dirName);

    if (!directoryExists(sourceCategoryDir)) {
      console.log(`[skip] Source category not found: ${sourceCategoryDir}`);
      results.push({ dirName, status: "source_missing", sourceCategoryDir });
      continue;
    }

    // 遍历子目录，拷贝到 {static_config_dir}/skills/
    const childDirs = fs.readdirSync(sourceCategoryDir);
    
    for (const childName of childDirs) {
      const childSourceDir = path.resolve(sourceCategoryDir, childName);
      const childTargetDir = path.resolve(targetSkillsDir, childName);

      if (!directoryExists(childSourceDir)) {
        continue;
      }

      if (directoryExists(childTargetDir)) {
        console.log(`[skip] Target already exists: ${childTargetDir}`);
        results.push({ 
          category: dirName, 
          skillName: childName, 
          status: "target_exists", 
          sourceDir: childSourceDir, 
          targetDir: childTargetDir 
        });
        continue;
      }

      if (!dryRun) {
        fs.cpSync(childSourceDir, childTargetDir, { recursive: true, force: true });
        console.log(`[copy] ${childSourceDir} -> ${childTargetDir}`);
      } else {
        console.log(`[dry-run] Would copy: ${childSourceDir} -> ${childTargetDir}`);
      }

      results.push({ 
        category: dirName, 
        skillName: childName, 
        status: "copied", 
        sourceDir: childSourceDir, 
        targetDir: childTargetDir 
      });
    }
  }

  return results;
}

/**
 * 清理源目录
 * 删除 frontend-workmate/skills/curated/ 和 skills/external/
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
 * 创建项目配置文件
 * 仅存储三个核心目录路径
 */
function createConfigFile(paths, dryRun) {
  const configFilePath = path.resolve(paths.projectIdeDir, ".fw-session-config.json");

  // 只存储3个核心目录
  const config = {
    project_work_dir: paths.projectWorkDir,
    project_ide_dir: paths.projectIdeDir,
    static_config_dir: paths.staticConfigDir,
    created_at: new Date().toISOString(),
  };

  if (!dryRun) {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf-8");
    console.log(`[create] Config file: ${configFilePath}`);
  } else {
    console.log(`[dry-run] Would create: ${configFilePath}`);
  }

  return { configFilePath, config };
}

/**
 * 创建项目规则文件和状态文件
 * 存放在 {project_ide_dir}/rules/
 * 模板文件从 {skillPackageDir}/templates/ 读取
 */
function createProjectRules(paths, dryRun) {
  const ruleTemplatePath = path.resolve(paths.skillPackageDir, "templates", "fw-skill-rule.template.md");
  const stateTemplatePath = path.resolve(paths.skillPackageDir, "templates", "fw-session-state.template.md");
  const ruleFilePath = path.resolve(paths.projectIdeDir, "rules", "fw-skill-rule.md");
  const stateFilePath = path.resolve(paths.projectIdeDir, "rules", "fw-session-state.md");

  if (!fileExists(ruleTemplatePath)) {
    console.log(`[skip] Rule template not found: ${ruleTemplatePath}`);
    return { status: "template_missing", ruleFilePath, stateFilePath };
  }

  if (!fileExists(stateTemplatePath)) {
    console.log(`[skip] State template not found: ${stateTemplatePath}`);
    return { status: "state_template_missing", ruleFilePath, stateFilePath };
  }

  const ruleExists = fileExists(ruleFilePath);
  const stateExists = fileExists(stateFilePath);

  if (ruleExists && stateExists) {
    console.log(`[skip] Both files already exist: ${ruleFilePath}, ${stateFilePath}`);
    return { status: "files_exist", ruleFilePath, stateFilePath };
  }

  if (!dryRun) {
    if (!ruleExists) {
      const ruleTemplateContent = fs.readFileSync(ruleTemplatePath, "utf-8");
      fs.writeFileSync(ruleFilePath, ruleTemplateContent, "utf-8");
      console.log(`[create] Rule file: ${ruleFilePath}`);
    }

    if (!stateExists) {
      const stateTemplateContent = fs.readFileSync(stateTemplatePath, "utf-8");
      fs.writeFileSync(stateFilePath, stateTemplateContent, "utf-8");
      console.log(`[create] State file: ${stateFilePath}`);
    }
  } else {
    console.log(`[dry-run] Would create: ${ruleFilePath}`);
    console.log(`[dry-run] Would create: ${stateFilePath}`);
  }

  return { status: "created", ruleFilePath, stateFilePath };
}

/**
 * 创建项目技能目录（fw-project-develop）
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
    console.log(`[dry-run] Would create: ${projectSkillDir}`);
  }

  return { projectSkillDir };
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log("");
  console.log("=== frontend-workmate init-skills ===");
  console.log("");
  console.log("核心设计：三个目录（配置文件仅存储这3个）");
  console.log("  1. project_work_dir  - 用户项目根目录");
  console.log("  2. project_ide_dir   - 项目IDE配置根目录");
  console.log("  3. static_config_dir - 静态资源根目录（IDE配置根目录）");
  console.log("");
  console.log("其他路径拼接：");
  console.log("  - 静态技能: {static_config_dir}/skills/{技能名}/SKILL.md");
  console.log("  - 静态规则: {static_config_dir}/rules/{规则名}.md");
  console.log("  - 项目技能: {project_ide_dir}/skills/fw-project-develop/SKILL.md");
  console.log("  - 项目规则: {project_ide_dir}/rules/fw-skill-rule.md");
  console.log("  - 项目状态: {project_ide_dir}/rules/fw-session-state.md");
  console.log("");

  const paths = detectPaths(options);

  console.log("");
  console.log(`Mode: ${options.dryRun ? "dry-run" : "execute"}`);
  console.log(`Source dirs: ${options.dirs.join(", ")}`);
  console.log("");

  // 同步静态技能到 {static_config_dir}/skills/
  console.log("=== Syncing static skills ===");
  const syncResults = syncStaticSkills(paths.skillPackageDir, paths.staticConfigDir, options.dirs, options.dryRun);

  // 确保项目IDE目录结构存在
  console.log("");
  console.log("=== Creating project IDE directories ===");
  ensureDirectory(paths.projectIdeDir, options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "skills"), options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "rules"), options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "output"), options.dryRun);

  // 创建项目配置文件
  console.log("");
  console.log("=== Creating config file ===");
  const configResult = createConfigFile(paths, options.dryRun);

  // 创建项目规则文件
  console.log("");
  console.log("=== Creating project rules ===");
  const rulesResult = createProjectRules(paths, options.dryRun);

  // 创建项目技能目录
  console.log("");
  console.log("=== Creating project skill directory ===");
  const skillResult = createProjectSkillsDir(paths, options.dryRun);

  // 清理源目录
  if (!options.dryRun) {
    console.log("");
    console.log("=== Cleaning up source directories ===");
    cleanupSourceDirs(paths.skillPackageDir, options.dirs, options.dryRun);
  }

  // 输出摘要
  console.log("");
  console.log("=== Summary ===");
  console.log("");
  console.log("配置文件存储的三核心目录：");
  console.log(`  project_work_dir:  ${paths.projectWorkDir}`);
  console.log(`  project_ide_dir:   ${paths.projectIdeDir}`);
  console.log(`  static_config_dir: ${paths.staticConfigDir}`);
  console.log("");
  console.log("静态技能同步：");
  const copiedSkills = syncResults.filter(r => r.status === "copied");
  const existingSkills = syncResults.filter(r => r.status === "target_exists");
  
  if (copiedSkills.length > 0) {
    console.log(`  Copied (${copiedSkills.length}):`);
    for (const r of copiedSkills) {
      console.log(`    - ${r.skillName}`);
    }
  }
  
  if (existingSkills.length > 0) {
    console.log(`  Already exists (${existingSkills.length}):`);
    for (const r of existingSkills) {
      console.log(`    - ${r.skillName}`);
    }
  }
  
  console.log("");
  console.log("生成的文件：");
  console.log(`  配置文件: ${configResult.configFilePath}`);
  console.log(`  规则文件: ${rulesResult.ruleFilePath}`);
  console.log(`  状态文件: ${rulesResult.stateFilePath}`);
  console.log(`  项目技能: ${skillResult.projectSkillDir}`);
  console.log("");

  // 目录结构说明
  console.log("=== Directory structure ===");
  console.log("");
  console.log("# 静态资源根目录（static_config_dir）");
  console.log(`${paths.staticConfigDir}/`);
  console.log("  ├── skills/");
  console.log("  │   ├── frontend-workmate/    # 本技能包");
  console.log("  │   ├── react-best-practices/");
  console.log("  │   ├── systematic-debugging/");
  for (const r of copiedSkills) {
    console.log(`  │   ├── ${r.skillName}/`);
  }
  console.log("  │   └── ...");
  console.log("  ├── rules/");
  console.log("  │   └── ...");
  console.log("  └── ...");
  console.log("");
  console.log("# 项目IDE配置目录（project_ide_dir）");
  console.log(`${paths.projectIdeDir}/`);
  console.log("  ├── .fw-session-config.json");
  console.log("  ├── skills/");
  console.log("  │   └── fw-project-develop/");
  console.log("  ├── rules/");
  console.log("  │   ├── fw-skill-rule.md");
  console.log("  │   └── fw-session-state.md");
  console.log("  └── output/");
  console.log("");
  console.log("# 项目工作目录（project_work_dir）");
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