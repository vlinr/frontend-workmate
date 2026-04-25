# Stage 0: Initialization

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain initialization content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "After creating project, xxx" | Prohibited from promising future results |
| "Will execute xxx next" | Prohibited from outputting future plans |
| Task plan list | Prohibited from creating task lists; must use state file's task status |
| Multi-phase content | Prohibited from outputting other phase content in this phase |

**Correct Output**:
```
[Initialization] Task ID: task_xxxxxxxx
Initializing...
[Initialization] Completed. Proceeding to next phase: [Project Scan].
```

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output must contain Task ID: `[Initialization] Task ID: task_xxxxxxxx`
- State file update must carry Task ID
- Prohibited from executing operations outside task context

### 3. After Completion, Automatically Proceed to Next Phase (No User Confirmation Wait)

**After completing this phase**:
- Output phase completion prompt: `[Initialization] Completed. Proceeding to next phase: [Project Scan].`
- Update state file to stage1
- **Automatically proceed to stage1**, no user confirmation wait

**Note**: stage0 → stage1 is automatic transition, no user confirmation needed.

---

## Goal

- Complete environment initialization, file reception, basic state initialization.
- **Generate Task ID**: Create a unique task identifier.
- **Receive and Record User Request**: User may provide development requirements, project info, etc.; this phase only records, does not analyze or implement.

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Record to Context) |
| --- | --- |
| Initialization script execution | Project analysis, project scan |
| Task ID generation | Scope analysis, task type judgment |
| User request recording | Development implementation, code modification |

**User can provide any content, this phase only records**:

```
Example content user may provide:
- "Fix login page validation issue"
- "Add user management module with permission control"
- "Optimize homepage load speed, target under 2 seconds"
- "Create project: React + TypeScript"

Handling method:
- All recorded to task context
- No analysis or implementation in this phase
- Wait for subsequent phases to process
```

## Execution Steps Overview

This phase executes in the following order (see "Execution Actions" section below for details):

1. **Generate Task ID**: Immediately generate and output specific Task ID
2. **Execute init-skills.js**: Execute script to generate config file
3. **Update State File**: Read config file path, edit state file
4. **Record User Request**: Establish original requirement anchor
5. **Output Completion Prompt**: Inform proceeding to next phase

## Input

- User's original request
- Constraints in current context
- Screenshots, design images, error messages or path hints attached by user (if any)

## Execution Actions

**Execute strictly in the following order**:

### 1. Generate Task ID (Must Execute First)

- Immediately generate a specific Task ID: `task_` + 8 random characters
- Output to user: `[Initialization] Task ID: task_xxxxxxxx`
- Store in context variable `current_task_id`
- **Do not just describe the rule, must actually generate and output**

### 2. Execute init-skills.js (Must Execute)

- Check if `scripts/init-skills.js` exists
- If exists, immediately execute the script
- Script will generate config file `.fw-session-config.json` (stored in `{project_ide_dir}`)

### 3. Update State File (Must Execute)

**After script execution completes**:

1. **Read Config File**: Use read tool to read `{project_ide_dir}/.fw-session-config.json`
2. **Get Three Core Directories**: Read `static_config_dir`, `project_ide_dir`, `project_work_dir` from config
3. **Read State File**: Use read tool to read `{project_ide_dir}/rules/fw-session-state.md`
4. **Edit Rules File**: Use edit tool, add new task status block in task list:

```
<!-- TASK_XXXXXXXX_START -->
**Task ID**: task_xxxxxxxx (Task ID generated in step 1)
**Task Description**: (Brief description of user's original request)
**Created Time**: (Current timestamp)
**Currently Executing**: Initialization
**Phase**: stage0
**Status**: in_progress
**Next Step**: Execute init-skills.js script
**User Proposed Modifications**: None
**Loop Path**: None
<!-- TASK_XXXXXXXX_END -->
```

5. **Also Update Active Task Table**: Add new Task ID to active task table

### 4. Record User Request (Must Execute)

- Receive user's original request, screenshots, attachments, path hints
- Establish "Original Requirement Anchor", record the problem user wants to solve, target page/module, expected result

### 5. Output Completion Prompt

```
[Initialization] Completed. Task ID: task_xxxxxxxx
Proceeding to next phase: [Project Scan].
```

### Prohibited Actions

- Prohibited from proceeding to next phase without generating specific Task ID
- Prohibited from guessing config file paths without executing init-skills.js
- Prohibited from proceeding to next phase without executing edit operations
- Prohibited from just saying "will execute" but not actually executing tool calls

## Output

- **Task ID**: Must output to user for subsequent reference
- User-side output example:
  ```
  [Initialization] Task ID: task_a1b2c3d4
  [Initialization] Completed. Proceeding to next phase: [Project Scan].
  ```

## Fallback Conditions

- If subsequent discovery indicates task goal understanding error, fallback to this phase to rewrite.
- If discovery shows some round asked implementation details prematurely in initialization phase, should be treated as boundary violation, fallback to this phase.