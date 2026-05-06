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

**User can provide any content; this phase only records**:

```
Examples of what user may provide:
- "Fix the login page validation issue"
- "Add user management module with permission control"
- "Optimize homepage load speed, target within 2 seconds"
- "Create project: React + TypeScript"

Handling method:
- Record all to task context
- Do not analyze or implement in this phase
- Leave for subsequent phases to handle
```

## Execution Flow

**After entering this phase, execute in the following order**:

---

### Step 1: Generate Task ID

- Immediately generate a specific Task ID: `task_` + 8 random characters
- Output to user: `[Initialization] Task ID: task_xxxxxxxx`
- Store in context variable `current_task_id`
- Do not just describe rules, must actually generate and output

---

### Step 2: Execute init-skills.js

- Check if `../scripts/init-skills.js` exists (relative to this skill pack root directory)
- If exists, immediately execute the script
- **Script will auto-detect project root directory**:
  - Executes from skill pack location (e.g., `e:\xxx\.ide\skills\frontend-workmate`)
  - Auto-detects `project_work_dir` = parent directory of `staticConfigDir` (e.g., `e:\xxx`)
  - **project_work_dir is the user work directory, not the frontend project directory**
  - Frontend project may be in a subdirectory (e.g., `e:\xxx\frontend`), but config is based on work directory
  - No need to manually specify `--workdir` parameter
- Execution example:
  ```bash
  node ../scripts/init-skills.js
  ```
- **Prohibited from passing frontend project directory as --workdir**:
  ```bash
  # Wrong example
  node ../scripts/init-skills.js --workdir "e:\xxx\frontend"
  
  # Correct: no parameters, auto-detect
  node ../scripts/init-skills.js
  ```
- Script will execute the following improved logic:
  - **Skill sync**: Check version changes, update if changed (not just skip)
  - **Config file**: Validate three core directories are correct, update if incorrect
  - **Rules file**: Check if template has changes, update if changed
  - **State file**: Preserve existing content (contains task data, do not overwrite)
- Script will generate or update config file `.fw-session-config.json` (stored in `{project_ide_dir}`)

**Note**: Even if skills already exist, the script will check version changes and update, ensuring users always use the latest version.

---

### Step 3: Update State File

**After script execution completes**:

1. **Read config file**: Use read tool to read `{project_ide_dir}/.fw-session-config.json`
2. **Get three core directories**: Read `static_config_dir`, `project_ide_dir`, `project_work_dir` from config
3. **Read state file**: Use read tool to read `{project_ide_dir}/rules/fw-session-state.md`
4. **Edit rules file**: Use edit tool to add new task status block to task list:

```
<!-- TASK_XXXXXXXX_START -->
**Task ID**: task_xxxxxxxx (Task ID generated in Step 1)
**Task Description**: (brief description of user's original request)
**Created At**: (current timestamp)
**Executing**: Initialization
**Stage**: stage0
**Status**: in_progress
**Next Step**: Execute init-skills.js script
**User Modifications**: none
**Loop Path**: none
<!-- TASK_XXXXXXXX_END -->
```

5. **Also update active tasks table**: Add new Task ID to active tasks table

---

### Step 4: Record User Request

- Receive user's original request, screenshots, attachments, path clues
- Establish "original requirement anchor", record the problem user wants to solve, target page/module, expected result

---

### Step 5: Output Completion Prompt and Auto-Proceed to Next Phase

```
[Initialization] Completed. Task ID: task_xxxxxxxx
Proceeding to next phase: [Project Scan].
```

**After completion, automatically proceed to stage1** (no user confirmation wait).

---

### Prohibited Actions

- Prohibited from proceeding to next phase without generating a specific Task ID
- Prohibited from guessing config file paths without executing init-skills.js
- Prohibited from proceeding to next phase without executing edit operations
- Prohibited from only saying "will execute" without actually making tool calls

## Output

- **Task ID**: Output to user for future reference
- User-side output example:
  ```
  [Initialization] Task ID: task_a1b2c3d4
  [Initialization] Completed. Proceeding to next phase: [Project Scan].
  ```

## Fallback Conditions

- If task goal is found to be misunderstood later, fall back to this phase and rewrite.
- If a round of replies in the initialization phase proactively asked for implementation details, it should be treated as out-of-bounds and this phase should be fallen back to.
