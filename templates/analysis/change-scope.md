# Change Scope Template

## 1. Requirement Conclusion

- Task Title:
- Original Requirement Anchor:
- Original Target Object:
- Original Expected Result:
- Original Screenshot/Attachment Summary:
- Current Phase Added Constraints:
- Current Phase Added Constraint Category: `Implementation Constraint Supplement | Original Requirement Correction | Project Long-term Rules | pending`
- Confirmed "Added Constraints Won't Overwrite Original Requirement": `yes | no | pending`
- Current Phase: `stage2_scope`
- Current Phase Status: `pending | in_progress | waiting_user | completed | blocked`
- Next Phase: `stage3_plan | stage4_supply | not_applicable`
- Current Phase Goal:
- Current Phase Entry Condition:
- Current Phase Completion Condition:
- Phase Block Reason:
- Approved to Enter Next Phase: `yes | no | pending`
- Next Phase User Confirmation Statement:
- Type: `bug | feature | refactor`
- Target Description:
- User Confirmation Status: `approved | revise_needed | pending | not_applicable`
- User Supplementary Request Merged: `yes | no | pending`
- Post-Merge Echo Prompt:
- Analysis Conclusion Summary (What I will do / Why this way / What not to do temporarily):

## 2. Modification Scope

- Scope analysis must use "Original Requirement Anchor" as main axis; if current phase added technical preferences, style plans, local limitations or implementation paths, only reflect in "Modification Reason/Expected Action", cannot rewrite task title and original goal.
- If "Original Requirement Anchor" or "Original Screenshot/Attachment Summary" already can determine main requirement, this phase cannot re-require user to restate "what to do".

| Module | Directory/File | Modification Reason | Expected Action |
| --- | --- | --- | --- |
|  |  |  |  |

## 3. Dependencies and Prerequisites

- Dependent Skills:
- Dependent Documentation:
- Dependent Interfaces or Design Specs:
- Dependent Environment:
- Stage 5 Execution Pre Material Supplement Strategy: `feature default supplement | bug as-needed supplement | refactor default skip | not_applicable`

## 4. Skill Invocation Plan

- Main Skill Route:
- Before subsequent formal execution phases (Stage 3/4/5/6/7) start, must first check and consume confirmed skill routes here; if subsequent phase skips marked required skills, treat as flow violation.
- Need Long Task:
- Notes:

## 5. Risk Analysis

- Direct Risks:
- Indirect Impact:
- Historical Compatibility Risk:
- Uncertainty Items:

## 6. Regression Scope

- Page Regression:
- Component Regression:
- Interface Regression:
- Permission Regression:
- Build Regression:

## 7. User Confirmation Points

- [ ] Requirement Understanding Consistent
- [ ] Modification Scope Consistent
- [ ] Skill Route Consistent
- [ ] Risk Accepted
- [ ] Stage 5 Execution Pre Material Supplement Strategy Consistent
- [ ] Can Enter Task Orchestration or Direct Development

## 8. Phase Switch Rules

- Stage 2 confirmation content only revolves around "requirement understanding and scope analysis correctness", don't extra show "Enter Stage 2 / Enter Next Step" etc. phase prompts.
- Only when "User Confirmation Status = approved" and "Approved to Enter Next Phase = yes" and current phase status marked as `completed`, can enter next phase.
- If user supplements or corrects request at confirmation point, must first merge request back to current phase conclusion, and echo updated analysis conclusion, then wait for next reply.
- If user supplements implementation constraints, technical preferences or local limitations, must record to "Current Phase Added Constraints", cannot directly rewrite "Original Requirement Anchor".
- If user explicitly states "original requirement wrong / now I want to change to another target", only then allowed to rewrite "Original Requirement Anchor", and write back to Stage 0 / request-brief.
- If exists pending materials, private/self-developed UI library rules unclear, or user confirmation still `pending`, current phase status should stay `waiting_user` or `blocked`, cannot enter development.