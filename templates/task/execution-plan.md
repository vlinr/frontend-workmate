# Execution Plan Template

## 1. Task Overview

- Task name:
- Corresponding requirement:
- Execution mode: `Direct execute | Long task`
- Responsible person:
- Task identifier:
- Current stage: `stage0 | stage1 | stage2 | stage3 | stage4 | stage5 | stage6 | stage7 | stage8`
- Current stage status: `pending | in_progress | waiting_user | completed | blocked`
- Next stage: `stage0 | stage1 | stage2 | stage3 | stage4 | stage5 | stage6 | stage7 | stage8 | not_applicable`
- Current stage goal:
- Current stage entry condition:
- Current stage completion condition:
- Stage blocking reason:

## 2. Step Breakdown

| Step ID | Title | Goal | Input/Dependencies | Expected Output | Status | Version |
| --- | --- | --- | --- | --- | --- | --- |
| S01 |  |  |  |  | `pending` | `v1` |

## 3. Skill Binding

| Step | Skill Used | MCP Invoked | Fallback Strategy |
| --- | --- | --- | --- |
| S01 |  | `Yes | No` |  |

## 4. Key Gates

- Pre-development gate:
- Pre-verification gate:
- Pre-delivery gate:
- Stage 1 user confirmation status: `approved | revise_needed | not_applicable`
- Stage 2 user confirmation status: `approved | revise_needed | pending`
- Stage 6 user review status: `approved | revise_needed | pending | not_applicable`

## 5. Risks and Rollback

- High-risk steps:
- Rollback points:
- User confirmation points:
- User review points:

## 6. Execution Conclusion

- Can execute directly: `yes | no`
- If no, blocking items:
- Checkpoint resume strategy:
- Next step:
- Currently waiting for: `User confirmation | User review | Internal execution | None`

## 7. Stage Switch Requirements

- Before switching stage, must first update "current stage / current stage status / next stage / stage blocking reason".
- If current stage status is not `completed`, cannot switch to next stage.
- If current stage status is `waiting_user` or `blocked`, execution plan must stay at current stage, cannot continue executing subsequent steps.