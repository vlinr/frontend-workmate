# Stage 3: Establish Execution Plan

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain execution plan content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "Specific implementation steps" | Prohibited: specific implementation details |

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output: `[Execution Plan] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID

### 3. Auto-Transition to the Next Stage After Completion

**After the execution plan is established**:
- Do not output a confirmation prompt
- Auto-transition to stage4 (Material Supply)

---

## Objective

- Enable complex tasks to have step-by-step execution and checkpoint resume capabilities

---

## Entry Conditions

Enter this stage when any of the following conditions are met:
- Task has multiple steps (estimated steps ≥ 3)
- Task spans multiple directories
- Task spans multiple sub-projects
- Task requires multiple rounds of validation
- Estimated to be unable to complete in a single round

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
**Currently Executing**: Execution Plan
**Stage**: stage3
**Status**: in_progress
**Next Step**: Establish execution plan
```

---

### Step 2: Load the Long-Task Skill

**⚠️ Important: To establish a checkpoint resume mechanism for long tasks, the corresponding skill needs to be loaded**

Execute the following actions:

1. Load skill `fw-task-plan-checkpoint` to establish a checkpoint resume mechanism
2. Establish step-by-step execution capability for the long task according to skill guidance

---

### Step 3: Create Task Run Directory and Task File

**Execute the following steps**:

1. Create task run directory: `temp/task-runs/<task-id>/`
2. Assign stable IDs, status, version, and rerun templates to steps
3. Sync back to the task file after each step is advanced

---

### Step 4: Output Auto-Transition Prompt and Auto-Transition to the Next Stage

**After the execution plan is established, output the auto-transition prompt**:

```
[Execution Plan] Task ID: {current task ID}
Execution plan established.

Plan details:
- Total steps: {number of steps}
- Checkpoint resume: enabled

Proceeding to the next stage: [Material Supply].
```

---

### Step 5: Update the State File to the Next Stage

**Before entering stage4, update the state file**:

```
**Currently Executing**: Material Supply
**Stage**: stage4
**Status**: in_progress
**Next Step**: Execute supply.md
```

---

## Rollback Conditions

- If the task was initially misjudged as a short task but significantly grows during execution, immediately supplement this stage
