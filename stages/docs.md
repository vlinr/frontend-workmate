# Stage 7: Documentation Sync

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain documentation sync content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "After user confirmation, xxx will happen" | Prohibited: imagining user feedback |

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output: `[Documentation Sync] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID

### 3. Auto-Transition to the Next Stage After Completion

**After documentation sync is complete**:
- Do not output a confirmation prompt
- Do not wait for user confirmation
- Auto-transition to stage8 (Delivery)

---

## Objective

This stage primarily accomplishes **two tasks**:

1. **Determine whether the project skill needs to be updated**
2. **Generate/update directory documentation**

---

## Execution Flow

**After entering this stage, execute in the following order**:

---

### Step 1: Update the State File

**First, update the state file**:

Find the state block corresponding to the current Task ID:
- Search for content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use the edit tool to replace the state block content with:

```
**Task ID**: {current task ID}
**Currently Executing**: Documentation Sync
**Stage**: stage7
**Status**: in_progress
**Next Step**: Determine whether to update project skill + generate directory documentation
```

---

### Step 2: Task 1 - Determine Whether to Update the Project Skill

**⚠️ Important: This step involves skill invocations and requires using the skill tool**

---

#### 2.1 Load the Existing Project Skill ⚠️ Skill Loading Checkpoint

**⚠️ Important: Must load the skill to obtain project knowledge**

Execute the following actions:

1. Load skill `fw-project-develop` to understand the project structure and technology stack
2. Obtain information about the project's directory structure, technology stack, build rules, etc. from the skill

**⚠️ Prohibited**:
- ❌ Prohibited: skipping skill loading and directly determining whether to update

---

#### 2.2 Analyze the Current Code Changes ⚠️ Skill Loading Checkpoint

**⚠️ Important: Needs to determine whether to load the fw-code-analysis-doc skill**

Execute the following actions:

1. Extract the actual modified code content from Stage 5

2. **Determine whether to load fw-code-analysis-doc**:

   **Conditions requiring loading (any one is sufficient)**:

   | Condition | Specific Check |
   | --- | --- |
   | Changes involve new modules | New directories or files added, not yet recorded in the existing project skill |
   | Changes involve complex dependencies | New dependency relationships between modules, need to update project skill |
   | AI cannot analyze on its own | Code changes are complex, requiring skill guidance |
   | Changes involve core architecture | Modified the project's core structure or configuration |

3. If the above conditions are met:
   - Load skill `fw-code-analysis-doc` to get analysis guidance
   - Analyze the module structure according to skill guidance

4. If conditions are not met:
   - Analyze the code changes directly

---

#### 2.3 Determine Whether an Update Is Needed

**Conditions requiring an update**:
- New long-term stable project knowledge has been added (e.g., new directory structure, new technology stack, new routing rules, etc.)
- Information recorded in the project skill is outdated
- New stable project constraints have been discovered

**Conditions that do not require an update**:
- The change only involves temporary implementations for the current task, which do not belong to long-term project knowledge

#### 2.4 Execute Update or Skip

- **Update needed**: Merge the new stable knowledge into `fw-project-develop`, output: `Project skill fw-project-develop has been updated`
- **No update needed**: Output: `Based on analysis, this change does not affect long-term project knowledge — no update required`

---

### Step 3: Task 2 - Generate/Update Directory Documentation

**Execute the following steps**:

#### 3.1 Extract the Set of Changed Directories

- Extract all directories involved from the actual files changed in Stage 5

#### 3.2 Process Each Directory ⚠️ Skill Loading Checkpoint

**⚠️ Important: For each changed directory, determine whether to load the skill**

**For each changed directory, execute the following actions**:

1. **Determine whether to load fw-code-analysis-doc**:

   **Conditions requiring loading (any one is sufficient)**:

   | Condition | Specific Check |
   | --- | --- |
   | Complex implementation relationships in the directory | Directory has > 5 files, or has multi-level nested structure |
   | Missing documentation | No README.md or AGENTS.md in the directory |
   | AI cannot analyze on its own | Directory logic is complex, dependency relationships are unclear |
   | Involves a core module | Directory is a core business module of the project |

2. If the above conditions are met:
   - Load skill `fw-code-analysis-doc` to get analysis guidance
   - Analyze the directory structure according to skill guidance

3. If conditions are not met:
   - Read the directory content directly for analysis

4. Check whether documentation already exists in the directory (README.md or similar documentation)
5. If yes → Update the document content
6. If no → Create a new document using the template

**⚠️ Prohibited**:
- ❌ Prohibited: skipping skill loading and creating documentation directly

#### 3.3 Output Processing Results

```
[Documentation Sync] The following directories have been processed:
- src/pages/ → README.md updated
- src/components/ → README.md created
```

---

### Step 4: Output Auto-Transition Prompt and Auto-Transition to the Next Stage

**After documentation sync is complete, output the auto-transition prompt**:

```
[Documentation Sync] Task ID: {current task ID}
Documentation sync complete.

Processing results:
- Project skill: [updated / no update needed]
- Directory documentation: [list of processed directories]

Proceeding to the next stage: [Delivery].
```

---

### Step 5: Update the State File to the Next Stage

**Before entering stage8, update the state file**:

```
**Task ID**: {current task ID}
**Currently Executing**: Delivery
**Stage**: stage8
**Status**: in_progress
**Next Step**: Output delivery results, wait for user confirmation
```

---

## Prohibited Actions

- Prohibited: pausing in stage7 to wait for user confirmation
- Prohibited: generating a single overall document (must process each directory individually)

---

## Rollback Conditions

- If implementation is still changing frequently, this stage can be deferred until Stage 6 is stable
- If Stage 6 has not reached a "passed" conclusion, do not enter this stage
