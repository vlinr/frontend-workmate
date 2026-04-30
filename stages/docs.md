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

### Step 2.1: Load Existing Project Skill ⚠️ Skill Loading Node

**⚠️ Important: Must load skill to get project knowledge**

**Execute Actions**:

1. Load skill `fw-project-develop` to understand project structure and tech stack
2. Get project's directory structure, tech stack, build rules etc. from skill

**⚠️ Prohibited Actions**:
- ❌ Prohibited from skipping skill loading directly judge whether to update

---

### Step 2.2: Analyze This Code Modification ⚠️ Skill Loading Node

**⚠️ Important: Need to judge whether to load fw-code-analysis-doc skill**

**Execute Actions**:

1. Extract code content actually modified in Stage 5

2. **Judge whether need to load fw-code-analysis-doc**:
   **Conditions for loading (satisfy any one)**:
   | Condition | Specific Judgment |
   | --- | --- |
   | Modification involves new module | Added directory or file, existing project skill not recorded |
   | Modification involves complex dependency | Module added new dependency relationship, need to update project skill |
   | AI cannot self-analyze | Code modification complex, need skill guidance |
   | Modification involves core architecture | Modified project's core structure or configuration |

3. If satisfies above conditions:
   - Load skill `fw-code-analysis-doc` to get analysis guidance
   - Analyze module structure based on skill guidance

4. If doesn't satisfy conditions:
   - Directly analyze code modification content

---

### Step 2.3: Judge if Need to Update

**Conditions for needing update**:
- Added long-term stable project knowledge (like new directory structure, new tech stack, new routing rules etc.)
- Info recorded in project skill is outdated
- Discovered new stable project constraints

**Conditions for not needing update**:
- Modifications only involve current task's temporary implementation, not project long-term knowledge

### Step 2.4: Execute Update or Skip

- **Need update**: Merge new stable knowledge into `fw-project-develop`, output: `Updated project skill fw-project-develop`
- **No need update**: Output: `After analysis, this modification doesn't affect project skill long-term knowledge, no need to update`

## Task 2: Generate/Update Directory Documentation (Mandatory Execution)

**After Task 1 completes, must execute this task**:

### Mandatory Rule: Must Process Per Directory

**Prohibited from generating single total document, must process each directory following this flow**:

### Step 3.1: Extract Modification Directory Set

- Extract all involved directories from Stage 5's actual modified files
- Example: Modified `src/pages/Home.tsx`, `src/components/Header.tsx` → Directory set is `src/pages/`, `src/components/`

### Step 3.2: Process Per Directory ⚠️ Skill Loading Node

**⚠️ Important: For each modification directory need to judge whether to load skill**

**For each modification directory execute the following actions**:

1. **Judge whether need to load fw-code-analysis-doc**:

   **Conditions for loading (satisfy any one)**:
   | Condition | Specific Judgment |
   | --- | --- |
   | Directory implementation relationship complex | File count under directory > 5, or exists multi-level nested structure |
   | Lacks documentation | No README.md or AGENTS.md under directory |
   | AI cannot self-analyze | Directory logic complex, dependency relationships unclear |
   | Involves core module | Directory is project's core business module |

2. If satisfies above conditions:
   - Load skill `fw-code-analysis-doc` to get analysis guidance
   - Analyze directory structure based on skill guidance

3. If doesn't satisfy conditions:
   - Directly read directory content to analyze

4. Check if directory already has documentation (README.md or similar)
5. If yes → Update that document content
6. If no → Use `templates/docs/directory-readme-template.md` create new document

**⚠️ Prohibited Actions**:
- ❌ Prohibited from skipping skill loading directly create document

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