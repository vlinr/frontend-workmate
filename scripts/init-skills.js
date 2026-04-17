#!/usr/bin/env node

/**
 * init-skills.js - 前端研发技能包初始化脚本
 * 
 * 核心逻辑：
 * 1. 脚本位置：<项目根>/<IDE>/skills/<技能名>/scripts/init-skills.js
 * 2. 向上跳过 <技能名>/scripts → 到达 skills 目录
 * 3. 再向上跳过 skills → 到达 <IDE> 目录（包含 skills 的父目录）
 * 4. 在 <IDE> 目录下，skills 已存在，只需检查/创建 rules 目录
 * 5. 将 skills/<技能名>/skills/ 下的内容同步到 skills/ 目录
 * 6. 创建 rules/fw-skill-rule.md 会话状态文件
 */

const fs = require("fs");
const path = require("path");

function printHelp() {
  console.log("Usage: node scripts/init-skills.js [options]");
  console.log("");
  console.log("Options:");
  console.log("  --dirs <list>     Source skill directories. Default: curated,external");
  console.log("  --dry-run         Show planned actions without executing");
  console.log("  --help, -h        Show this help");
}

function parseArgs(argv) {
  const options = {
    dirs: ["curated", "external"],
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
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
 * 智能路径检测
 * 
 * 脚本位置: <项目根>/<IDE>/skills/<技能名>/scripts/init-skills.js
 * 
 * 向上推导：
 * - scriptsDir = <项目根>/<IDE>/skills/<技能名>/scripts
 * - skillPkgDir = <项目根>/<IDE>/skills/<技能名>  (向上1层)
 * - skillsDir   = <项目根>/<IDE>/skills           (向上2层，skills目录)
 * - ideDir      = <项目根>/<IDE>                  (向上3层，IDE目录)
 * - projectRoot = <项目根>                        (向上4层，项目根目录)
 */
function detectPaths() {
  const scriptsDir = __dirname;
  const skillPkgDir = path.resolve(scriptsDir, "..");      // <技能名> 目录
  const skillsDir = path.resolve(skillPkgDir, "..");       // skills 目录
  const ideDir = path.resolve(skillsDir, "..");            // IDE 目录
  const projectRoot = path.resolve(ideDir, "..");          // 项目根目录
  const rulesDir = path.resolve(ideDir, "rules");          // rules 目录

  console.log("[detect] Paths detected:");
  console.log(`  - Script dir:    ${scriptsDir}`);
  console.log(`  - Skill pkg dir: ${skillPkgDir}`);
  console.log(`  - Skills dir:    ${skillsDir}`);
  console.log(`  - IDE dir:       ${ideDir}`);
  console.log(`  - Rules dir:     ${rulesDir}`);
  console.log(`  - Project root:  ${projectRoot}`);

  return {
    scriptsDir,
    skillPkgDir,
    skillsDir,
    ideDir,
    projectRoot,
    rulesDir,
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
 * 同步技能目录内容
 * 将 skills/<技能名>/skills/<dir>/ 下的子目录平铺拷贝到 skills/ 目录
 * 
 * 例如：
 * - skills/curated/accessibility/ → skills/accessibility/
 * - skills/curated/react-best-practices/ → skills/react-best-practices/
 * 
 * 而不是：
 * - skills/curated/ → skills/curated/（错误：整个目录拷贝）
 */
function syncSkillDirs(skillPkgDir, skillsDir, dirNames, dryRun) {
  const results = [];

  for (const dirName of dirNames) {
    const sourceCategoryDir = path.resolve(skillPkgDir, "skills", dirName);

    if (!directoryExists(sourceCategoryDir)) {
      console.log(`[skip] Source category not found: ${sourceCategoryDir}`);
      results.push({ dirName, status: "source_missing", sourceCategoryDir });
      continue;
    }

    // 遍历子目录，平铺拷贝
    const childDirs = fs.readdirSync(sourceCategoryDir);
    
    for (const childName of childDirs) {
      const childSourceDir = path.resolve(sourceCategoryDir, childName);
      const childTargetDir = path.resolve(skillsDir, childName);

      // 只处理目录
      if (!directoryExists(childSourceDir)) {
        continue;
      }

      // 检查目标目录是否已存在
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

      // 拷贝子目录
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
 * 创建会话状态规则文件
 * 在 rules/ 目录下创建 fw-skill-rule.md，并记录路径到配置文件
 */
function createSkillRuleFile(skillPkgDir, rulesDir, dryRun) {
  const templatePath = path.resolve(skillPkgDir, "templates", "fw-skill-rule.template.md");
  const ruleFilePath = path.resolve(rulesDir, "fw-skill-rule.md");
  const configFilePath = path.resolve(skillPkgDir, ".fw-session-config.json");

  // 检查模板是否存在
  if (!fileExists(templatePath)) {
    console.log(`[skip] Template not found: ${templatePath}`);
    return { status: "template_missing", templatePath, ruleFilePath, configFilePath };
  }

  // 确保 rules 目录存在
  ensureDirectory(rulesDir, dryRun);

  // 检查目标文件是否已存在
  if (fileExists(ruleFilePath)) {
    console.log(`[skip] Rule file already exists: ${ruleFilePath}`);
    
    // 即使文件已存在，也要更新配置文件（记录路径）
    if (!dryRun) {
      const config = {
        rules_file_path: ruleFilePath,
        created_at: new Date().toISOString(),
        skill_package_dir: skillPkgDir
      };
      fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf-8");
      console.log(`[update] Config file: ${configFilePath}`);
    }
    
    return { status: "rule_exists", templatePath, ruleFilePath, configFilePath };
  }

  // 拷贝模板到 rules 目录
  if (!dryRun) {
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    
    // 在模板中注入 rules_file_path
    const contentWithPath = templateContent.replace(
      '<!-- CURRENT_STATUS_START -->',
      `<!-- CURRENT_STATUS_START -->\n<!-- RULES_FILE_PATH: ${ruleFilePath} -->`
    );
    
    fs.writeFileSync(ruleFilePath, contentWithPath, "utf-8");
    console.log(`[create] Rule file: ${ruleFilePath}`);
    
    // 创建配置文件，记录 rules 文件路径
    const config = {
      rules_file_path: ruleFilePath,
      created_at: new Date().toISOString(),
      skill_package_dir: skillPkgDir
    };
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf-8");
    console.log(`[create] Config file: ${configFilePath}`);
  } else {
    console.log(`[dry-run] Would create: ${ruleFilePath}`);
    console.log(`[dry-run] Would create: ${configFilePath}`);
  }

  return { status: "created", templatePath, ruleFilePath, configFilePath };
}

/**
 * 清理源目录
 * 拷贝完成后删除 skills/<技能名>/skills/<category>/ 目录
 */
function cleanupSourceDirs(skillPkgDir, dirNames, dryRun) {
  for (const dirName of dirNames) {
    const sourceDir = path.resolve(skillPkgDir, "skills", dirName);

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

function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log("");
  console.log("=== frontend-workmate init-skills ===");
  console.log("");

  // 检测路径
  const paths = detectPaths();

  console.log("");
  console.log(`Mode: ${options.dryRun ? "dry-run" : "execute"}`);
  console.log(`Source dirs: ${options.dirs.join(", ")}`);
  console.log("");

  // 确保 rules 目录存在
  ensureDirectory(paths.rulesDir, options.dryRun);

  // 同步技能目录
  console.log("");
  console.log("=== Syncing skill directories ===");
  const syncResults = syncSkillDirs(paths.skillPkgDir, paths.skillsDir, options.dirs, options.dryRun);

  // 创建会话状态规则文件
  console.log("");
  console.log("=== Creating skill rule file ===");
  const ruleResult = createSkillRuleFile(paths.skillPkgDir, paths.rulesDir, options.dryRun);

  // 清理源目录（仅在非 dry-run 且拷贝成功时）
  if (!options.dryRun) {
    console.log("");
    console.log("=== Cleaning up source directories ===");
    cleanupSourceDirs(paths.skillPkgDir, options.dirs, options.dryRun);
  }

  // 输出摘要
  console.log("");
  console.log("=== Summary ===");
  console.log("");
  console.log("Skills synced:");
  const copiedSkills = syncResults.filter(r => r.status === "copied");
  const existingSkills = syncResults.filter(r => r.status === "target_exists");
  
  if (copiedSkills.length > 0) {
    console.log(`  Copied (${copiedSkills.length}):`);
    for (const r of copiedSkills) {
      console.log(`    - ${r.skillName} (from ${r.category})`);
    }
  }
  
  if (existingSkills.length > 0) {
    console.log(`  Already exists (${existingSkills.length}):`);
    for (const r of existingSkills) {
      console.log(`    - ${r.skillName}`);
    }
  }
  
  console.log("");
  console.log(`Rule file: ${ruleResult.status}`);
  console.log("");

  // 最终目录结构说明
  console.log("=== Directory structure ===");
  console.log("");
  console.log(`${paths.ideDir}/`);
  console.log(`  ├── skills/`);
  for (const r of copiedSkills) {
    console.log(`  │   ├── ${r.skillName}/     (已同步)`);
  }
  console.log(`  │   └── ...`);
  console.log(`  └── rules/`);
  console.log(`      └── fw-skill-rule.md`);
  console.log("");
}

try {
  main();
} catch (error) {
  console.error("[error]", error.message);
  process.exit(1);
}