---
alwaysApply: true
description: "frontend-workmate session state (dynamic part)"
---

# Session State

<!-- CONFIG_FILE_PATH: Read {project_ide_dir}/.fw-session-config.json to get three core directories -->

<!-- TASK_LIST_START -->
## Active Tasks

| Task ID | Status | Phase | Description |
| --- | --- | --- | --- |
| (Generated at initialization) |

---

<!-- TASK_XXX_START -->
## Task Details: task_xxxxxxxx

### Basic Info
| **Task ID** | task_xxxxxxxx |
| **Task Description** | (User's original request) |
| **Created Time** | (Recorded at initialization) |

### Current Status
| **Currently Executing** | Initialization |
| **Phase** | stage0 |
| **Status** | in_progress |
| **Next Step** | Execute stages/init.md |
| **Reset Phases** | None |

### Phase Progress
#### Completed
(Appended after phase completion)

#### In Progress
- [ ] Stage 0 — Initialization

#### To Do
- [ ] Stage 1 — Project Scan
- [ ] Stage 2 — Scope Analysis
- [ ] Stage 3 — Execution Plan (long task)
- [ ] Stage 4 — Material Supply
- [ ] Stage 5 — Implementation
- [ ] Stage 6 — Verification
- [ ] Stage 7 — Documentation Sync
- [ ] Stage 8 — Delivery

#### To Re-execute
(Appended on fallback)

<!-- TASK_XXX_END -->

---

## Completed Tasks

| Task ID | Completion Time | Description |
| --- | --- | --- |
| (Appended after task completion) |

<!-- TASK_LIST_END -->

---

# State Update Guide

## Update When Entering Phase

Find corresponding task's status block (`<!-- TASK_{TASK_ID}_START -->`), update:
- `**Currently Executing**: {Phase Name}`
- `**Phase**: stage{N}`
- `**Status**: in_progress`
- `**Next Step**: {Next Action}`
- Phase progress: Move current phase to "In Progress"

## Update After Phase Completion

- `**Status**: completed` (or `waiting_user`)
- Phase progress: Move current phase to "Completed", next phase to "In Progress"

## Update on Fallback

- `**Phase**: stage{Target Phase}`
- `**Status**: in_progress`
- `**Reset Phases**: [stageX, stageY, ...] → To Re-execute`
- Phase progress: Move subsequent phases to "To Re-execute"

## Task Lookup Rules

When updating status:
1. Get `current_task_id` from context
2. Find `<!-- TASK_{TASK_ID_UPPERCASE}_START -->`
3. If found → Update that status block
4. If not found → Create new task status block

## Task ID Carriage Mechanism

**User only inputs requirements, Task ID auto-carried via AI output**

### Task ID Carriage Methods

| Carriage Source | Description |
| --- | --- |
| Context reference | User referenced previous AI output (first line contains `Task ID: task_xxxxxxxx`) |
| IDE auto-carriage | IDE session management auto-carries previous output's Task ID |
| No carriage | First input in new session, no Task ID context |

### Judgment Logic (Step 1)

**After receiving user input, first check Task ID carriage status**:
| Carriage Status | Next Action |
| --- | --- |
| Task ID carried | → Read state file → Find corresponding task → Continue |
| **No Task ID carriage** | → **Create new task** (first input in new session) |

**Important**:
- User will not manually input Task ID, only inputs requirement content
- Task ID carried via AI output first line, subsequent dialogue auto-transmits via reference/context
- "No Task ID carriage" detected = first input in new session = create new task

### Step 2 Branches

**Branch A (Task ID carried)**:
- Read state file → Find `<!-- TASK_{TASK_ID_UPPERCASE}_START -->`
- Continue that task

**Branch B (No Task ID carriage)**:
- Generate new Task ID `task_{new_random_id}`
- Read state file → Add new task block
- Start from Stage 0
- **First line output carries Task ID** `[Phase Name] Task ID: task_xxx`

### Example Flow

**First input in new session**:
```
User: "add user management module" (no Task ID carriage)
AI: Step 1 check → No carriage → Create new task task_abc123 → Stage 0
AI output first line: "[Initialization] Task ID: task_abc123"
```

**Continue existing session**:
```
User: "continue, need to modify this" (Task ID carried from previous round)
AI: Step 1 check → Carriage task_abc123 → Continue task_abc123
```

### Design Points

- **AI output first line carries Task ID**: Ensures task context is trackable
- **IDE/reference auto-transmit**: Task ID auto-carried in dialogue, user no need to manually input
- **No carriage = new task**: Simplest judgment logic