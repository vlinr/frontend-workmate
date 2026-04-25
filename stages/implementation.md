# Stage 5: Implementation

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain implementation content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "After verification passes, xxx" | Prohibited from promising verification results |
| "Documentation update plan" | Prohibited from outputting documentation phase content |
| "Proceeding to verification next" | Prohibited from outputting subsequent phase plans |

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output: `[Implementation] Task ID: task_xxxxxxxx`
- State file update must carry Task ID

### 3. After Completion, Automatically Proceed to Next Phase

**After code modification completes**:
- Don't output confirmation prompt
- Don't wait for user confirmation
- Automatically proceed to stage6 (Verification)

---

## Goal

- Execute actual code modifications based on task type and project rules.

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Record to Context) |
| --- | --- | --- |
| Code modification, file editing | Verification execution (stage6) |
| Skill invocation, implementation plan execution | Documentation update (stage7) |
| Bug fix, feature implementation | User confirmation (stage8) |

**User can provide any content, this phase only processes content belonging to development implementation**:

```
Example content user may provide:
- "Login page form validation logic change to: email regex + password 6+ characters"
- "User management page add delete button, call DELETE /api/user/:id"
- "Homepage performance optimization: lazy load images, reduce request count"

Handling method:
- Info belonging to development implementation → This phase processes (modify code)
- Don't reject user content, directly execute modifications
```

**Note**:
- This phase is development execution phase, user-provided implementation details should be immediately executed
- Don't pause waiting for user confirmation, after completion automatically enter stage6
- User proposes modifications in stage8, will return to this phase to re-execute

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit When Entering This Phase

**Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
- Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use edit tool to replace that status block content with:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Implementation
**Phase**: stage5
**Status**: in_progress
**Next Step**: Execute code modification, after completion automatically proceed to stage6
**User Proposed Modifications**: Handle uniformly in stage8 (loop)
**Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
```

### Edit Again After Phase Completion

**After completion directly proceed to stage6** (no pause waiting for user confirmation):

Use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Verification
**Phase**: stage6
**Status**: in_progress
**Next Step**: Execute functional verification, lint/type/build/test, after completion automatically proceed to stage7
**User Proposed Modifications**: Handle uniformly in stage8
**Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
```

### Prohibited Actions

- Prohibited from guessing paths without reading config file
- **Prohibited from pausing in stage5 waiting for user confirmation** (automatically execute to stage8)

## Skill Invocation Rules (Mandatory Execution)

**When this phase starts, must execute skill invocation in the following order**:

### Step 1: Must Scan and Invoke Skills (Execute First)

**After entering this phase, must first execute the following skill scan and invocation flow**:

1. **Scan Skill List**: Check if available skills exist in Skill Directory
2. **Prioritize Invoking Project Skill**: If `fw-project-develop` exists, **must first read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{project_ide_dir}/skills/fw-project-develop/SKILL.md`
3. **Based on Conditions Invoke Other Skills**: When trigger conditions met, **must first read config file**, dynamically concatenate corresponding skill path

### Mandatory Invocation List

| Trigger Condition | Must Invoke Skill Path | Invocation Timing | Description |
| --- | --- | --- | --- |
| Project skill exists | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` | **Must invoke first** | Get project structure, tech stack, routing, permission, build rules etc. constraints |
| Task type is `bug` | `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md` | **Must invoke before fix** | First find root cause, then execute fix |
| Tech stack is React (marked in project skill) | `{static_config_dir}/skills/fw-react-best-practices/SKILL.md` | **Must invoke when implementing** | React project implementation must follow best practices |
| Tech stack is React and involves component development or modification | `{static_config_dir}/skills/fw-react-components/SKILL.md` | **Must invoke when developing components** | Create/modify components must follow standards |
| Involves complex type issues | `{static_config_dir}/skills/fw-typescript-advanced-types/SKILL.md` | Invoke when implementing types | Complex type scenarios |

### Invocation Execution Method

**Read skill SKILL.md file (Execute by condition)**:

- Project skill: **First read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{project_ide_dir}/skills/fw-project-develop/SKILL.md`
- Debugging skill (bug task): **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md`
- React best practices: **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-best-practices/SKILL.md`
- Component standards: **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-components/SKILL.md`

### Prohibited Actions

- Prohibited from skipping project skill invocation (if exists)
- Prohibited from skipping debugging skill invocation in bug tasks
- Prohibited from skipping React skill invocation in React tech stack
- Prohibited from invoking React skills in non-React tech stack

## Branching Rules

**Based on task type, must execute the following skill invocation order**:

- `bug` task:
    - **Must first read config file**, dynamically concatenate `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md` find root cause
    - After root cause confirmed, execute fix
    - If involves complex type issues, **must first read config file**, dynamically concatenate `{static_config_dir}/skills/fw-typescript-advanced-types/SKILL.md`

- `feature` task:
    - **Must first read config file**, dynamically concatenate `{project_ide_dir}/skills/fw-project-develop/SKILL.md` get project constraints
    - If tech stack is React, **must first read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-best-practices/SKILL.md`
    - If involves component development, **must first read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-components/SKILL.md`

- `refactor` task:
    - **Must first read config file**, dynamically concatenate `{project_ide_dir}/skills/fw-project-develop/SKILL.md` get project constraints
    - Default first maintain behavior unchanged
    - First break down impact scope, then batch implement

- `optimize` task:
    - **Must first read config file**, dynamically concatenate `{project_ide_dir}/skills/fw-project-develop/SKILL.md` get project constraints
    - After analyzing performance bottlenecks, optimize

## General Actions

**Execute strictly in the following order**:

1. **Before starting formal implementation, must first invoke skills**:
    - **Must first read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{project_ide_dir}/skills/fw-project-develop/SKILL.md` get project constraints
    - Constraints obtained after invocation as implementation reference, avoid violating existing project rules
2. **Execute skill invocation based on this phase "Skill Invocation Rules"**:
    - When trigger conditions met, **must invoke** corresponding skill
    - Don't forcibly invoke when conditions not met
3. For capabilities marked `not_applicable` in project skill, don't fabricate implementation.
4. If discover new blockers, environment issues, dependency issues or skill route gaps on-site, write back updates, cannot pretend development complete.
5. If long task mechanism enabled (Stage 3), during implementation continuously write back step status.
6. **After code modification completes, must immediately link to Stage 6 for internal verification**:
    - **Prohibited**: After Stage 5 completion ask "is function correct" or "should enter verification"
    - **Prohibited**: Output "Please confirm if implementation meets requirements"
    - Directly enter Stage 6, after executing verification wait for user confirmation
7. If environment issues cause cannot execute verification (like lint/type/build/test commands not runnable), output clear environment fix suggestions and stay in Stage 5, cannot enter Stage 6.

## Output

**After code modification completes, must output linking prompt**:

```
[Implementation] Task ID: {Current Task ID}
Code modification complete.

Modification content:
- {Modified file list}
- {Brief modification description}

Proceeding to next phase: [Verification].
```

**Prohibited Actions**:
- Prohibited from outputting "Please confirm if function is correct"
- Prohibited from outputting "Should enter verification"
- Prohibited from waiting for user confirmation (automatically link stage6)

---

## Automatic Linking Flow

**After Stage 5 completion**:
1. Update state file: `**Phase**: stage6`, `**Status**: in_progress`
2. Output linking prompt
3. Automatically proceed to Stage 6 to execute verification

---

## Fallback Conditions

- If internal verification fails, fallback to this phase to continue fixing.
- If runtime, lint, type, build or test cannot pass due to current environment issues, stay in this phase, first explain to user actions needed to fix environment; after environment fix continue Stage 5, instead of entering Stage 6 or Stage 7.