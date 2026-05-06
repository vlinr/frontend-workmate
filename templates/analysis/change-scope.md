# Change Scope Template

## 1. Requirement Conclusion

- Task title:
- Original requirement anchor:
- Original target object:
- Original expected result:
- Original screenshot/attachment summary:
- Constraints added in this stage:
- Classification of constraints added in this stage: `implementation constraint supplement | original requirement correction | long-term project rule | pending`
- Whether confirmed "new constraints will not overwrite the original requirement": `yes | no | pending`
- Current stage: `stage2_scope`
- Current stage status: `pending | in_progress | waiting_user | completed | blocked`
- Next stage: `stage3_plan | stage4_supply | not_applicable`
- Current stage goal:
- Current stage entry conditions:
- Current stage completion conditions:
- Stage blocking reason:
- Whether authorized to enter the next stage: `yes | no | pending`
- Next stage user confirmation statement:
- Type: `bug | feature | refactor`
- Goal description:
- User confirmation status: `approved | revise_needed | pending | not_applicable`
- Whether user-supplemented requirements have been merged: `yes | no | pending`
- Post-merge re-display prompt:
- Analysis conclusion summary (what I will do / why / what not to do for now):

## 2. Change Scope

- Scope analysis must be anchored on the "original requirement anchor"; if the constraints added in this stage are technical preferences, style approaches, local limitations, or implementation paths, they can only be reflected in "modification reason/expected action" — they must not rewrite the task title and original goal.
- If the "original requirement anchor" or "original screenshot/attachment summary" can already determine the main requirement, this stage must not ask the user to restate "what to do".

| Module | Directory/File | Modification Reason | Expected Action |
| --- | --- | --- | --- |
|  |  |  |  |

## 3. Dependencies and Preconditions

- Dependent skills:
- Dependent documentation:
- Dependent interfaces or design mockups:
- Dependent environment:
- Stage 5 prerequisite material supplementation strategy: `feature defaults to supplement | bug supplements as needed | refactor defaults to skip | not_applicable`

## 4. Skill Invocation Plan

- Main skill route:
- Before formally starting subsequent execution stages (Stage 3/4/5/6/7), must first check and consume the confirmed skill route here; if subsequent stages skip marked required skills, it should be treated as a process violation.
- Whether long task is needed:
- Notes:

## 5. Risk Analysis

- Direct risks:
- Indirect impacts:
- Historical compatibility risks:
- Uncertainties:

## 6. Regression Scope

- Page regression:
- Component regression:
- Interface regression:
- Permission regression:
- Build regression:

## 7. User Confirmation Points

- [ ] Requirement understanding aligned
- [ ] Change scope aligned
- [ ] Skill route aligned
- [ ] Risk accepted
- [ ] Stage 5 prerequisite material supplementation strategy aligned
- [ ] Can proceed to task orchestration or direct development

## 8. Stage Transition Rules

- Stage 2 confirmation content only revolves around "whether the requirement understanding and scope analysis are correct" — do not additionally display stage prompts like "enter Stage 2 / proceed to next step".
- Only when "user confirmation status = approved" AND "whether authorized to enter the next stage = yes" AND the current stage status is marked as `completed` can we enter the next stage.
- If the user supplements or corrects requirements at the confirmation point, must first merge the requirements back into the current stage conclusion, re-display the updated analysis conclusion, and then wait for the next reply.
- If what the user supplements is implementation constraints, technical preferences, or local limitations, must record them in "constraints added in this stage" — cannot directly rewrite the "original requirement anchor" with that constraint.
- Only if the user explicitly states "the original requirement was wrong / I now want to change to another goal" is it allowed to rewrite the "original requirement anchor" and write it back to Stage 0 / request-brief.
- If there are materials pending supplementation, private/custom UI library rules that are still unclear, or user confirmation is still `pending`, the current stage status should remain `waiting_user` or `blocked` — must not enter development.
