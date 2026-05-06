---
alwaysApply: true
description: "frontend-workmate task state record (multi-task data) - This file stores multiple task details by Task ID; AI must extract the Task ID from context before querying this file"
---

# Task State Record

<!-- CONFIG_FILE_PATH: Read {project_ide_dir}/.fw-session-config.json to obtain the three core directories -->

<!-- TASK_A1B2C3D4_START -->
## Task Details: task_a1b2c3d4

### Basic Information
| **Task ID** | task_a1b2c3d4 |
| **Task Summary** | (one-line description) |
| **Detailed Description** | (full content of user's original request) |
| **Created At** | (recorded at initialization) |
| **Technology Stack** | (project technology stack) |
| **Files Involved** | (list of modified files) |

### Execution Status
| **Current Stage** | stage0 |
| **Stage Status** | in_progress |
| **Next Step Plan** | Execute ../stages/init.md |
| **Reset Stage** | none |

### Stage Progress
#### Completed
(appended after stage completion)

#### In Progress
- [ ] Stage 0 — Initialization

#### Pending
- [ ] Stage 1 — Project Scan
- [ ] Stage 2 — Scope Analysis
- [ ] Stage 3 — Execution Plan (long tasks)
- [ ] Stage 4 — Material Supply
- [ ] Stage 5 — Implementation
- [ ] Stage 6 — Verification
- [ ] Stage 7 — Documentation Sync
- [ ] Stage 8 — Delivery

#### Pending Re-execution
(appended when rolling back)

<!-- TASK_A1B2C3D4_END -->

---

<!-- TASK_E5F6G7H8_START -->
## Task Details: task_e5f6g7h8

### Basic Information
| **Task ID** | task_e5f6g7h8 |
| **Task Summary** | (one-line description) |
| **Detailed Description** | (full content of user's original request) |
| **Created At** | (recorded at initialization) |
| **Technology Stack** | (project technology stack) |
| **Files Involved** | (list of modified files) |

### Execution Status
| **Current Stage** | stage2 |
| **Stage Status** | waiting_user |
| **Next Step Plan** | Wait for user to confirm scope analysis |
| **Reset Stage** | none |

### Stage Progress
#### Completed
- [x] Stage 0 — Initialization
- [x] Stage 1 — Project Scan

#### In Progress
- [ ] Stage 2 — Scope Analysis

#### Pending
- [ ] Stage 3 — Execution Plan
- [ ] Stage 4 — Material Supply
- [ ] Stage 5 — Implementation
- [ ] Stage 6 — Verification
- [ ] Stage 7 — Documentation Sync
- [ ] Stage 8 — Delivery

<!-- TASK_E5F6G7H8_END -->

---

## Completed Tasks

<!-- TASK_I9J0K1L2_START -->
## Task Details: task_i9j0k1l2 (Completed)

### Basic Information
| **Task ID** | task_i9j0k1l2 |
| **Task Summary** | (one-line description) |
| **Detailed Description** | (user's original request) |
| **Created At** | (recorded at initialization) |
| **Completed At** | (recorded at completion) |
<!-- TASK_I9J0K1L2_END -->

---

# Task ID Retrieval Mechanism (Core Rules)

## ⚠️ Execution Principles

**This file stores multiple task details by Task ID and does not decide which task to execute. AI must follow these steps**:

### Step 1: Extract Task ID from Context (Mandatory)

**Check methods**:
| Check Item | Description |
| --- | --- |
| Previous AI output | Check whether the first line of the previous output contains `Task ID: task_xxxxxxxx` |
| IDE session context | IDE automatically carries the Task ID from the previous output |
| User input reference | Whether the user referenced historical output containing a Task ID |

### Step 2: Handle Based on Extraction Result

| Extraction Result | Handling |
| --- | --- |
| **No Task ID** (new session, or no Task ID in context) | → **Create a new task** |
| Task ID found → Corresponding task details block exists in this file | → **Continue existing task** |
| Task ID found → Corresponding task details block does not exist in this file | → **Create a new task** |

### Step 3: Execute

**Create a new task**:
1. Generate a new Task ID `task_{new random ID}`
2. Append a new task details block to this file: `<!-- TASK_{NEW_ID}_START --> ... <!-- TASK_{NEW_ID}_END -->`
3. Start execution from Stage 0
4. **First line of output must carry the Task ID**: `[Stage Name] Task ID: task_xxx`

**Continue an existing task**:
1. Find the corresponding task details block `<!-- TASK_{TASK_ID_UPPERCASE}_START -->`
2. Read the execution status and stage progress
3. Continue execution based on the stage
4. **First line of output must carry the Task ID**: `[Stage Name] Task ID: task_xxx`

## ⚠️ Prohibited Actions

- **Prohibited**: reading this file and directly using a task without first extracting the Task ID from context
- **Prohibited**: assuming the user wants to continue a certain task (must first check the context Task ID)
- **Prohibited**: outputting without carrying the Task ID (every output's first line must have the Task ID)

---

# State Update Guide

## When Adding a New Task

Append a new task details block to this file: copy the template, replace the Task ID with the new ID

## When Entering a Stage

Find the details block for the corresponding task (`<!-- TASK_{TASK_ID_UPPERCASE}_START -->`), update:
- `**Currently Executing**: {stage name}`
- `**Current Stage**: stage{N}`
- `**Stage Status**: in_progress`
- `**Next Step Plan**: {next action}`
- Stage progress: move the current stage to "In Progress"

## After Stage Completion

- `**Stage Status**: completed` (or `waiting_user`)
- Stage progress: move the current stage to "Completed", the next stage to "In Progress"

## When Rolling Back

- `**Current Stage**: stage{target stage}`
- `**Stage Status**: in_progress`
- `**Reset Stage**: [stageX, stageY, ...] → Pending Re-execution`
- Stage progress: move subsequent stages to "Pending Re-execution"

## When Task Is Complete

Move the task details block to the "Completed Tasks" section and add the completion time
