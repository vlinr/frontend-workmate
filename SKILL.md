---
name: frontend-workmate
description: Frontend development workflow orchestration skill with 9-stage process (init → scan → scope → plan → supply → implement → verify → docs → deliver). Use for ANY frontend task: bug fixes, new features, refactoring, UI changes, style adjustments, component updates, page modifications, API integration, state management, routing, form handling, performance optimization, or accessibility improvements. Automatically triggers when user says "fix", "add", "change", "optimize", "refactor" or similar frontend-related keywords, or explicitly with `/frontend-workmate`.
user-invocable: true
layer: 1
---

# Frontend Development Orchestration Skill

## Execution Entry Point (Primary Action)

**Upon receiving a user request, immediately execute the following actions without skipping**:

1. Output: `Initializing...`
2. Set internal state: `current_stage = stage0`
3. **Read and execute** `stages/init.md` (Initialization phase definition)
4. After initialization completes, output: `[Initialization] Completed. Conclusion: specific conclusion. Proceeding to next phase: [Project Scan].`
5. **Set internal state**: `current_stage = stage1`, **read and execute** `stages/project-scan.md`

**Phase Mapping Table**: See `stages/index.md` (ID ↔ Name)
- Use IDs for internal state (e.g., `stage0`)
- Use names for user output (e.g., `[Initialization]`)

**Prohibited**: Skipping initialization, outputting IDs or numbers to users.

---

## Phase Transition Mechanism (General Rules)

**After each phase completes, execute the following actions**:

1. Output phase completion conclusion: `[Phase Name] Completed. Conclusion: specific conclusion. Proceeding to next phase: [Next Phase Name].`
2. Set internal state: `current_stage = <next_phase_ID>`, `current_stage_status = in_progress`
3. **Read and execute** `stages/<next_phase_definition_file>.md`
4. Execute according to phase definition, forming minimum checkpoint artifacts

**Explicit Confirmation Points** (require user response before proceeding):
- **After Project Scan** → Output project skill summary, await user confirmation
- **After Scope Analysis** → Output analysis conclusion, await user confirmation
- **After Delivery** → Output delivery results, await user confirmation; user may supplement modifications or specify fallback phase

**Standard Prompt for Explicit Confirmation Points**:

After outputting conclusion at each explicit confirmation point, **must append the following prompt**:

> "If you have other modifications needed, please let me know; if everything looks correct, you can simply reply 'continue' and I'll proceed to the next step."

**Prompt Usage Scenarios**:
- Project Scan confirmation: After outputting project skill summary → append prompt
- Scope Analysis confirmation: After outputting analysis conclusion → append prompt
- Delivery confirmation: After outputting delivery results → append confirmation prompt (including smart fallback options)

**Prohibited Actions**:
- Prohibited from only outputting "please confirm" or "reply continue"
- Prohibited from omitting "If you have other modifications needed, please let me know"
- Prohibited from appending prompt after final step (Delivery completed)

**Automatic Transition Points** (no waiting, directly proceed):
- Initialization → automatically proceed to Project Scan
- Execution Plan → automatically proceed to Material Supply
- Material Supply (user responded `provided | not_provided | skipped | not_applicable`) → automatically proceed to Implementation
- **Implementation → automatically proceed to Verification** (Stage 5 completion directly executes Stage 6)
- **Verification → automatically proceed to Documentation Sync** (Stage 6 completion directly executes Stage 7)
- Documentation Sync → automatically proceed to Delivery

**Prohibited Actions During Waiting**:
- Must not continue analysis, invoke downstream skills, modify files, or execute commands in same response
- Must not assume user consent and skip confirmation points

---

## Directory Concept Mapping (Three Core Directories Design)

This skill pack uses a **Three Core Directories** design. The config file only stores these 3 paths; other paths are constructed by concatenation:

| Concept Name | Config Field | Description |
| --- | --- | --- |
| **Project Working Directory** | `project_work_dir` | User-opened directory, reference for development changes |
| **Project IDE Config Directory** | `project_ide_dir` | Stores project config, project skills, project rules, project state |
| **Static Config Root Directory** | `static_config_dir` | IDE config root directory (e.g., ~/.qoder), stores static skills, static rules |

**Path Concatenation Rules**:

| Reference Type | Concatenation Method |
| --- | --- |
| Static Skill | `{static_config_dir}/skills/{skill_name}/SKILL.md` |
| Static Rule | `{static_config_dir}/rules/{rule_name}.md` |
| Project Skill | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` |
| Project Rule | `{project_ide_dir}/rules/fw-skill-rule.md` |
| Project State | `{project_ide_dir}/rules/fw-session-state.md` |
| Modified Code | `{project_work_dir}/src/...` |

**Key Rules**:
- **Config file stored in Project IDE Config Directory**: `.fw-session-config.json`
- **Static skills stored in Static Config Root Directory/skills/**: Sibling to `frontend-workmate`
- **Project skill stored in Project IDE Config Directory/skills/**: `fw-project-develop/`

**Example (Global Install, IDE config directory ~/.qoder)**:
```
# Static Config Root Directory
~/.qoder/                                        # static_config_dir
├── skills/
│   ├── frontend-workmate/                       # This skill pack
│   │   ├── rules/
│   │   │   ├── frontend-implementation.md
│   │   │   └── frontend-verification.md
│   │   └── templates/
│   ├── fw-react-best-practices/                    # Static skill
│   ├── fw-systematic-debugging/                    # Static skill
│   └── ...
├── rules/
│   └── ...
└── ...

# Project IDE Config Directory (follows project)
/home/user/my-project/.qoder/                    # project_ide_dir
├── .fw-session-config.json                      # Config file (only 3 paths)
├── skills/
│   └── fw-project-develop/                      # Project skill
├── rules/
│   ├── fw-skill-rule.md                         # Project rule
│   └── fw-session-state.md                      # Project state
└── output/

```

**Example (In-Project Install)**:
When skill is installed within project, `static_config_dir` = `<project>/<IDE>/` (e.g., `/home/user/my-project/.qoder/`).
└── output/

# Project Working Directory (user-opened directory)
/home/user/my-project/
├── src/
├── package.json
└── ...
```

**Relationship Example (In-Project Install)**:
When skill is installed within project, Static Config Directory and Project IDE Config Directory may be identical or adjacent.

---

## Process Execution Protocol

### Phase Names and Sequence

| Order | Phase Name | Definition File | Core Responsibility |
| --- | --- | --- | --- |
| 1 | Initialization | `stages/init.md` | Execute initialization script, establish task context |
| 2 | Project Scan | `stages/project-scan.md` | Generate or refresh project skill `fw-project-develop` |
| 3 | Scope Analysis | `stages/scope-analysis.md` | Analyze task type, modification scope, skill routing |
| 4 | Execution Plan | `stages/plan.md` | Long task breakdown and checkpoint resume (optional) |
| 5 | Material Supply | `stages/supply.md` | Supply prerequisite materials by task type |
| 6 | Implementation | `stages/implementation.md` | Execute code modifications |
| 7 | Verification | `stages/verification.md` | Verify modification validity |
| 8 | Documentation Sync | `stages/docs.md` | Update directory-level documentation |
| 9 | Delivery | `stages/delivery.md` | Output delivery results |

### Master Process Table

See `stages/index.md` for complete execution logic table (phase/node, decision conditions, branch directions).

### Phase Transition Overview

```
Initialization → Project Scan → [User Confirmation] → Scope Analysis → [User Confirmation] → Execution Plan (optional) → Material Supply → [User Provides] → Implementation → Verification → Documentation Sync → Delivery → [User Confirmation]
```

**Explicit Confirmation Points**:
- After Project Scan: User must confirm if project skill is correct
- After Scope Analysis: User must confirm if analysis conclusion is correct
- After Delivery: User must confirm delivery results (user may supplement modifications or specify fallback phase)

**Automatic Transition Points**: Implementation, Verification, Documentation Sync automatically proceed to next phase after completion (Stage 5→6→7→8 fully automatic)

### Phase Completion Output Specification

**After each phase completes, must output**:

```
[Phase Name] Completed. Conclusion: specific conclusion content. Proceeding to next phase: [Next Phase Name].
```

**Internal State Maintenance** (use IDs):
- `current_stage`: Internal ID (e.g., `stage0`)
- `current_stage_status`: `pending | in_progress | waiting_user | completed | blocked`
- `next_stage`: Next phase ID (e.g., `stage1`)

**User Output** (use names):
- Output `[Initialization]` not `[stage0]`
- Output `[Project Scan]` not `[stage1]`

**Phase Mapping Table**: See `stages/index.md`

**Prohibited**:
- Outputting Stage numbers or internal IDs
- Silent phase transitions

---

## Core Gate Rules

### 1. Must Start from Initialization

First round must start from Initialization phase; cannot skip initialization to directly enter Project Scan or other phases.

### 2. Phase Artifacts Must Be Formed

Each phase must form minimum checkpoint artifacts; cannot "think internally and jump to next phase".

### 3. User Confirmation Must Wait

At explicit confirmation points, must wait for clear user response:
- User replies `continue / agree / no problem`: Allowed to proceed to next phase
- User replies supplement or correction content: Stay in current phase, merge and re-confirm
- User replies negative: Handle according to fallback rules

### 4. Prohibited from Fabricating Project Capabilities

If project lacks certain capability (e.g., routing, permissions, state management), mark `not_applicable`; must not fabricate implementation.

### 5. Original Requirement Anchor Cannot Be Overwritten

"Original requirement anchor" established in Initialization phase is the task's primary goal; subsequent phases can only supplement constraints, cannot rewrite original requirement.

### 6. Project Skill Only Carries Long-Term Rules

`fw-project-develop` only carries stable project knowledge; must not write current single-task temporary requests or implementation preferences.

### 7. Skill Invocation Recommendation Rules

**Each phase recommends invoking skills based on actual conditions when conditions are met**:

| Phase | Trigger Condition | Recommended Skill | Description |
| --- | --- | --- | --- |
| **Stage 2 (Scope Analysis)** | Project skill exists | `fw-project-develop` | Recommend invoking project skill to get project structure, tech stack, routing, permissions constraints |
| **Stage 5 (Implementation)** | Project skill exists | `fw-project-develop` | Recommend first invoking project skill to understand project constraints before implementation |
| **Stage 5 (Implementation)** | Task type is `bug` | `fw-systematic-debugging` | Bug tasks recommend first finding root cause |
| **Stage 5 (Implementation)** | Tech stack is React (marked in project skill) | `fw-react-best-practices` | **Only applicable to React tech stack** |
| **Stage 5 (Implementation)** | Tech stack is React and involves component development | `fw-react-components` | **Only applicable to React tech stack** |
| **Stage 5 (Implementation)** | Involves complex type constraints | `fw-typescript-advanced-types` | TypeScript complex type scenarios |
| **Stage 6 (Verification)** | Project skill exists | `fw-project-develop` | Recommend invoking project skill to get verification constraints (routing, permissions, build rules, etc.) |
| **Stage 6 (Verification)** | Changes involve pages/components/forms/keyboard interactions/focus flow | `fw-accessibility` | WCAG 2.2 accessibility check |
| **Stage 6 (Verification)** | Changes involve layout/styles/spacing/UI consistency | `fw-web-design-guidelines` | Web interface guidelines check |

**Project Skill Description**:
- `fw-project-develop` is the project skill, containing project structure, tech stack, routing, permissions, state management, build rules, etc.
- Recommended invocation: Stage 2 (Scope Analysis), Stage 5 (Implementation), Stage 6 (Verification) beginning
- Invocation purpose: Let AI understand project constraints, avoid violating existing project rules

**Tech Stack Description**:
- `fw-react-best-practices`, `fw-react-components` **only applicable to React tech stack** (marked in project skill)
- Other tech stacks (Vue, Angular, Svelte, etc.) currently have no corresponding skills; can be extended later
- Tech stack determination basis: Tech stack field obtained after invoking `fw-project-develop`

**Prohibited Actions**:
- Prohibited from forcibly invoking when trigger conditions not met (avoid over-invocation)
- Prohibited from invoking React skills under non-React tech stack

---

## Skills and Rules Invocation

### Process Rules Entry

See `rules/frontend-orchestrator.md` for complete core chain, query gates, phase transition rules, fallback logic.

### Phase-Specific Rules

| Phase | Rule File |
| --- | --- |
| Project Scan | `rules/project-scan-profile.md` |
| Scope Analysis | `rules/frontend-change-scope.md` |
| Implementation | `rules/frontend-implementation.md` |
| Verification | `rules/frontend-verification.md` |
| Documentation Sync | `rules/directory-doc-sync.md` |

### Reusable Skills

| Skill | Purpose | Invocation Timing |
| --- | --- | --- |
| `fw-systematic-debugging` | Systematic debugging | Bug fixes |
| `fw-react-best-practices` | React best practices | React-related implementation |
| `fw-react-components` | React component standards | Component development |
| `fw-typescript-advanced-types` | TypeScript advanced types | Complex type problems |
| `fw-task-plan-checkpoint` | Long task checkpoint resume | Multi-step tasks |
| `fw-code-analysis-doc` | Code analysis documentation | Directory relationship extraction |
| `fw-accessibility` | Accessibility check | UI verification |
| `fw-web-design-guidelines` | UI guidelines check | UI verification |
| `find-skills` | Skill discovery | When missing key skills |

---

## Fallback Rules

| Scenario | Fallback Target |
| --- | --- |
| Project skill missing or invalid | Project Scan |
| Scope analysis conclusion unstable | Scope Analysis |
| Implementation finds critical skill unavailable | Scope Analysis |
| Verification fails | Implementation |
| Documentation sync finds implementation unstable | Implementation or Verification |
| User supplements new requirements after delivery | Scope Analysis |

---

## Final Delivery Requirements

- Report: What was changed, how verified, remaining risks
- Any claimed "completed" results must be actually verified
- If task interrupted, resume records in `temp/task-runs/<task-id>/`

---

## Related File Index

| Category | Directory/File |
| --- | --- |
| Phase Definitions | `stages/*.md` |
| Process Rules | `rules/*.md` |
| Reusable Skills | `skills/curated/*/SKILL.md` |
| Artifact Templates | `templates/` |
| Project Knowledge | `AGENTS.md` |