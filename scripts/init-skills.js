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
 * 
 * 改进逻辑：
 * - 技能同步：检查版本号或 SKILL.md 内容变化，有变化则更新
 * - 配置文件：验证三核心目录是否正确，不正确则更新
 * - rules 文件：检查模板是否有变更，有变更则更新
 * - 状态文件：保留现有内容，不覆盖（有任务数据）
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
 * 检测三个核心目录
 * 配置文件只存储这3个，其他路径通过拼接
 */
function detectPaths(options) {
  // 1. 静态资源根目录：通过脚本位置确定（IDE配置根目录，如 ~/.qoder）
  const scriptsDir = __dirname;                                              // scripts 目录
  const skillPackageDir = path.resolve(scriptsDir, "..");                    // frontend-workmate 目录
  const skillsDir = path.resolve(skillPackageDir, "..");                     // skills 目录
  const staticConfigDir = path.resolve(skillsDir, "..");                     // IDE配置根目录（如 ~/.qoder）

// 2. 用户项目根目录：优先从 staticConfigDir 推导，其次使用参数或 process.cwd()
  let projectWorkDir;
  let projectIdeDir;
  let ideDirName;

  // 从 staticConfigDir 提取 IDE 目录名
  ideDirName = path.basename(staticConfigDir);

  // 优先级：
  // 1. 自动识别：staticConfigDir 的父目录就是项目根目录
  // 2. 用户传入 --workdir 时，验证是否与自动识别一致
  const autoDetectedWorkDir = path.resolve(staticConfigDir, "..");
  
  if (options.workdir) {
    // 用户指定了目录，验证是否正确
    const normalizedWorkDir = path.normalize(options.workdir);
    const normalizedAutoDir = path.normalize(autoDetectedWorkDir);
    
    if (normalizedWorkDir !== normalizedAutoDir) {
      console.error("");
      console.error("[error] --workdir 参数值不正确！");
      console.error("");
      console.error(`传入值:       ${options.workdir}`);
      console.error(`正确值:       ${autoDetectedWorkDir} (用户工作目录)`);
      console.error(`staticConfigDir: ${staticConfigDir}`);
      console.error("");
      console.error("说明：");
      console.error("  - project_work_dir 应为用户工作目录，不是前端项目目录");
      console.error("  - 前端项目可能在子目录中，但配置基于工作目录");
      console.error("  - 建议：不传 --workdir，让脚本自动识别");
      console.error("");
      console.error("正确调用方式：");
      console.error(`  node scripts/init-skills.js`);
      console.error("");
      process.exit(1);
    }
    
    // 验证通过，使用自动识别值
    projectWorkDir = autoDetectedWorkDir;
    projectIdeDir = staticConfigDir;
    console.log("[detect] User-specified workdir matches auto-detected directory:");
  } else {
    // 自动识别：staticConfigDir 的父目录就是项目根目录
    console.log("[detect] Auto-detected project root directory:");
  }
  
  projectWorkDir = autoDetectedWorkDir;
  projectIdeDir = staticConfigDir;
  console.log(`  project_work_dir: ${projectWorkDir} (derived from staticConfigDir parent)`);
  console.log(`  project_ide_dir: ${projectIdeDir} (equals staticConfigDir)`);

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
 * 获取技能版本信息
 * 从 SKILL.md 的 YAML frontmatter 中提取 description 作为版本标识
 */
function getSkillVersion(skillDir) {
  const skillMdPath = path.resolve(skillDir, "SKILL.md");
  if (!fileExists(skillMdPath)) {
    return null;
  }
  
  const content = fs.readFileSync(skillMdPath, "utf-8");
  // 提取 frontmatter 中的 description 作为版本标识
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const descMatch = frontmatter.match(/description:\s*(.+)/);
    if (descMatch) {
      return descMatch[1].trim();
    }
  }
  
  // 如果没有 description，使用文件修改时间作为版本
  const stat = fs.statSync(skillMdPath);
  return stat.mtimeMs.toString();
}

/**
 * 检查技能是否需要更新
 * 对比源目录和目标目录的 SKILL.md 内容
 */
function needsSkillUpdate(sourceDir, targetDir, force) {
  if (!directoryExists(targetDir)) {
    return { needsUpdate: true, reason: "target_missing" };
  }
  
  if (force) {
    return { needsUpdate: true, reason: "force_update" };
  }
  
  // 检查源目录是否还存在（如果存在说明还没清理，需要同步）
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
 * 同步静态技能目录（改进版）
 * 
 * 新逻辑：
 * 1. 如果目标不存在 → 拷贝
 * 2. 如果源目录还存在 → 更新（说明技能包有变更）
 * 3. 如果 force=true → 强制更新
 * 4. 否则检查版本变化 → 有变化则更新
 */
function syncStaticSkills(skillPackageDir, staticConfigDir, dirNames, force, dryRun) {
  const results = [];
  const targetSkillsDir = path.resolve(staticConfigDir, "skills");

  for (const dirName of dirNames) {
    const sourceCategoryDir = path.resolve(skillPackageDir, "skills", dirName);

    if (!directoryExists(sourceCategoryDir)) {
      console.log(`[skip] Source category not found: ${sourceCategoryDir}`);
      results.push({ dirName, status: "source_missing", sourceCategoryDir });
      continue;
    }

    const childDirs = fs.readdirSync(sourceCategoryDir);
    
    for (const childName of childDirs) {
      const childSourceDir = path.resolve(sourceCategoryDir, childName);
      const childTargetDir = path.resolve(targetSkillsDir, childName);

      if (!directoryExists(childSourceDir)) {
        continue;
      }

      // 改进：检查是否需要更新
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

      // 需要更新：先删除目标目录（如果存在），再拷贝
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
 * 检查配置文件是否需要更新
 * 验证三核心目录是否正确
 */
function needsConfigUpdate(configFilePath, paths) {
  if (!fileExists(configFilePath)) {
    return { needsUpdate: true, reason: "config_missing" };
  }
  
  try {
    const existingConfig = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    
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
 * 创建或更新项目配置文件（改进版）
 * 
 * 新逻辑：
 * 1. 配置不存在 → 创建
 * 2. 配置存在但路径不正确 → 更新
 * 3. 配置正确 → 跳过
 */
function createOrUpdateConfigFile(paths, dryRun) {
  const configFilePath = path.resolve(paths.projectIdeDir, ".fw-session-config.json");

  const expectedConfig = {
    project_work_dir: paths.projectWorkDir,
    project_ide_dir: paths.projectIdeDir,
    static_config_dir: paths.staticConfigDir,
    created_at: new Date().toISOString(),
  };

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
 * 检查 rules 文件是否需要更新
 * 对比模板文件和现有文件内容
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
  
  if (templateContent !== fileContent) {
    return { needsUpdate: true, reason: "content_changed" };
  }
  
  return { needsUpdate: false, reason: "content_match" };
}

/**
 * 创建或更新项目规则文件（改进版）
 * 
 * 新逻辑：
 * 1. 文件不存在 → 创建
 * 2. 文件存在但模板有变更 → 更新
 * 3. 内容相同 → 跳过
 * 
 * 注意：状态文件不更新（保留任务数据）
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

  // 处理 rule 文件（改进：检查模板变更）
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

  // 处理 state 文件（保留现有内容，不覆盖）
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
 * 创建项目技能目录和初始 SKILL.md（fw-project-develop）
 */
function createProjectSkillsDir(paths, dryRun) {
  const projectSkillDir = path.resolve(paths.projectIdeDir, "skills", "fw-project-develop");
  const skillMdPath = path.resolve(projectSkillDir, "SKILL.md");

  // 初始 SKILL.md 内容（占位符，等待 Stage 1 项目扫描填充）
  const initialSkillMd = `---
name: fw-project-develop
description: 项目上下文技能，包含技术栈、目录结构、路由规则、权限约束、状态管理、构建配置等。用户询问"项目结构"、"技术栈是什么"、"路由怎么配置"、"权限怎么处理"、"状态管理方案"、"构建规则"等项目相关信息时触发调用。同时适用于流程中需要"获取项目约束"、"了解项目上下文"、"确认项目规则"的场景。
---

# 项目上下文技能（待生成）

## 状态

**当前状态**：待生成（initial）

此技能目录已创建，但内容需要在 Stage 1 项目扫描阶段填充。

## 触发条件

用户询问以下项目相关信息时触发调用：
- "项目结构"、"目录结构"、"技术栈是什么"
- "路由怎么配置"、"路由规则"、"权限怎么处理"
- "状态管理方案"、"构建规则"、"构建配置"

## 调用场景

- 用户主动询问项目信息
- frontend-workmate 流程中的 Stage 2（范围分析）、Stage 5（实施研发）、Stage 6（内部验证）
- 需要了解项目约束时（如修改代码前确认技术栈、路由规则等）

## 下一步

执行 Stage 1 项目扫描，分析项目并生成完整的项目技能内容。

---

> 此文件由 init-skills.js 自动生成，请勿手动编辑。
`;

  if (!dryRun) {
    // 创建目录
    if (!fs.existsSync(projectSkillDir)) {
      fs.mkdirSync(projectSkillDir, { recursive: true });
      console.log(`[create] Project skill directory: ${projectSkillDir}`);
    } else {
      console.log(`[skip] Project skill directory already exists: ${projectSkillDir}`);
    }

    // 创建初始 SKILL.md
    if (!fs.existsSync(skillMdPath)) {
      fs.writeFileSync(skillMdPath, initialSkillMd, "utf-8");
      console.log(`[create] Initial SKILL.md: ${skillMdPath}`);
    } else {
      console.log(`[skip] SKILL.md already exists: ${skillMdPath}`);
    }
  } else {
    console.log(`[dry-run] Would create: ${projectSkillDir}`);
    console.log(`[dry-run] Would create: ${skillMdPath}`);
  }

  return { projectSkillDir, skillMdPath };
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
  console.log("改进逻辑：");
  console.log("  - 技能同步：检查版本变化，有变化则更新");
  console.log("  - 配置文件：验证路径正确性，不正确则更新");
  console.log("  - rules 文件：检查模板变更，有变更则更新");
  console.log("  - 状态文件：保留现有内容（有任务数据）");
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
  console.log(`Force update: ${options.force ? "yes" : "no"}`);
  console.log(`Source dirs: ${options.dirs.join(", ")}`);
  console.log("");

  // 同步静态技能到 {static_config_dir}/skills/
  console.log("=== Syncing static skills ===");
  const syncResults = syncStaticSkills(paths.skillPackageDir, paths.staticConfigDir, options.dirs, options.force, options.dryRun);

  // 确保项目IDE目录结构存在
  console.log("");
  console.log("=== Creating project IDE directories ===");
  ensureDirectory(paths.projectIdeDir, options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "skills"), options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "rules"), options.dryRun);
  ensureDirectory(path.resolve(paths.projectIdeDir, "output"), options.dryRun);

  // 创建或更新项目配置文件
  console.log("");
  console.log("=== Creating/Updating config file ===");
  const configResult = createOrUpdateConfigFile(paths, options.dryRun);

  // 创建或更新项目规则文件
  console.log("");
  console.log("=== Creating/Updating project rules ===");
  const rulesResult = createOrUpdateProjectRules(paths, options.dryRun);

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
  const updatedSkills = syncResults.filter(r => r.status === "updated");
  const skippedSkills = syncResults.filter(r => r.status === "no_update_needed");
  
  if (copiedSkills.length > 0) {
    console.log(`  新增 (${copiedSkills.length}):`);
    for (const r of copiedSkills) {
      console.log(`    - ${r.skillName}`);
    }
  }
  
  if (updatedSkills.length > 0) {
    console.log(`  更新 (${updatedSkills.length}):`);
    for (const r of updatedSkills) {
      console.log(`    - ${r.skillName} (${r.reason})`);
    }
  }
  
  if (skippedSkills.length > 0) {
    console.log(`  无需更新 (${skippedSkills.length}):`);
    for (const r of skippedSkills) {
      console.log(`    - ${r.skillName} (${r.reason})`);
    }
  }
  
  console.log("");
  console.log("生成的/更新的文件：");
  console.log(`  配置文件: ${configResult.configFilePath} (${configResult.status})`);
  console.log(`  规则文件: ${rulesResult.rule.filePath} (${rulesResult.rule.status})`);
  console.log(`  状态文件: ${rulesResult.state.filePath} (${rulesResult.state.status})`);
  console.log(`  项目技能: ${skillResult.projectSkillDir}`);
  console.log("");

  // 目录结构说明
  console.log("=== Directory structure ===");
  console.log("");
  console.log("# 静态资源根目录（static_config_dir）");
  console.log(`${paths.staticConfigDir}/`);
  console.log("  ├── skills/");
  console.log("  │   ├── frontend-workmate/    # 本技能包");
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