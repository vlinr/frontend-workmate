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

## New Session Task Association Rules

**New session starts → First check state file for active tasks**

### Task ID Extraction from User Input

| User Input Pattern | Action |
| --- | --- |
| Contains `Task ID: task_xxxxxxxx` | Continue that task |
| References AI output containing Task ID | Extract Task ID from referenced content, continue that task |
| No Task ID reference | **Create new task** (default behavior) |

### Example Scenarios

**Scenario 1: Continue existing task**
```
User: "继续刚才的任务" (refers to previous AI output: "Task ID: task_abc123")
AI: Extract task_abc123 → Read state file → Find TASK_ABC123 block → Continue from recorded phase
```

**Scenario 2: New task**
```
User: "添加用户管理模块" (no Task ID reference)
AI: No Task ID extracted → Generate new Task ID → Create new task block → Start from Stage 0
```

**Scenario 3: Explicit Task ID**
```
User: "继续 Task ID: task_def456 的任务"
AI: Extract task_def456 → Read state file → Find TASK_DEF456 block → Continue from recorded phase
```

### Why This Design Works

- **Task ID in every AI output**: Ensures task context not lost even if context overflows
- **User can reference Task ID**: Either explicitly or by referencing AI output
- **Default: New task**: Avoids forcing unrelated new requests onto existing active task
- **State file only tracks, not forces**: State file `alwaysApply: true` provides rules, but actual task association determined by user input context