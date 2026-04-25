# Request Brief Template

## 1. Basic Info

- Task Title:
- User Goal:
- Delivery Method: `Analysis Only | Modify Code | Modify Code + Docs | Other`
- Priority: `High | Medium | Low`
- Task Type Preliminary: `bug | feature | refactor | pending`
- Current Phase: `stage0 | stage1 | stage2 | stage3 | stage4 | stage5 | stage6 | stage7 | stage8`
- Current Phase Status: `pending | in_progress | waiting_user | completed | blocked`
- Next Phase: `stage0 | stage1 | stage2 | stage3 | stage4 | stage5 | stage6 | stage7 | stage8 | not_applicable`
- Current Phase Goal:
- Current Phase Entry Condition:
- Current Phase Completion Condition:
- Phase Block Reason:
- Approved to Enter Next Phase: `yes | no | pending`
- Next Phase User Confirmation Statement:
- User Supplementary Request Merged: `yes | no | pending`
- Post-Merge Echo Prompt:
- Fallback Target When Current Step Negated: `stay_current | previous_stage | stage5 | stage6 | stage2 | not_applicable`
- Above phase status fields default for internal recording, not required to show to user as-is; especially in Stage 0, should not directly output as field list.

## 2. User Original Description

> Paste or organize user's original request here.

- Original Screenshot/Attachment Summary:
- Page/Area Already Clear in Original Screenshot:
- Target or Change Intent Already Clear in Original Screenshot:
- If screenshot already sufficiently expresses main requirement, Stage 2 cannot re-ask "what to do":

## 2.1 Original Requirement Anchor

- Original Requirement One-Sentence Summary:
- Original Problem to Solve:
- Original Target Object (page/module/function):
- Original Expected Result:
- Below content only allowed to be rewritten when user explicitly negates or redefines goal; normal phase supplements, technical preferences, implementation constraints cannot overwrite this section:
  - Already Redefined by User: `yes | no | pending`
  - Most Recent Redefinition Basis:

## 3. Minimum Necessary Context

- Stage 0 only allowed to passively record this section fields; if user didn't explicitly provide, leave blank or `pending`, cannot in Stage 0 proactively ask implementation details.
- Target Module/Page:
- Problem Phenomenon or Expected Behavior:
- Impact Scope:
- Code Modification Allowed: `yes | no | pending`
- Only Plan: `yes | no | pending`

## 4. Constraints

- Technical Constraints:
- Time/Scope Constraints:
- Environment Constraints:
- Compatibility Requirements:

## 4.1 Phase Supplementary Constraints

- This section only records implementation constraints, technical preferences, local limitations, verification requirements added around original requirement.
- These contents narrow implementation plan, cannot reverse overwrite `2.1 Original Requirement Anchor`.
- Current Phase Added Constraints:
- Constraint Source Phase:
- Belongs to Project Long-term Rules: `yes | no | pending`
- If not long-term rules, prohibited from writing to project skill: `yes`

## 4.2 User Inquiry Plan

- Current Phase Pending Interaction Type: `provide | confirm | choose | approve | correct | not_applicable`
- Current Inquiry Method: `text_reply | choice_ui | not_applicable`
- This Round Inquiry Goal:
- Suggested Prompt:
- If choice question, candidate style: `Number | Letter | Short Tag | not_applicable`
- Is Stage 1 First Round Minimal Inquiry: `yes | no`
- Is New Session First Round Only Question: `yes | no`
- Is Hard Gate: `yes | no`
- If not hard gate, allow user reply `continue/skip/not_provide`: `yes | no | not_applicable`
- Must End Current Round After Inquiry Wait for User Input: `yes`

## 5. User Provided Materials

- Below fields only record user explicitly answered content; if user hasn't answered, leave blank or mark `pending`, cannot be self-filled by AI.
- Material provide fields unified use: `provided | not_provided | skipped | pending | not_applicable`.
- Decision fields unified use: `yes | no | skipped | pending | not_applicable`.
- Gate judgment: Only `pending` blocks; `not_provided`, `skipped`, `no` don't block flow, but need record risk and subsequent branches.
- Project skills status: `provided | not_provided | pending`
- Project skills location:
- Project documentation status: `provided | not_provided | pending`
- Project documentation location:
- UI framework skills status: `provided | not_provided | pending`
- UI framework skills location:
- UI framework documentation status: `provided | not_provided | pending`
- UI framework documentation location:
- Assist initialization when no frontend project: `yes | no | skipped | pending`
- Initialization underlying framework:
- Initialization underlying framework version:
- Initialization language framework:
- Initialization language framework version:
- Initialization language:
- Initialization UI library:
- Initialization UI library version:
- Process as latest version if version blank: `yes | no`

## 6. Info to Supplement

- [ ] Exists must-be-user-answered but still `pending` input
- [ ] Missing interface documentation
- [ ] Missing design spec
- [ ] Missing error info or reproduction path
- [ ] Missing test/build commands
- [ ] User explicitly `not_provided/skipped` materials (only record risk, don't block)
- [ ] Missing project skills or project documentation (only block when status `pending`)
- [ ] Missing UI framework skills or UI framework documentation (only block when status `pending`)
- [ ] Missing initialization underlying framework, language framework, language or UI library selection
- [ ] Other:

## 7. Phase Decisions

- Enter project scan: `yes | no | pending`
- Enter requirement analysis: `yes | no | pending`
- Need long task: `yes | no | pending`
- Next step:

## 7.1 Context Consistency Check

- Stage 1 mistakenly wrote single-task constraints to project skill: `yes | no | pending`
- Stage 2 still uses original requirement as main goal: `yes | no | pending`
- Current phase added content belongs to: `Original Requirement Correction | Implementation Constraint Supplement | Project Long-term Rules | pending`
- If deviation found, fallback phase:

## 8. Pause Rules

- If `4.2 User Inquiry Plan` has pending inquiry, this round must stop at inquiry, wait for user input.
- Cannot treat command approval, tool approval, shell confirm as user answer to business questions.
- Before receiving user explicit answer, cannot continue enter subsequent Stage, execute commands, modify files or land default plan.
- Only when current phase actually needs user confirmation, supplement materials or make choice, record "Approved to Enter Next Phase" as `yes | no | pending`.
- If user supplements, corrects or expands request in current phase, must stay in current phase, first merge request and echo latest conclusion; prompt should dynamically generate based on reply type:
  - User provides materials: Use "I have received and absorbed your provided materials" style wording
  - User supplements/corrects request: Use "I have merged your just-supplemented request" style wording
  - User not provide/skip: Use "I have recorded you temporarily not providing that material" style wording
  - User only confirms: Use "I have recorded your confirmation" style wording
  - Above type endings should all include "If no problem, you can reply continue; if still need supplement or modification, can also tell me directly"
- Except Stage 0, each confirmation point should record "Fallback target when current step negated"; Stage 0 fixed as `stay_current`.
- "Enter next step" user reply must be pure pass-through statement; if reply contains any new requirement, correction, limitation or supplement info, cannot mark as approved to enter next phase.
- Stage 0 only responsible for request reception and Stage 1 entry judgment; in this phase cannot proactively ask implementation scope, interface fields, interaction details, validation rules, restoration standards or change boundaries.
- Stage 0 completion user-side output default should be brief text prompt, like "Initializing..." or "Initialization complete, continuing to next step."; not directly show internal status fields.
- Stage 1 first round only allowed to handle project baseline ambiguity: ask which to choose when multiple frontend projects, ask whether to initialize when no frontend project identified; if already identified unique existing frontend project, don't extra ask for formal confirmation.
- All phases needing user confirmation, user-side output default uses "brief summary + can continue/can supplement/can modify" format, not show internal phase field list, also not only give "reply continue" one instruction.
- If still in new session first round and Stage 1 project baseline has ambiguity, this round can only issue one question, cannot simultaneously ask page details, interaction scope, data source, restoration standards or other Stage 2 info.
- If question needs user to supplement documentation, skills, paths, screenshot descriptions, interface descriptions or component constraints, inquiry method must be `text_reply`, only use plain text reply guide, don't make as selector.
- Even for branch decisions, default prioritize use text list items direct ask; candidates can use numbers, letters or short tags, and explicitly tell user: can reply corresponding tag, can also directly input own thoughts or plan; only use `choice_ui` when host environment mandatory requires.
- If user already gave custom UI library name, don't proactively ask install address or local path; if no version given default process as latest version, only go back to ask source or path when subsequent installation or validation fails.
- Default not every Stage requires user confirmation; only when current conclusion needs user confirmation, still missing necessary materials before formal development, or verification results need user explicit pass-through, treat current round as pause point.