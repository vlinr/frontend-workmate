# Stage 2: Analyze Requirements and Scope

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain scope analysis content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "Implementation plan" | Prohibited: implementation-stage content |
| "Specific fix steps" | Prohibited: specific implementation steps |
| Task breakdown lists | Prohibited: self-created task lists |

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output: `[Scope Analysis] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID

### 3. Must Wait for User Confirmation ⚠️ Mandatory Rule

**⚠️ Important: After scope analysis is complete, must wait for user confirmation before proceeding to the next stage**

After completing scope analysis:
- Output the analysis conclusion summary
- Output the confirmation prompt
- **End the current reply**
- **Wait for the user to reply "continue" or request changes**

**Prohibited**:
- ❌ Prohibited: proceeding to the next stage immediately after outputting the summary
- ❌ Prohibited: skipping the user confirmation step

---

## Objective

- Convert project knowledge into a clearly defined change scope for the current task.
- Always conduct scope analysis around the original requirement anchor established in Stage 0; new constraints added within the stage can only refine implementation boundaries, not replace the original requirement.

## Content Processing Rules (Important)

**Responsibilities and boundaries of this stage**:

| Belongs to This Stage | Does Not Belong to This Stage (record to context) |
| --- | --- |
| Scope analysis, changed file identification | Specific implementation plan, code changes |
| Task type determination (bug/feature/refactor) | Specific fix plan, specific feature implementation |
| Long-task determination | Execution plan details |
| Skill route planning | Actual skill invocations |

**Users may provide any content; this stage only processes content that belongs to scope analysis**:

```
Examples of user-provided content:
- "Login page validation fails, need to check form validation logic"
- "User management needs permission control, 5 files need to be modified"
- "Homepage optimization requires changes to the webpack config"

Processing approach:
- Information that belongs to scope analysis → process in this stage
- Information that belongs to the implementation plan → record to task context, process in stage5
- Do not reject user content, just process it stage by stage
```

## Execution Flow

**After entering this stage, execute in the following order**:

---

### Step 1: Update the State File

**Use the edit tool to update the state file**:

Find the state block corresponding to the current Task ID (from context `current_task_id`):
- Search for content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Replace the state block content with:

```
**Task ID**: {current task ID}
**Currently Executing**: Scope Analysis
**Stage**: stage2
**Status**: in_progress
**Next Step**: Execute scope analysis, determine task type and whether it is a long task
**When user raises changes**: keep status at stage2 → merge user feedback → update analysis conclusion → output again
**Loop path**: stage2 → stage2 → loop until user replies "continue"
```

---

### Step 2: Pre-Checks and Skill Loading

**⚠️ Important: The following checks must be executed in order, and each checkpoint may require loading a skill**

---

#### Check Project Skill Status

Execute the following actions:

1. Load skill `fw-project-develop` (using the skill tool, not reading the file directly)
2. Obtain project structure and technology stack information from the skill
3. If the project skill status is "pending generation", first execute Stage 1 Project Scan to populate the project skill content

---

#### Read Requirement Input

Execute the following actions:

1. Read the "user's original description", "original requirement anchor", and screenshot/attachment summary from `request-brief`
2. As long as these fields are non-empty, treat them as the primary input for the current task goal
3. Only when "user's original description", "original requirement anchor", and "screenshot/attachment summary" are ALL empty and the current task goal truly cannot be determined, may you ask the user "what needs to be done"

---

#### Check Documentation in the Code Change Directory

**⚠️ Important: This step requires determining whether to load the fw-code-analysis-doc skill**

Execute the following actions:

1. Based on user input, determine the [Code Change Directory] (the directory containing files to be added/modified)

2. Check whether the directory already has documentation (README.md / AGENTS.md)

3. **Determine whether to load fw-code-analysis-doc**:

   **Conditions requiring loading (any one is sufficient)**:

   | Condition | Specific Check |
   | --- | --- |
   | Missing documentation | No README.md or AGENTS.md in the directory |
   | Outdated documentation | Document last updated > 3 months ago, or content doesn't match current code |
   | Complex implementation relationships | Directory has > 5 files, or has multi-level nested structure |
   | AI cannot analyze on its own | Code logic is complex, dependency relationships are unclear |
   | Involves a core module | Directory is a core business module of the project (e.g., pages/, components/) |

4. If the above conditions are met:
   - Load skill `fw-code-analysis-doc` to analyze the code structure and get analysis guidance
   - Analyze the directory structure according to skill guidance

5. If conditions are not met:
   - Read existing documentation directly to understand the directory structure

---

### Step 3: Core Analysis Actions (Execute in Order)

**Based on the project skill and existing documentation in the [Code Change Directory], analyze in the following order**:

#### 3.1 UI Framework Analysis
- Focus on analyzing the UI framework currently used by the project, distinguishing between a general framework and a custom framework
- For a general UI framework, clearly record the framework name, version, main component entry point, and replacement boundaries
- For a custom UI framework, first confirm whether Stage 1 has already matched the corresponding framework skill
  - If not, return to Stage 1 to output a prompt asking the user to provide framework documentation or framework skills
  - If the user has not yet explicitly answered (`pending`), stay in this stage and wait — do not continue scope analysis
  - If the user provides framework documentation, generate the framework skill and archive it to the UI framework skill under the [Skills Directory]
  - If the user provides framework skills, store them directly in the [Skills Directory] and prioritize reuse
  - Only when the user explicitly indicates they will not provide framework documentation/skills (`not_provided`) AND there is analyzable custom UI framework in the source code, may you generate the corresponding skill based on source code analysis
  - If the source code is also insufficient to support a stable skill, mark `not_applicable` and continue

#### 3.2 Execute Analysis with Reference Rules
- Reference `../rules/frontend-change-scope.md` to execute the scope analysis flow

#### 3.3 Mark Task Type
- `feature`: new functionality, new pages, new components, etc.
- `bug`: problem fixes, exception handling, etc.
- `refactor`: structural adjustments, code optimization without changing behavior, etc.
- `optimize`: performance optimization, experience optimization, code quality improvement, etc.
- Clearly annotate the task type in the output

#### 3.4 Determine Change Scope
- **Number of changed files**: estimate the number of files that need to be modified
- **Changed file location list**: list the estimated file paths to be modified
- **Affected modules**: which modules will be affected
- **Interface contracts**: interface or data structure changes involved
- **Risk points**: potential risks
- **Regression scope**: the scope that needs regression validation

#### 3.5 Plan Skill Invocation Route

**⚠️ Important: The following skills will be invoked in this stage (during Stage 5 Implementation)**

| Task Type/Condition | Skill to Invoke | Purpose |
| --- | --- | --- |
| `bug` task | `fw-systematic-debugging` | Debug the bug, find root cause |
| React technology stack | `fw-react-best-practices` | Understand React best practices |
| React with component development | `fw-react-components` | Understand React component standards |
| Complex type issues | `fw-typescript-advanced-types` | Handle TypeScript complex types |
| Missing critical skills | `find-skills` | Find missing skills |

**⚠️ Note**:
- The above skills will be invoked during Stage 5 Implementation; this stage only plans them
- Stage 6 validation skills (`fw-accessibility`, `fw-web-design-guidelines`) will be conditionally invoked in Stage 6 based on actual change types

#### 3.6 Generate Stage Output
- Regardless of task complexity, a minimum Stage 2 pass output must be formed
- For complex tasks, additionally supplement the full `../templates/analysis/change-scope.md` or `../templates/analysis/capability-matrix.md`
- Only analyze capabilities actually needed for the current task — do not create long-term documents for temporary tasks

---

### Step 4: Long-Task Determination

**After scope analysis is complete, determine whether it is a long task**:

#### Determination Criteria

| Condition | Long Task? |
| --- | --- |
| Estimated modified files > 5 | ✅ Long task |
| Involves 3+ different directories/modules | ✅ Long task |
| Requires coordination across multiple functional modules | ✅ Long task |
| Estimated to require multiple rounds of conversation to complete | ✅ Long task |
| Single file modification, single feature point | ❌ Short task |
| Small-scope bug fix | ❌ Short task |
| Single component adjustment | ❌ Short task |

#### Flow Branches

- **Is a long task** → Output "proceeding to the next stage: [Execution Plan]" → Enter Stage 3
- **Not a long task** → Output "proceeding to the next stage: [Material Supply]" → Enter Stage 4 directly (skip Stage 3)

---

### Step 5: Output Analysis Conclusion and Wait for User Confirmation ⚠️ Must Wait for User Confirmation

**⚠️ Important: After scope analysis is complete, must wait for user confirmation before proceeding to the next stage**

After outputting the analysis conclusion, execute the following actions:

#### 5.1 Update the State File to Waiting for User Confirmation

Use the edit tool to update the state block for the current Task ID to:

```
**Task ID**: {current task ID}
**Currently Executing**: Scope Analysis
**Stage**: stage2
**Status**: waiting_user
**Next Step**: Wait for user confirmation of analysis conclusion
**When user raises changes**: keep status at stage2 → execute merge update → output analysis conclusion again → wait for confirmation
**Loop path**: stage2 → stage2 → loop until user replies "continue"
```

#### 5.2 Output Analysis Conclusion

Based on the long-task determination result, output the corresponding analysis conclusion:

**For long tasks**:
```
The above is the conclusion of this stage: [brief analysis conclusion].

[Long-Task Determination] This task is estimated to involve multiple files/modules and is a long task — an execution plan needs to be established.

Please confirm whether we can proceed to the next stage: [Execution Plan].
- If there are discrepancies or additions, please let me know directly.
- If no changes are needed, reply "continue".
```

**For short tasks**:
```
The above is the conclusion of this stage: [brief analysis conclusion].

[Long-Task Determination] This task is estimated to have a small scope and is not a long task — it will proceed directly to the Material Supply stage.

Please confirm whether we can proceed to the next stage: [Material Supply].
- If there are discrepancies or additions, please let me know directly.
- If no changes are needed, reply "continue".
```

#### 5.3 User Confirmation Loop Mechanism

- User replies "continue" → Enter the next stage (based on long-task determination)
- User raises additions/corrections/questions → **Understand and merge user feedback** → Update analysis conclusion → Output again and wait for confirmation
- **Loop until the user replies "continue"**
- Prohibited: entering the next stage without the user explicitly replying "continue"

---

### Step 6: Update the State File After User Confirmation (Based on Long-Task Determination)

**After user confirmation, update the state file based on the long-task determination result**:

#### For long tasks

```
**Task ID**: {current task ID}
**Currently Executing**: Execution Plan
**Stage**: stage3
**Status**: in_progress
**Next Step**: Execute stages/plan.md
**When user raises changes**: return to stage2 → keep status at stage2 → re-analyze
**Loop path**: none
```

#### For short tasks

```
**Task ID**: {current task ID}
**Currently Executing**: Material Supply
**Stage**: stage4
**Status**: in_progress
**Next Step**: Execute stages/supply.md
**When user raises changes**: return to stage2 → keep status at stage2 → re-analyze
**Loop path**: none
```

---

### Step 7: Loop Handling When User Raises Changes

**Loop path when the user raises changes/questions**:

#### 7.1 Keep Status at stage2

Use the edit tool to update the status to:

```
**Currently Executing**: Scope Analysis
**Stage**: stage2
**Status**: in_progress
**Next Step**: Merge user feedback, update analysis conclusion
**When user raises changes**: keep status at stage2 → merge update → output analysis conclusion again
**Loop path**: stage2 → stage2 → loop until user replies "continue"
```

#### 7.2 Execute Merge Update

- Read user feedback → Merge into the analysis conclusion

#### 7.3 Output Analysis Conclusion Again

- Output the updated scope analysis result

#### 7.4 Enter the Waiting State Again

Use the edit tool to update the status to:

```
**Currently Executing**: Scope Analysis
**Stage**: stage2
**Status**: waiting_user
**Next Step**: Wait for user confirmation of the updated analysis conclusion
**When user raises changes**: keep status at stage2 → merge update → output analysis conclusion again
**Loop path**: stage2 → stage2 → loop until user replies "continue"
```

#### 7.5 Loop Until User Replies "Continue"

- Loop through steps 7.1 → 7.2 → 7.3 → 7.4 → 7.5
- Until the user replies "continue", then enter the next stage

---

### Prohibited Actions

- Prohibited: guessing paths without reading the config file
- Prohibited: not updating the status to waiting_user while waiting for the user
- Prohibited: entering the next stage without the user explicitly replying "continue"
- Prohibited: outputting a vague "[Execution Plan] or [Material Supply]" — must output the definitive next stage name based on the determination result
