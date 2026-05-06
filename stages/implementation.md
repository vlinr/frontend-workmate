# Stage 5: Implementation

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain implementation content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "After verification passes, xxx will happen" | Prohibited: promising verification results |
| "Documentation update plan" | Prohibited: documentation-stage content |

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output: `[Implementation] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID

### 3. Auto-Transition to the Next Stage After Completion

**After code changes are complete**:
- Do not output a confirmation prompt
- Do not wait for user confirmation
- Auto-transition to stage6 (Verification)

---

## Objective

- Execute actual code changes based on task type and project rules

---

## Execution Flow

**After entering this stage, execute in the following order**:

---

### Step 1: Update the State File

**First, update the state file**:

Find the state block corresponding to the current Task ID:
- Search for content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use the edit tool to replace the state block content with:

```
**Task ID**: {current task ID}
**Currently Executing**: Implementation
**Stage**: stage5
**Status**: in_progress
**Next Step**: Execute code changes, auto-transition to stage6 after completion
```

---

### Step 2: Load Relevant Skills

**At the start of this stage, relevant skills need to be loaded first to obtain project constraints**:

---

#### 2.1 Load the Project Skill First

**⚠️ Important: Each of the following steps must be executed in order; skill invocations must use the skill tool**

Execute the following actions:

1. Load skill `fw-project-develop` to understand the project structure and technology stack
2. Obtain the project's build rules and constraints from the skill

---

#### 2.2 Load Corresponding Skills Based on Task Type ⚠️ Skill Loading Checkpoint

**⚠️ Important: Based on task type, the corresponding skills must be loaded for guidance**

| Task Type | Skill to Load | When to Load | Content to Obtain |
| --- | --- | --- | --- |
| `bug` | `fw-systematic-debugging` | Before fixing | Bug debugging methodology, root cause tracing techniques |
| `feature` (React stack) | `fw-react-best-practices` | During implementation | React best practices, performance optimization recommendations |
| `feature` (React component dev) | `fw-react-components` | During component development | Component structure standards, naming conventions |
| Complex type issues | `fw-typescript-advanced-types` | During type implementation | TypeScript advanced type techniques |

**⚠️ Prohibited**:
- ❌ Prohibited: reading skill files instead of loading the skill
- ❌ Prohibited: skipping skill loading and starting code changes directly

---

### Step 3: Execute Code Changes (Branched by Task Type)

**⚠️ Important: Based on task type, execute the corresponding flow**

---

#### 3.1 Bug Task Implementation Flow

**Execute the following actions (in order)**:

1. **Load the debugging skill**
   - Load skill `fw-systematic-debugging` to debug the bug and find the root cause
   - Perform systematic debugging based on skill guidance

2. **Execute fix after root cause is confirmed**
   - Modify code based on root cause analysis results

3. **If complex type issues are involved**
   - Load skill `fw-typescript-advanced-types` to get type handling guidance

---

#### 3.2 Feature Task Implementation Flow

**Execute the following actions (in order)**:

1. **Load the project skill**
   - Load skill `fw-project-develop` to understand the project structure and technology stack

2. **If the technology stack is React**
   - Load skill `fw-react-best-practices` to get React best practices guidance

3. **If component development is involved**
   - Load skill `fw-react-components` to get component standards guidance

4. **Execute code changes**
   - Implement the feature according to skill guidance

---

#### 3.3 Refactor Task Implementation Flow

**Execute the following actions (in order)**:

1. **Load the project skill**
   - Load skill `fw-project-develop` to understand the project structure and technology stack

2. **Keep behavior unchanged by default**
   - During refactoring, keep functional behavior unchanged

3. **Analyze impact scope first, then implement in batches**
   - Analyze the impact scope, implement changes in batches

---

#### 3.4 Optimize Task Implementation Flow

**Execute the following actions (in order)**:

1. **Load the project skill**
   - Load skill `fw-project-develop` to understand the project structure and technology stack

2. **Analyze performance bottlenecks before optimizing**
   - Analyze performance bottleneck locations first, then optimize targeted areas

---

### Step 4: Handle Special Cases

**During code changes, pay attention to the following rules**:

4-1: For capabilities marked as `not_applicable` in the project skill, do not create fictitious implementations

4-2: If new blockers, environment issues, dependency issues, or skill route gaps are found, write back and update

4-3: If the long-task mechanism is enabled (Stage 3), continuously write back step status during implementation

4-4: If environment issues prevent validation, output environment fix recommendations and stay in Stage 5

---

### Step 5: Output Auto-Transition Prompt and Auto-Transition to the Next Stage

**After code changes are complete, output the auto-transition prompt**:

```
[Implementation] Task ID: {current task ID}
Code changes complete.

Changes:
- {list of changed files}
- {brief description of changes}

Proceeding to the next stage: [Verification].
```

**Auto-transition to stage6 after completion** (do not pause to wait for user confirmation):

---

### Step 6: Update the State File to the Next Stage

**Before entering stage6, update the state file**:

```
**Task ID**: {current task ID}
**Currently Executing**: Verification
**Stage**: stage6
**Status**: in_progress
**Next Step**: Execute functional validation, lint/type/build/test
```

---

## Prohibited Actions

- Prohibited: outputting "please confirm whether the feature is correct"
- Prohibited: outputting "whether to enter verification"
- Prohibited: waiting for user confirmation (auto-transition to stage6)
- Prohibited: pausing in stage5 to wait for user confirmation

---

## Rollback Conditions

- If internal validation fails, roll back to this stage to continue fixing
- If running, lint, type, build, or tests cannot pass due to environment issues, stay in this stage and first explain to the user the actions needed to fix the environment
