# Stage 6: Verification

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain validation content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "Documentation update plan" | Prohibited: documentation-stage content |
| "After user confirmation, xxx will happen" | Prohibited: imagining user feedback |

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output: `[Verification] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID

### 3. Auto-Transition to the Next Stage After Completion

**After verification is complete**:
- Do not output a confirmation prompt
- Do not wait for user confirmation
- Auto-transition to stage7 (Documentation Sync)

---

## Objective

- Verify that changes are genuinely effective before delivery
- **Auto-transition to stage7 after completion — do not pause to wait for user confirmation**

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
**Currently Executing**: Verification
**Stage**: stage6
**Status**: in_progress
**Next Step**: Execute functional validation, lint/type/build/test
```

---

### Step 2: Load Relevant Skills

**⚠️ Important: Before starting validation, the project skill needs to be loaded to obtain validation constraints**

Execute the following actions:

1. Load skill `fw-project-develop` to understand the project's build rules and validation constraints
2. Obtain the project's build rules and validation constraints from the skill
3. Understand the project's lint/type/build configuration

---

### Step 3: Execute Validation Actions

**⚠️ Important: The following validations must be executed in order; special validations involve skill invocations**

---

#### 3.1 Basic Checks

Execute the following actions:

1. lint check
2. type check
3. build check

---

#### 3.2 Functional Validation

Execute the following actions:

1. Functional correctness validation
2. Key interaction validation
3. Regression path validation

---

#### 3.3 Special Validation ⚠️ Skill Loading Checkpoint

**⚠️ Important: Based on the change type, must determine whether to load validation skills**

**Determine the change type**:

| Change Type | Specific Determination Conditions |
| --- | --- |
| **Page/component changes** | Involves user interface rendering; involves visual elements; involves user interaction components; involves page structure |
| **Style/UI changes** | Involves style definitions; involves layout adjustments; involves visual design; involves theme/color/font configuration |

**⚠️ Note**:
- The above determination conditions apply to all frontend technology stacks (React/Vue/Angular/Svelte, etc.)
- Specific file formats are not restricted (can be .tsx/.vue/.jsx/.svelte, etc.)
- Specific style formats are not restricted (can be .css/.less/.scss/.stylus, etc.)

**Based on the determination result, execute skill loading**:

| Change Type | Skill to Load | Loading Action |
| --- | --- | --- |
| Page/component changes | `fw-accessibility` | Load skill `fw-accessibility` to check WCAG accessibility |
| Style/UI changes | `fw-web-design-guidelines` | Load skill `fw-web-design-guidelines` to audit UI design standards |

**Execute the following actions**:

1. Determine the current change type based on the table above

2. If **page/component changes** are involved:
   - Load skill `fw-accessibility` to check WCAG accessibility
   - Validate whether the changes meet accessibility standards according to skill guidance

3. If **style/UI changes** are involved:
   - Load skill `fw-web-design-guidelines` to audit UI design standards
   - Validate whether the changes meet UI design standards according to skill guidance

4. If no special validation is required:
   - Skip skill loading and continue outputting validation results

**⚠️ Prohibited**:
- ❌ Prohibited: skipping skill loading and outputting validation results directly
- ❌ Prohibited: loading skills without determining the change type

---

### Step 4: Handle Validation Results

**Based on validation results, determine the next step**:

| Validation Result | Next Action |
| --- | --- |
| All passed | Output validation results → Auto-transition to the next stage (stage7) |
| Code issue failure | Return to stage5 to fix → Re-execute validation flow |
| Environment issue failure | Output environment fix recommendations → Stay in stage6 and wait for fix |

---

### Step 5: Output Validation Results and Auto-Transition to the Next Stage

**After validation passes, output results and auto-transition to stage7**:

```
[Verification] Task ID: {current task ID}
Verification complete.

Validation results:
- lint: passed
- type: passed
- build: passed
- Functional validation: passed

Proceeding to the next stage: [Documentation Sync].
```

---

### Step 6: Update the State File to the Next Stage

**Before entering stage7, update the state file**:

```
**Task ID**: {current task ID}
**Currently Executing**: Documentation Sync
**Stage**: stage7
**Status**: in_progress
**Next Step**: Determine whether to update project skill + generate directory documentation
```

---

## Prohibited Actions

- Prohibited: pausing in stage6 to wait for user confirmation
- Prohibited: outputting "please confirm the validation results"

---

## Rollback Conditions

- If any critical validation fails, return to Stage 5, then automatically execute Stage 6 → Stage 7 → Stage 8 after fixing
- If the failure is caused by an environment blocker, output environment fix recommendations and stay in Stage 6 waiting for the fix
