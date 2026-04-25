# Stage 7: Documentation Sync

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain documentation sync content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "After user confirmation, xxx" | Prohibited from imagining user feedback |
| "Proceeding to delivery next" | Prohibited from outputting subsequent phase plans |

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output: `[Documentation Sync] Task ID: task_xxxxxxxx`
- State file update must carry Task ID

### 3. After Completion, Automatically Proceed to Next Phase

**After documentation sync completes**:
- Don't output confirmation prompt
- Don't wait for user confirmation
- Automatically proceed to stage8 (Delivery)

---

## Goal

This phase mainly implements **two tasks**:

1. **Judge if need to update project skill**: Analyze updated code through code analysis skill, judge if there's content that can be updated to project skill `fw-project-develop`, if yes then update
2. **Generate/Update directory documentation**: Through code analysis, generate or update documentation under code modification directories (per directory)

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Record to Context) |
| --- | --- | --- |
| Project skill update judgment | Code modification (return to stage5) |
| Directory documentation generation/update | Verification execution |
| Documentation content extraction | User confirmation (stage8) |

**This phase is automatic execution phase, doesn't receive user input**:

```
User cannot provide content in this phase, because:
- This phase doesn't pause waiting for user
- Automatically executes documentation sync flow
- After completion automatically proceeds to stage8

User proposes documentation issues in stage8, will return to stage5 → stage6 → stage7 to re-sync
```

**Note**:
- This phase doesn't receive user content, automatically executes documentation sync
- Documentation content extracted from code, doesn't depend on user input

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit When Entering This Phase

**Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
- Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use edit tool to replace that status block content with:

```
**Currently Executing**: Documentation Sync
**Phase**: stage7
**Status**: in_progress
**Next Step**: Judge if update project skill + Generate directory documentation, after completion automatically proceed to stage8
**User Proposed Modifications**: Handle uniformly in stage8
**Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
```

### Edit Again After Phase Completion

**After completion directly proceed to stage8** (no pause waiting for user confirmation):

Use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Delivery
**Phase**: stage8
**Status**: in_progress
**Next Step**: Output delivery results, wait for user confirmation
**User Proposed Modifications**: Immediately switch to stage5 → loop
**Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
```

### Prohibited Actions

- Prohibited from guessing paths without reading config file
- **Prohibited from pausing in stage7 waiting for user confirmation** (directly execute to stage8)

## Task 1: Judge if Need to Update Project Skill

**Must execute this task first, then execute Task 2**:

1. **Read Existing Project Skill**: **First read config file** `{project_ide_dir}/.fw-session-config.json`, read `{project_ide_dir}/skills/fw-project-develop/SKILL.md`
2. **Analyze This Code Modification**:
   - Extract code content actually modified in Stage 5
   - **Must first read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` analyze modification impact
3. **Judge if Need to Update Project Skill**:
   - **Need update** conditions:
     - Added long-term stable project knowledge (like new directory structure, new tech stack, new routing rules etc.)
     - Info recorded in project skill is outdated (like directory structure changed but skill not synced)
     - Discovered new stable project constraints (like new build rules, new state management solution etc.)
   - **No need update** conditions:
     - Modifications only involve current task's temporary implementation, not project long-term knowledge
     - Modifications don't affect stable info recorded in project skill
4. **Execute Update (If Needed)**:
   - Merge new stable knowledge into `fw-project-develop`
   - Output: `Updated project skill fw-project-develop, added content: [specific added items]`
5. **Skip Update (If Not Needed)**:
   - Output: `After analysis, this modification doesn't affect project skill long-term knowledge, no need to update fw-project-develop`

## Task 2: Generate/Update Directory Documentation (Mandatory Execution)

**After Task 1 completes, must execute this task**:

### Mandatory Rule: Must Process Per Directory

**Prohibited from generating single total document, must process each directory following this flow**:

1. **Extract Modification Directory Set**:
   - Extract all involved directories from Stage 5's actual modified files
   - Example: Modified `src/pages/Home.tsx`, `src/components/Header.tsx` → Directory set is `src/pages/`, `src/components/`

2. **For Each Modification Directory Execute the Following Steps**:
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
   - If directory implementation relationships complex, **dynamically concatenate path** `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` analyze that directory
   - Check if directory already has documentation (README.md or similar)
   - If yes → Update that document content
   - If no → Use `templates/docs/directory-readme-template.md` create new document

3. **Directory Documentation Content Requirements**:
   - Function purpose: What this directory is for
   - Directory structure: Subdirectory and file descriptions
   - Usage scenarios: When to use code in this directory
   - Usage rules: Import methods, invocation rules
   - Examples: Usage examples
   - Notes: Special handling, constraint conditions

4. **Output Example**:
   ```
   [Documentation Sync] Processed the following directories:
   - src/pages/ → Updated README.md (added Home page description)
   - src/components/ → Created README.md (Header component description)
   - src/styles/ → No need update (this modification doesn't involve long-term knowledge)
   ```

5. After this phase completes directly enter Stage 8, no extra pause for confirmation.

## Output

This phase output includes two tasks' artifacts:

**Task 1 Artifact**:
- Updated project skill `fw-project-develop` (if needed)
- Project skill update summary: `Updated project skill fw-project-develop, added content: [specific added items]` or `No need update fw-project-develop`

**Task 2 Artifact**:
- Updated directory documentation (README.md or similar under each modification directory)

## Fallback Conditions

- If implementation still frequently changing, can postpone this phase, wait for Stage 6 stable before executing.
- If Stage 6 hasn't formed "pass" conclusion, or only gave environment fix suggestions but hasn't completed retry, cannot enter this phase.