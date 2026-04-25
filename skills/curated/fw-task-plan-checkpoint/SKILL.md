---
name: fw-task-plan-checkpoint
description: Long task step-by-step execution and checkpoint resume skill. Used for feature implementation, refactoring, debugging, migration, and other multi-step tasks. Requires generating detailed plan in skill pack's temp runtime directory first, then executing step-by-step with continuous state updates. Supports users directly referencing step ID to rerun or modify a specific step; if context or token budget approaches limit, automatically outputs handoff file recording keywords, completed items, pending items, and next-step instructions for seamless continuation.
---

# Task Plan Checkpoint

Execute the following workflow, do not skip steps.

## 0) Execution Reality (Must Align)

- This skill is not "just produce plan", but "plan file + actual execution + continuous state updates" integrated workflow.
- After triggering this skill, must complete within same task:
  - Initialize task directory and 5 files
  - Write plan first, then execute step-by-step
  - After each step execution, sync update state and logs
  - Support user to continue/rerun/modify by step ID
- If user only requests "produce plan without execution", must explicitly annotate in `TASK_PLAN.md` "current mode: plan_only".
- If user doesn't explicitly state, default to "plan_and_execute" mode and execute step-by-step.

## 1) Initialize Task Temp Directory

- Create task runtime directory in skill directory's parent level:
  - `temp/task-runs/<task-id>/`
- `<task-id>` rules:
  - Priority: `YYYYMMDD-HHMMSS-task-short-name`
  - No short name: `YYYYMMDD-HHMMSS-task`

Create the following files in the directory:
- `TASK_PLAN.md`: Task plan and status checklist
- `PROGRESS_LOG.md`: Execution log (append by timestamp)
- `CONTEXT_KEYS.md`: Context keywords and constraints
- `HANDOFF.md`: Checkpoint resume info (only update when handoff needed)
- `STEP_INDEX.md`: Step index and executable instruction templates

## 2) Produce Detailed Plan First (Must Precede Implementation)

- Write executable steps in `TASK_PLAN.md`, must include:
  - Step ID (stable ID, format `S01`, `S02`..., unchanged afterward)
  - Step goal
  - Input/dependencies
  - Expected output
  - Status (`pending | in_progress | done | blocked | skipped`)
  - Version (initial `v1`, after modification `v2/v3...`)
- Record "directly referenceable instruction templates" for each step in `STEP_INDEX.md`:
  - Continue execution template
  - Rerun template
  - Modify and re-execute template
- Step granularity requirements:
  - Each step should complete in one short turn and be verifiable
  - Avoid "big and comprehensive" single-step descriptions

## 3) Execution Strategy (Progress Step-by-Step)

- Strictly execute in `TASK_PLAN.md` order:
  - Before starting a step, first set it to `in_progress`
  - After completion, immediately set to `done`
  - If blocked, set to `blocked` and write blocking reason
- After completing each step, must simultaneously update:
  - `TASK_PLAN.md` (status change)
  - `PROGRESS_LOG.md` (record "what was done, what output, how verified")
  - `STEP_INDEX.md` (sync step latest version and recent execution time)

## 3.1) Step Rerun and Modification Mechanism (Must Support)

- When user explicitly references step ID (e.g., `S03`), handle according to intent:
  - **Rerun a step**: Keep step goal unchanged, version unchanged, re-execute and append log.
  - **Modify a step**: First update step content with version +1, then execute that step.
- Rollback rules after rerun/modification:
  - Target step set to `in_progress -> done/blocked`
  - If target step output affects subsequent steps, set affected steps to `pending` and annotate in `TASK_PLAN.md` "rolled back due to Sxx change"
- Append "operation type" in `PROGRESS_LOG.md`:
  - `normal_execute | rerun_step | revise_step`

## 3.2) Document Direct Reference Protocol (For User Direct Reference)

- Maintain fixed entries for each step in `STEP_INDEX.md`:
  - `step_id`
  - `title`
  - `current_version`
  - `status`
  - `continue_prompt`
  - `rerun_prompt`
  - `revise_prompt`
- Template examples:
  - `continue_prompt`: `Please read temp/task-runs/<task-id>/TASK_PLAN.md and STEP_INDEX.md, continue executing S03.`
  - `rerun_prompt`: `Please read temp/task-runs/<task-id>/TASK_PLAN.md and PROGRESS_LOG.md, rerun S03, and record differences.`
  - `revise_prompt`: `Please read temp/task-runs/<task-id>/TASK_PLAN.md, modify S03 according to the following requirements and execute with new version: <change requirements>`

## 4) Context Keyword Accumulation

- Maintain resume-able keywords in `CONTEXT_KEYS.md`, must include:
  - Task goal keywords
  - Involved modules/features keywords
  - Key constraint keywords (interface contracts, compatibility requirements, risk points)
  - Key decision keywords (why this approach)
- Update immediately when solution changes, scope expands, or constraints change.

## 5) Token/Context Budget Protection (Checkpoint Mechanism)

Trigger "handoff write" when any of the following occurs:
- Task clearly cannot complete in current turn
- Step context too long, continuing execution would lose key info
- Estimated continued output would approach token limit

After triggering must update `HANDOFF.md`, including:
- Task summary (1 paragraph)
- Current progress (completed step list)
- Pending steps (by priority)
- Current blockers and suggested solutions
- Next turn first action (specific enough to directly execute)
- Directly referenceable continue prompts (1-3, prioritize referencing `STEP_INDEX.md` templates)

## 6) Delivery Standards

- After interruption at any moment, user can continue task solely with the 5 files in task directory (including `STEP_INDEX.md`).
- `TASK_PLAN.md` consistent with real progress, disallow "executed but not written back".
- `HANDOFF.md` must be directly resumable when checkpoint triggered.
- User can precisely specify "continue/rerun/modify" by step ID, no need to re-describe entire task.

## 7) Output Requirements

- When reporting to user, simultaneously provide task directory path.
- If checkpoint occurs, explicitly remind user can directly reference `HANDOFF.md` to continue.