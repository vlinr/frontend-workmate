---
name: fw-task-plan-checkpoint
description: Long-task step-by-step execution and checkpoint resume skill. Used for multi-step tasks such as feature implementation, refactoring, troubleshooting, and migration. Requires generating a detailed plan in a temporary run directory first, then executing step by step with continuous state write-back. Supports users referencing step IDs directly to rerun or modify a step. If context or token budget approaches its limit, automatically outputs a task handoff file recording key terms, completed items, incomplete items, and next execution instructions for seamless continuation.
---

# Task Plan Checkpoint

Follow the process below without skipping steps.

## 0) Execution Reality (Must Align)

- This skill is not "just producing a plan" — it is an integrated flow of "plan file + actual execution + continuous write-back".
- After triggering this skill, must complete the following within the same task:
  - Initialize the task directory and 5 files
  - Write the plan first, then execute step by step
  - After each step is executed, synchronously update status and logs
  - Support users referencing step IDs directly to continue/rerun/modify
- If the user only requests "produce a plan without executing", explicitly annotate "current mode: plan_only" in `TASK_PLAN.md`.
- If the user has not specifically stated, default to entering "plan_and_execute" mode and execute steps concretely.

## 1) Initialize Task Temporary Directory

- Create a task run directory in the parent directory of the skills directory:
  - `temp/task-runs/<task-id>/`
- `<task-id>` rules:
  - Preferred: `YYYYMMDD-HHMMSS-task-short-name`
  - If no short name: `YYYYMMDD-HHMMSS-task`

Create the following files in the directory:
- `TASK_PLAN.md`: task plan and status checklist
- `PROGRESS_LOG.md`: execution log (appended by time)
- `CONTEXT_KEYS.md`: context key terms and constraints
- `HANDOFF.md`: checkpoint resume information (only updated when handoff is needed)
- `STEP_INDEX.md`: step index and directly referenceable execution instructions

## 2) Produce a Detailed Plan First (Must Precede Implementation)

- Write executable steps in `TASK_PLAN.md`, including at minimum:
  - Step ID (stable ID, format `S01`, `S02`..., not renumbered afterward)
  - Step goal
  - Inputs/dependencies
  - Expected output
  - Status (`pending | in_progress | done | blocked | skipped`)
  - Version (initial is `v1`, after modification `v2/v3...`)
- Record "directly referenceable instruction templates" for each step in `STEP_INDEX.md`:
  - Continue execution template
  - Rerun template
  - Modify and re-execute template
- Step granularity requirements:
  - Each step can be completed and verified within a single short round
  - Avoid "big and general" single-step descriptions

## 3) Execution Strategy (Step by Step)

- Execute strictly in the order of `TASK_PLAN.md`:
  - Before starting a step, set it to `in_progress`
  - After completion, immediately set to `done`
  - If blocked, set to `blocked` and write the blocking reason
- After each step is complete, must update simultaneously:
  - `TASK_PLAN.md` (status change)
  - `PROGRESS_LOG.md` (record "what was done, what was produced, how to verify")
  - `STEP_INDEX.md` (sync the latest step version and most recent execution time)

## 3.1) Step Rerun and Step Modification Mechanism (Must Support)

- When the user explicitly references a step ID (e.g., `S03`), handle by intent:
  - **Rerun a step**: keep the step goal unchanged, version unchanged, re-execute and append to the log.
  - **Modify a step**: first update the step content and increment version by 1, then execute that step.
- Status rollback rules after rerun/modification:
  - Set the target step to `in_progress -> done/blocked`
  - If the target step's output affects subsequent steps, set affected steps to `pending` and annotate "rolled back due to Sxx change" in `TASK_PLAN.md`
- Append "operation type" in `PROGRESS_LOG.md`:
  - `normal_execute | rerun_step | revise_step`

## 3.2) Document Direct Reference Protocol (For Users to Reference Directly)

- Maintain fixed entries for each step in `STEP_INDEX.md`:
  - `step_id`
  - `title`
  - `current_version`
  - `status`
  - `continue_prompt`
  - `rerun_prompt`
  - `revise_prompt`
- Template examples:
  - `continue_prompt`: `Please read temp/task-runs/<task-id>/TASK_PLAN.md and STEP_INDEX.md, then continue executing S03.`
  - `rerun_prompt`: `Please read temp/task-runs/<task-id>/TASK_PLAN.md and PROGRESS_LOG.md, rerun S03, and record the differences.`
  - `revise_prompt`: `Please read temp/task-runs/<task-id>/TASK_PLAN.md, modify S03 with a new version according to the following requirements, then execute: <change requirements>`

## 4) Context Key Term Consolidation

- Maintain resumable key terms in `CONTEXT_KEYS.md`, including at minimum:
  - Task goal key terms
  - Involved module/feature key terms
  - Key constraint key terms (interface contracts, compatibility requirements, risk points)
  - Key decision key terms (why this approach was chosen)
- Update immediately whenever a plan changes, scope expands, or constraints change.

## 5) Token/Context Budget Protection (Checkpoint Mechanism)

Trigger "handoff write-to-disk" in any of the following situations:
- Task clearly cannot be completed in the current round
- Step context is too long, continuing execution will lose critical information
- Predicted continued output will approach the token limit

After triggering, must update `HANDOFF.md` with:
- Task summary (1 paragraph)
- Current progress (list of completed steps)
- Incomplete steps (by priority)
- Current blockers and suggested solutions
- First action of the next round (specified clearly enough to execute directly)
- Directly referenceable continuation prompts (1~3, prioritize templates from `STEP_INDEX.md`)

## 6) Delivery Standards

- After any interruption, users can continue the task using only the five files in the task directory (including `STEP_INDEX.md`).
- `TASK_PLAN.md` must be consistent with actual progress — "executed but not written back" is not allowed.
- `HANDOFF.md` must be directly executable for continuation when the checkpoint mechanism is triggered.
- Users can precisely specify "continue/rerun/modify" a specific step via step ID, without needing to re-describe the full task.

## 7) Output Requirements

- When reporting to the user, also provide the task directory path.
- If a checkpoint occurs, clearly inform the user that they can reference `HANDOFF.md` directly to continue.
