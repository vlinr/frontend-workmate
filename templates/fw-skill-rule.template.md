---
alwaysApply: true
description: "frontend-workmate skill rules (static rules section)"
---

# ⚠️ Core Mandatory Rules (Must Follow)

## 1. Single-Stage Output Principle

**Each output only contains the content of the current stage**, prohibited:
- Outputting future stage plans
- Self-creating task lists (must use the task list in the state file)
- Imagining user feedback or future results

**Correct example**: `[Initialization] Task ID: task_xxx... [Initialization] Execution complete. Proceeding to the next stage: [Project Scan].`

## 2. Task ID Carrying Principle

**⚠️ Every AI output's first line must carry the Task ID**:
- Format: `[Stage Name] Task ID: task_xxxxxxxx`
- State updates must carry the Task ID
- Prohibited: performing operations outside the task context

**Why it must be carried**:
- Task ID is passed through AI output, forming a context chain
- In the next conversation round, IDE/context automatically carries the Task ID from the previous round
- Prevents task loss due to context limits

**Task ID retrieval logic (core)**:

### Step 1: Extract Task ID from Context (Mandatory)

**Check methods**:
| Check Item | Description |
| --- | --- |
| Previous AI output | Check the first line of the previous output `Task ID: task_xxxxxxxx` |
| IDE session context | IDE automatically carries the Task ID from the previous output |
| User input reference | User referenced historical output containing a Task ID |

### Step 2: Handle Based on Extraction Result

| Extraction Result | Handling |
| --- | --- |
| **No Task ID** (new session, or no Task ID in context) | → **Create a new task**, generate a new Task ID |
| Task ID found → State file has the corresponding task | → **Continue existing task** |
| Task ID found → State file does not have the corresponding task | → **Create a new task** (Task ID expired) |

### Step 3: Carry Task ID During Execution

**Create a new task**:
- First line of output: `[Initialization] Task ID: task_{new ID}`
- Add a new task block to the state file

**Continue existing task**:
- First line of output: `[Stage Name] Task ID: task_{existing ID}`
- Read task details from the state file and continue

### Prohibited Actions

- **Prohibited**: reading the state file and directly using a task details block (must first extract Task ID from context)
- **Prohibited**: assuming the user wants to continue a certain task (must first extract from context)
- **Prohibited**: outputting without carrying the Task ID

## 3. Stage Confirmation Loop Principle

**Must wait for user confirmation before entering the next stage**:
| Stage End | Action |
| --- | --- |
| Has output | Output summary + wait for confirmation prompt |
| User confirms "continue" | **First update state file** → Enter the next stage |
| User requests changes | Stay in current stage → Merge feedback → Wait again |

**Auto-transition stages (no need to wait for user confirmation)**:
| Stage | Auto-Transition Rule |
| --- | --- |
| stage5 → stage6 | **Forced auto-transition**, prohibited to wait for user |
| stage6 → stage7 | **Forced auto-transition**, prohibited to wait for user |
| stage7 → stage8 | **Forced auto-transition**, prohibited to wait for user |

**Auto-transition execution**:
- After stage5 completes: immediately output `[Implementation] Execution complete. Proceeding to the next stage: [Verification].` and execute stage6
- After stage6 completes: immediately output `[Verification] Execution complete. Proceeding to the next stage: [Documentation Sync].` and execute stage7
- After stage7 completes: immediately output `[Documentation Sync] Execution complete. Proceeding to the next stage: [Delivery].` and execute stage8
- **Prohibited: waiting for user confirmation in auto-transition stages**

**Prohibited**: entering the next stage without confirmation (explicit confirmation points), waiting for the user in auto-transition stages (auto-transition points), outputting multiple stages' content consecutively

## 4. State File Update Principle

**Must read and update the state file**:
| Time Point | Action |
| --- | --- |
| Before entering a stage | `read` the state file, obtain the current stage and Task ID |
| After stage completion | `edit` the state file, update stage progress |
| After user requests changes | `edit` the state file, update status |

**Prohibited**: inferring the stage without reading the state file, entering the next stage without updating the state file

## 5. Dynamic Path Reading Principle (Three Core Directories)

**Config file only stores three core directories** — other paths are formed by concatenation:

| Directory Concept | Config Field | Description |
| --- | --- | --- |
| User project root directory | `project_work_dir` | The directory opened by the user, reference basis for development changes |
| Project IDE config root directory | `project_ide_dir` | Stores project config, skills, rules, state |
| Static resource root directory | `static_config_dir` | IDE config root directory (e.g., ~/.qoder), stores static skills and static rules |

**Path concatenation rules**:

| Reference Type | Concatenation Method |
| --- | --- |
| Static skills (fw-react-best-practices, etc.) | `{static_config_dir}/skills/{skill name}/SKILL.md` |
| Static rules (frontend-implementation.md, etc.) | `{static_config_dir}/rules/{rule name}.md` |
| Project skill (fw-project-develop) | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` |
| Project rules (fw-skill-rule.md) | `{project_ide_dir}/rules/fw-skill-rule.md` |
| Project state (fw-session-state.md) | `{project_ide_dir}/rules/fw-session-state.md` |
| Changed code | `{project_work_dir}/src/...` |

**Reference steps**:
1. `read` `{project_ide_dir}/.fw-session-config.json`
2. Obtain `project_work_dir`, `project_ide_dir`, `static_config_dir`
3. Concatenate paths based on reference type

**Prohibited**: hardcoding paths (e.g., `skills/curated/xxx/SKILL.md`)

## 6. Rollback Reset Principle

**When rolling back, must reset subsequent stages**:
| Rollback Scenario | Reset Stages |
| --- | --- |
| stage8 → stage5 | stage5-8 → Pending Re-execution |
| stage8 → stage2 | stage2-8 → Pending Re-execution |
| stage5 → stage2 | stage2-5 → Pending Re-execution |

**Prohibited**: rolling back without resetting subsequent stages

---

# Config File Structure

Config file `.fw-session-config.json` is stored in `{project_ide_dir}`, **stores only three core directories**:

```json
{
  "project_work_dir": "/home/user/my-project",
  "project_ide_dir": "/home/user/my-project/.opencode",
  "static_config_dir": "~/.opencode",
  "created_at": "2026-04-21T..."
}
```

**Other paths formed by concatenation**:
- Static skills directory = `{static_config_dir}/skills/`
- Static rules directory = `{static_config_dir}/rules/`
- Project skills directory = `{project_ide_dir}/skills/`
- Project rules directory = `{project_ide_dir}/rules/`

---

# Stage Responsibility Boundaries

| Stage | Responsible For | Not Responsible For (record to context) |
| --- | --- | --- |
| stage0 | Initialization, Task ID generation | Project analysis, scope analysis |
| stage1 | Project scan, skill generation | Development requirements, feature descriptions |
| stage2 | Scope analysis, task type determination | Specific implementation plans |
| stage3 | Execution plan, task breakdown | Development implementation |
| stage4 | Material supply | Development implementation |
| stage5 | Code changes, skill invocations | Validation, documentation updates |
| stage6 | Validation execution | Code changes (return to stage5) |
| stage7 | Documentation sync | Validation, code changes |
| stage8 | Delivery confirmation | Development implementation (return to stage5) |

**Processing principle**: users may provide any content; AI only processes what is needed for the current stage and records the rest to context.

---

# Loop Path Summary

| Stage | Next Stage | When User Requests Changes | Auto-Transition |
| --- | --- | --- | --- |
| stage0 | stage1 | none | ✅ |
| stage1 | stage2 | stay stage1 loop | ❌ Wait for confirmation |
| stage2 | stage3/4 | stay stage2 loop | ❌ Wait for confirmation |
| stage3 | stage4 | return to stage2 | ✅ |
| stage4 | stage5 | can skip | ✅ |
| stage5 | stage6 | handled uniformly by stage8 | ✅ |
| stage6 | stage7 | do not pause | ✅ |
| stage7 | stage8 | do not pause | ✅ |
| stage8 | complete | return to stage5 reset | ❌ Wait for confirmation |

---

# Execution Order (Most Important)

**After receiving user input**:

### Step 1: Check Task ID Carrying Status (Highest Priority)

**Task ID carrying methods**:
| Carrying Source | Description |
| --- | --- |
| Context reference | User referenced previous AI output (containing `Task ID: task_xxxxxxxx`) |
| IDE auto-carry | IDE session management automatically carries the Task ID from the previous round |
| No carrying | First input in a new session, no Task ID context |

**Decision logic**:
| Carrying Status | Next Action |
| --- | --- |
| Task ID carried | → Step 2A: Read state file → Find corresponding task → Continue |
| **No Task ID carried** | → **Step 2B: Create a new task** (first input in new session) |

**Important**:
- Users only input requirements — they won't manually input a Task ID
- Task ID is carried through AI output first lines, automatically passed through subsequent conversations via reference/context
- If "no Task ID carried" is detected, it indicates the first input in a new session — create a new task directly

### Step 2A: Continue Existing Task (Task ID Carried)

1. **Read config file** `{project_ide_dir}/.fw-session-config.json`
2. **Read state file** `{project_ide_dir}/rules/fw-session-state.md`
3. Find `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` → Continue that task
4. **Handle input based on stage**:
   | Stage | Status | Input Type | Handling |
   | --- | --- | --- | --- |
   | stage8 | waiting | Change content | **First update status to stage5 + reset stages** |
   | stage8 | waiting | "continue" | Mark complete |
   | stage1-7 | waiting | Any content | Execute current stage reply handling |

### Step 2B: Create New Task (No Task ID Carried)

1. **Generate a new Task ID** `task_{new random ID}`
2. **Read state file** `{project_ide_dir}/rules/fw-session-state.md`
3. **Add a new task block** (do not modify existing active tasks)
4. **Start execution from Stage 0**
5. **First line of output carries the Task ID** `[Stage Name] Task ID: task_{new random ID}`

### Prohibited Actions

- **Prohibited**: reading active tasks from the state file before checking the Task ID carrying status
- **Prohibited**: assuming the user wants to continue an existing task (must first check whether the Task ID is carried)
- **Prohibited**: associating unrelated new requests with active tasks in the state file

---

# State File Description

State file `fw-session-state.md` contains:
- Active task list
- Current status of each task (stage, status, next step)
- Stage progress (completed/in progress/pending/pending re-execution)

See the state file template `fw-session-state.template.md` for details.
