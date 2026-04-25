---
alwaysApply: true
description: "frontend-workmate skill rules (static rules part)"
---

# ⚠️ Core Mandatory Rules (Must Follow)

## 1. Single Phase Output Principle

**Each output only contains current phase content**, prohibited:
- Outputting future phase plans
- Creating own task lists (must use state file's task list)
- Imagining user feedback or future results

**Correct Example**: `[Initialization] Task ID: task_xxx... [Initialization] Completed. Entering next phase: [Project Scan].`

## 2. Task ID Carrying Principle

**Each AI output must carry Task ID at the beginning**:
- First line of every output: `[Phase Name] Task ID: task_xxxxxxxx`
- State update carries Task ID
- Prohibited from executing operations outside task context

**Why every output carries Task ID**:
- Prevents context overflow causing task context loss
- New session can determine whether to continue existing task by extracting Task ID from user-referenced content
- User can explicitly reference Task ID to continue specific task

**New Session Task Association Logic**:
1. New session starts → Read state file, check if active tasks exist
2. Extract Task ID from user input/referenced AI output:
   - User input explicitly contains `Task ID: task_xxxxxxxx` → Continue that task
   - User input references AI output that contains Task ID → Continue that task
   - User input does not contain Task ID reference → **Default: Create new task**

## 3. Phase Confirmation Loop Principle

**Must wait for user confirmation before entering next phase**:
| Phase End | Action |
| --- | --- |
| Has artifact output | Output summary + wait confirmation prompt |
| User confirms "continue" | **First update state file** → enter next phase |
| User proposes modifications | Stay current phase → merge feedback → wait again |

**Prohibited**: Enter next phase without confirmation, continuously output multi-phase content

## 4. State File Update Principle

**Must read and update state file**:
| Timing | Action |
| --- | --- |
| Before entering phase | `read` state file, get current phase and Task ID |
| After phase completes | `edit` state file, update phase progress |
| After user proposes modifications | `edit` state file, update status |

**Prohibited**: Infer phase without reading state file, enter next phase without updating state file

## 5. Dynamic Path Reading Principle (Three Core Directories)

**Config file only stores three core directories**, other paths via concatenation:

| Directory Concept | Config Field | Description |
| --- | --- | --- |
| User project root directory | `project_work_dir` | User-opened directory, development change reference |
| Project IDE config root directory | `project_ide_dir` | Stores project config, skills, rules, state |
| Static config root directory | `static_config_dir` | IDE config root directory (like ~/.qoder), stores static skills, static rules |

**Path Concatenation Rules**:

| Reference Type | Concatenation Method |
| --- | --- |
| Static skill (fw-react-best-practices etc.) | `{static_config_dir}/skills/{skill_name}/SKILL.md` |
| Static rule (frontend-implementation.md etc.) | `{static_config_dir}/rules/{rule_name}.md` |
| Project skill (fw-project-develop) | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` |
| Project rule (fw-skill-rule.md) | `{project_ide_dir}/rules/fw-skill-rule.md` |
| Project state (fw-session-state.md) | `{project_ide_dir}/rules/fw-session-state.md` |
| Modified code | `{project_work_dir}/src/...` |

**Reference Steps**:
1. `read` `{project_ide_dir}/.fw-session-config.json`
2. Get `project_work_dir`, `project_ide_dir`, `static_config_dir`
3. Concatenate path based on reference type

**Prohibited**: Hardcoded paths (like `skills/curated/xxx/SKILL.md`)

## 6. Fallback Reset Principle

**Must reset subsequent phases when fallback**:
| Fallback Scenario | Reset Phases |
| --- | --- |
| stage8 → stage5 | stage5-8 → pending re-execution |
| stage8 → stage2 | stage2-8 → pending re-execution |
| stage5 → stage2 | stage2-5 → pending re-execution |

**Prohibited**: Not resetting subsequent phases when fallback

---

# Config File Structure

Config file `.fw-session-config.json` stored in `{project_ide_dir}`, **only stores three core directories**:

```json
{
  "project_work_dir": "/home/user/my-project",
  "project_ide_dir": "/home/user/my-project/.opencode",
  "static_config_dir": "~/.opencode",
  "created_at": "2026-04-21T..."
}
```

**Other paths via concatenation**:
- Static skill directory = `{static_config_dir}/skills/`
- Static rule directory = `{static_config_dir}/rules/`
- Project skill directory = `{project_ide_dir}/skills/`
- Project rule directory = `{project_ide_dir}/rules/`

---

# Phase Responsibility Boundary

| Phase | Responsible | Not Responsible (Record to Context) |
| --- | --- | --- |
| stage0 | Initialization, Task ID generation | Project analysis, scope analysis |
| stage1 | Project scan, skill generation | Development requirements, feature descriptions |
| stage2 | Scope analysis, task type judgment | Specific implementation plans |
| stage3 | Execution plan, task breakdown | Development implementation |
| stage4 | Material supply | Development implementation |
| stage5 | Code modification, skill invocation | Verification, documentation update |
| stage6 | Verification execution | Code modification (return to stage5) |
| stage7 | Documentation sync | Verification, code modification |
| stage8 | Delivery confirmation | Development implementation (return to stage5) |

**Processing Principle**: User can provide any content, AI only processes what's needed for current phase, others record to context.

---

# Loop Path Summary

| Phase | Next Phase | User Modification | Auto Link |
| --- | --- | --- | --- |
| stage0 | stage1 | None | ✅ |
| stage1 | stage2 | Stay stage1 loop | ❌ Wait confirmation |
| stage2 | stage3/4 | Stay stage2 loop | ❌ Wait confirmation |
| stage3 | stage4 | Return stage2 | ✅ |
| stage4 | stage5 | Can skip | ✅ |
| stage5 | stage6 | stage8 unified handling | ✅ |
| stage6 | stage7 | No pause | ✅ |
| stage7 | stage8 | No pause | ✅ |
| stage8 | Complete | Return stage5 reset | ❌ Wait confirmation |

---

# Execution Order (Most Important)

**After receiving user input**:
1. **Read config file** `{project_ide_dir}/.fw-session-config.json`
2. **Read state file** `{project_ide_dir}/rules/fw-session-state.md` → Get active tasks list
3. **Extract Task ID from user input** (New Session Task Association):
   | Pattern | Action |
   | --- | --- |
   | User input contains `Task ID: task_xxxxxxxx` | Extract → Continue that task |
   | User input references AI output with Task ID | Extract from reference → Continue that task |
   | No Task ID reference | **Create new task** → Generate new Task ID → Start Stage 0 |
4. **Process input based on phase**:
   | Phase | Status | Input Type | Handling |
   | --- | --- | --- | --- |
   | stage8 | waiting | Modification content | **First update status to stage5 + reset phases** |
   | stage8 | waiting | "continue" | Mark complete |
   | stage1-7 | waiting | Any content | Execute current phase reply handling |
   | completed | - | New requirement | Generate new Task ID → stage0 |

5. **Execute phase action** → Prohibited from skipping status update

---

# State File Description

State file `fw-session-state.md` contains:
- Active task list
- Each task's current status (phase, status, next step)
- Phase progress (completed/in-progress/to-do/to-re-execute)

See state file template `fw-session-state.template.md`.