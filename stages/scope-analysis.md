# Stage 2: Analyze Requirements and Scope

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain scope analysis content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "Implementation plan" | Prohibited from outputting implementation phase content |
| "Specific fix steps" | Prohibited from outputting specific implementation steps |
| Task breakdown list | Prohibited from creating task lists |

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output: `[Scope Analysis] Task ID: task_xxxxxxxx`
- State file update must carry Task ID

### 3. Must Wait for User Confirmation

**After scope analysis completes**:
- Output analysis conclusion summary
- Output confirmation prompt
- End current reply
- Wait for user to reply "continue" or propose modifications

---

## Goal

- Convert project knowledge into clear modification scope for this task.
- Always perform scope analysis around original requirement anchor established in Stage 0; constraints added within phase can only refine implementation boundary, cannot replace original requirement.

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Record to Context) |
| --- | --- | --- |
| Scope analysis, change file identification | Specific implementation plan, code modification |
| Task type judgment (bug/feature/refactor) | Specific fix plan, specific feature implementation |
| Long task judgment | Execution plan details |
| Skill route planning | Actual skill invocation |

**User can provide any content, this phase only processes content belonging to scope analysis**:

```
Example content user may provide:
- "Login page validation failed, need to check form validation logic"
- "User management needs permission control, need to change 5 files"
- "Homepage optimization needs to change webpack config"

Handling method:
- Info belonging to scope analysis → This phase processes
- Info belonging to implementation plan → Record to task context, wait for stage5 to process
- Don't reject user content, only process by phase
```

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit When Entering This Phase

**Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
- Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use edit tool to replace that status block content with:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Scope Analysis
**Phase**: stage2
**Status**: in_progress
**Next Step**: Execute scope analysis, judge task type and if long task
**User Proposed Modifications**: Status stays stage2 → merge user feedback → update analysis conclusion → re-output
**Loop Path**: stage2 → stage2 → loop until user replies "continue"
```

### Edit Again After Outputting Conclusion

When waiting for user confirmation, use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Scope Analysis
**Phase**: stage2
**Status**: waiting_user
**Next Step**: Wait for user to confirm analysis conclusion
**User Proposed Modifications**: Status stays stage2 → execute merge update → re-output analysis conclusion → wait for confirmation
**Loop Path**: stage2 → stage2 → loop until user replies "continue"
```

### Edit Again When User Proposes Modifications

**Loop path when user proposes modifications/issues**:

1. **Status stays stage2**:
   ```
   **Currently Executing**: Scope Analysis
   **Phase**: stage2
   **Status**: in_progress
   **Next Step**: Merge user feedback, update analysis conclusion
   **User Proposed Modifications**: Status stays stage2 → merge update → re-output analysis conclusion
   **Loop Path**: stage2 → stage2 → loop until user replies "continue"
   ```

2. **Execute Merge Update**: Read user feedback → merge into analysis conclusion

3. **Re-output Analysis Conclusion**: Output updated scope analysis results

4. **Re-enter Wait State**:
   ```
   **Currently Executing**: Scope Analysis
   **Phase**: stage2
   **Status**: waiting_user
   **Next Step**: Wait for user to confirm updated analysis conclusion
   **User Proposed Modifications**: Status stays stage2 → merge update → re-output analysis conclusion
   **Loop Path**: stage2 → stage2 → loop until user replies "continue"
   ```

5. **Loop until user replies "continue"**, then proceed to next phase

### Edit Again After User Confirmation (Based on Long Task Judgment)

Use edit tool again to update that Task ID's status block:

Long task:
```
**Task ID**: {Current Task ID}
**Currently Executing**: Execution Plan
**Phase**: stage3
**Status**: in_progress
**Next Step**: Execute stages/plan.md
**User Proposed Modifications**: Return to stage2 → status stays stage2 → re-analyze
**Loop Path**: None
```

Short task:
```
**Task ID**: {Current Task ID}
**Currently Executing**: Material Supply
**Phase**: stage4
**Status**: in_progress
**Next Step**: Execute stages/supply.md
**User Proposed Modifications**: Return to stage2 → status stays stage2 → re-analyze
**Loop Path**: None
```

### Prohibited Actions

- Prohibited from guessing paths without reading config file
- Prohibited from not updating status to waiting_user when waiting for user

## Input

- `request-brief`
- Project skill (**Dynamic Read**):
  - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
  - **Project skill reference**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md` (**Must Invoke**)
- Existing documentation in code change directory

## Execution Actions

1. **Must First Invoke Skills**:
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`
   - **Project skill reference**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md` (if exists)
   - If code change directory lacks documentation, **must first read config file**, dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` supplement understanding
   - Constraints obtained after invocation as scope analysis reference
2. First read "user original description", "original requirement anchor" and screenshot/attachment summary in `request-brief`; as long as these fields are non-empty, must treat them as current task main goal input.
3. Combine project skill with existing documentation in code change directory for scope analysis.
3. Only when "user original description", "original requirement anchor", "screenshot/attachment summary" are all empty, and current task goal truly cannot be determined, allow asking user "what to do this time"; otherwise cannot re-ask main requirement in Stage 2.
4. If code change directory lacks documentation, or implementation relationships unclear, **first read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` supplement understanding.
5. Focus on analyzing current UI framework used by project, distinguish common framework vs self-developed framework.
6. If common UI framework, clearly record framework name, version, main component entry and replacement boundary.
7. If self-developed UI framework, first confirm if Stage 1 already hit corresponding framework skill; if not, must return to Stage 1 first to ask user if provide framework documentation or framework skills.
8. If user hasn't clearly answered (pending), stay in this phase waiting, cannot continue scope analysis.
9. If user provides framework documentation, generate based on documentation and archive to UI framework skill under Skill Directory.
10. If user provides framework skills, directly store in Skill Directory and prioritize reuse.
11. Only after user explicitly states not providing framework documentation/skills (not_provided), and source code has analyzable self-developed UI framework, can generate corresponding skill based on source code analysis; if source code also insufficient to support stable skill, mark `not_applicable` and continue.
12. Refer to `rules/frontend-change-scope.md` to execute scope analysis flow.
13. **Mark Task Type** (Must clearly mark):
    - `Feature`: New functionality, new page, new component etc.
    - `bug`: Problem fix, exception handling etc.
    - `refactor`: Structure adjustment, code optimization without behavior change etc.
    - `optimize`: Performance optimization, experience optimization, code quality improvement etc.
    - Must clearly mark task type when outputting
14. Regardless of task complexity, must form minimum Stage 2 checkpoint artifact; complex tasks additionally supplement complete `templates/analysis/change-scope.md` or `templates/analysis/capability-matrix.md`.
15. Only analyze capabilities actually needed for this task, don't additionally deposit long-term documentation for temporary tasks.
16. **Must Clearly Output Subsequent Skill Invocation Plan** (Stage 5 must execute, dynamic read):
- `bug` task → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md` (Stage 5 must execute)
- React tech stack (marked in project skill) → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-best-practices/SKILL.md` (Stage 5 must execute)
- React tech stack and involves component development → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-components/SKILL.md` (Stage 5 must execute)
- Complex type issues → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-typescript-advanced-types/SKILL.md` (Stage 5 must execute)
- Page/component changes → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-accessibility/SKILL.md` (Stage 6 must execute)
- Style/UI changes → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-web-design-guidelines/SKILL.md` (Stage 6 actual invocation)
17. If critical skill missing, invoke `find-skills`, output supplement suggestions.
18. **Must Clearly Output the Following Details**:
    - **Change File Count**: Estimated number of files to modify (specific number)
    - **Change File Location List**: List estimated file paths to modify
    - **Affected Modules**: Which modules will be affected
    - **Interface Contract**: Involved interfaces or data structure changes
    - **Risk Points**: Possible risks
    - **Regression Scope**: Scope needing regression verification
    - Give clear conclusion of "what I will do, why this way, what not to do temporarily"
19. **User Confirmation Loop Mechanism (Must Execute)**:
    - Output analysis conclusion, wait for user to confirm "modification scope is correct"
    - User replies "continue" → Proceed to next phase
    - User proposes supplement/correction/issues → **Understand and merge user feedback** → Update analysis conclusion → Re-output wait for confirmation
    - **Loop until user replies "continue"**
    - **Prohibited**: Proceed to next phase before user explicitly replies "continue"

## Long Task Judgment (Must Execute)

**After scope analysis completes, must judge if long task**:

### Judgment Criteria

| Condition | Is Long Task |
| --- | --- |
| Estimated modification file count > 5 | ✅ Long task |
| Involves 3+ different directories/modules | ✅ Long task |
| Needs coordination across multiple feature modules | ✅ Long task |
| Estimated need multiple conversation rounds to complete | ✅ Long task |
| Single file modification, single feature point | ❌ Short task |
| Small scope bug fix | ❌ Short task |
| Single component adjustment | ❌ Short task |

### Flow Branch

```
Scope analysis complete → Judge if long task:
  ├─ Yes long task → Output "Proceeding to next phase: [Execution Plan]"
  │              → Enter Stage 3
  └─ Not long task → Output "Proceeding to next phase: [Material Supply]"
                    → Directly enter Stage 4 (Skip Stage 3)
```

## Output

- Must at least form a minimum Stage 2 checkpoint artifact, default write to `templates/analysis/change-scope.md` or internal state:
  - `current_stage = stage2`
  - `current_stage_status`
  - `stage_goal`
  - `entry_conditions`
  - `completion_conditions`
  - `next_stage`
  - `stage_block_reason`
  - Task type, modification scope, risks and skill route

**User Confirmation Prompt** (Phase end confirmation):

After outputting analysis conclusion, **must first judge if long task**, then output corresponding prompt based on judgment result:

### When Long Task:

```
Above is this phase conclusion: [Brief analysis conclusion].

[Long Task Judgment] This task estimated to involve multiple files/modules, belongs to long task, need to build execution plan.

Please confirm if we can proceed to next phase: [Execution Plan].
- If have deviation or supplement, please tell me directly.
- If no other modifications, reply "continue" is fine.
```

### When Short Task:

```
Above is this phase conclusion: [Brief analysis conclusion].

[Long Task Judgment] This task estimated scope is small, not long task, will directly enter material supply phase.

Please confirm if we can proceed to next phase: [Material Supply].
- If have deviation or supplement, please tell me directly.
- If no other modifications, reply "continue" is fine.
```

**Prohibited**: Output vague "[Execution Plan] or [Material Supply]", must output clear next phase name based on judgment.

## Fallback Conditions

- If verification or delivery phase discovers scope judgment deviation, fallback to this phase to re-analyze.