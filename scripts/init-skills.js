#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function printHelp() {
  console.log("Usage: node scripts/init-skills.js [options]");
  console.log("");
  console.log("Options:");
  console.log("  --repo-root <path>      Repository root. Default: parent of this script");
  console.log("  --target-root <path>    Shared skill workspace root. Default: auto-detect from repo sibling workspace");
  console.log("  --dirs <list>           Source skill directories under skills/. Default: curated,external");
  console.log("  --dry-run               Show planned actions without copying");
  console.log("  --help, -h              Show this help");
}

function parseArgs(argv) {
  const options = {
    repoRoot: path.resolve(__dirname, ".."),
    targetRoot: null,
    dirNames: ["curated", "external"],
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg === "--repo-root" && next) {
      options.repoRoot = path.resolve(next);
      index += 1;
    } else if (arg === "--target-root" && next) {
      options.targetRoot = path.resolve(next);
      index += 1;
    } else if (arg === "--dirs" && next) {
      options.dirNames = next
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      index += 1;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    }
  }

  if (!options.targetRoot) {
    options.targetRoot = path.resolve(options.repoRoot, "..");
  }

  return options;
}

function ensureDirectory(dirPath, dryRun) {
  if (!dryRun) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function hasAnyContent(dirPath) {
  if (!directoryExists(dirPath)) {
    return false;
  }

  return fs.readdirSync(dirPath).length > 0;
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function fileHasAnyContent(filePath) {
  return fileExists(filePath) && fs.statSync(filePath).size > 0;
}

function hasExistingTarget(targetPath) {
  if (directoryExists(targetPath)) {
    return hasAnyContent(targetPath);
  }

  if (fileExists(targetPath)) {
    return fileHasAnyContent(targetPath);
  }

  return false;
}

function copyChildEntries(sourceDir, targetDir, dryRun) {
  const childNames = fs.readdirSync(sourceDir);

  ensureDirectory(targetDir, dryRun);

  const copiedChildren = [];
  const skippedChildren = [];

  for (const childName of childNames) {
    const sourcePath = path.join(sourceDir, childName);
    const targetPath = path.join(targetDir, childName);

    if (hasExistingTarget(targetPath)) {
      skippedChildren.push(childName);
      continue;
    }

    copiedChildren.push(childName);

    if (!dryRun) {
      fs.cpSync(sourcePath, targetPath, {
        recursive: true,
        force: true,
        errorOnExist: false,
      });
    }
  }

  return {
    totalCount: childNames.length,
    copiedChildren,
    skippedChildren,
  };
}

function removeDirectory(dirPath, dryRun) {
  if (!dryRun) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function formatDirList(dirNames) {
  return dirNames.map((name) => `skills/${name}`).join(", ");
}

function resolveSharedSkillsRoot(targetRoot) {
  const normalizedBaseName = path.basename(targetRoot).toLowerCase();
  if (normalizedBaseName === "skills") {
    return targetRoot;
  }

  const candidates = [path.join(targetRoot, ".trae", "skills"), path.join(targetRoot, "skills")];

  for (const candidate of candidates) {
    if (directoryExists(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = options.repoRoot;
  const targetRoot = options.targetRoot;
  const sourceSkillsRoot = path.join(repoRoot, "skills");
  const targetSkillsRoot = resolveSharedSkillsRoot(targetRoot);

  if (!directoryExists(sourceSkillsRoot)) {
    throw new Error(`Source skills directory not found: ${sourceSkillsRoot}`);
  }

  const summary = [];

  console.log(`Repo root: ${repoRoot}`);
  console.log(`Target root: ${targetRoot}`);
  console.log(`Shared runtime skills root: ${targetSkillsRoot}`);
  console.log(`Source dirs: ${formatDirList(options.dirNames)}`);
  console.log(`Mode: ${options.dryRun ? "dry-run" : "copy"}`);

  for (const dirName of options.dirNames) {
    const sourceDir = path.join(sourceSkillsRoot, dirName);

    if (!directoryExists(sourceDir)) {
      summary.push({
        dirName,
        status: "missing_source",
        sourceDir,
        targetDir: targetSkillsRoot,
      });
      console.log(`[skip] skills/${dirName}: source directory not found`);
      continue;
    }

    const { totalCount, copiedChildren, skippedChildren } = copyChildEntries(
      sourceDir,
      targetSkillsRoot,
      options.dryRun
    );
    removeDirectory(sourceDir, options.dryRun);

    summary.push({
      dirName,
      status: options.dryRun ? "planned_sync_and_remove_source" : "synced_and_removed_source",
      sourceDir,
      targetDir: targetSkillsRoot,
      totalCount,
      copiedChildren,
      skippedChildren,
      removedSource: true,
    });
    if (copiedChildren.length > 0) {
      console.log(
        `[ok] skills/${dirName}: ${options.dryRun ? "planned sync" : "synced"} ${copiedChildren.length} entries -> ${targetSkillsRoot}`
      );
    }
    if (skippedChildren.length > 0) {
      console.log(
        `[skip] skills/${dirName}: ${skippedChildren.length} entries already exist in shared runtime skills root -> ${targetSkillsRoot}`
      );
    }
    console.log(
      `[ok] skills/${dirName}: ${options.dryRun ? "planned remove source" : "removed source"} -> ${sourceDir}`
    );
  }

  console.log("");
  console.log("Summary:");
  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
