# Stage 3: Build Execution Plan

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain execution plan content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "Specific implementation steps" | Prohibited from outputting specific implementation details |
| "Code modification plan" | Prohibited from outputting implementation phase content |

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output: `[Execution Plan] Task ID: task_xxxxxxxx`
- State file update must carry Task ID

### 3. After Completion, Automatically Proceed to Next Phase

**After execution plan is built**:
- Don't output confirmation prompt
- Automatically proceed to stage4 (Material Supply)

---

## Goal

- Enable complex tasks with step-by-step execution and checkpoint resume capability.

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Record to Context) |
| --- | --- | --- |
| Task breakdown, step planning | Specific code modification, implementation details |
| Checkpoint resume mechanism establishment | Verification execution |
| Step ID allocation | Documentation update |

**User can provide any content, this phase only processes content belonging to execution plan**:

```
Example content user may provide:
- "First change login page, then user management, finally permission"
- "Step 1: Fix form validation, Step 2: Add API call"

Handling method:
- Info belonging to execution plan → This phase processes (break down steps)
- Info belonging to implementation details → Record to task context, wait for stage5 to process
- Don't reject user content, only process by phase
```

## Entry Conditions

- Task is multi-step, cross-directory, cross-sub-project, cross-multi-round verification, or estimated single round cannot complete.

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit Instructions

1. **First Read Config File**: Use read tool to read `{project_ide_dir}/.fw-session-config.json`
2. **Get Rules File Path**: Read `rules_file_path` field from config
3. **Read Rules File**: Use read tool to read file at that path
4. **Edit Rules File**: **Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
   - Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
   - Use edit tool to replace that status block content with:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Execution Plan
**Phase**: stage3
**Status**: in_progress
**Next Step**: Build execution plan
```

### Edit Again After Phase Completion

Before proceeding to next phase, use edit tool again to replace status content with:

```
**Currently Executing**: Material Supply
**Phase**: stage4
**Status**: in_progress
**Next Step**: Execute stages/supply.md
```

### Prohibited Actions

- Prohibited from guessing paths without reading config file

1. **First read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-task-plan-checkpoint/SKILL.md` and invoke.
2. Build task run directory and task files.
3. Allocate stable IDs, status, versions and re-run templates for steps.
4. After each advancement, synchronously write back to task files.

## Output

- `execution-plan` or `temp/task-runs/<task-id>/`

## Fallback Conditions

- If initially misjudged as short task, but execution significantly lengthens, immediately supplement this phase.