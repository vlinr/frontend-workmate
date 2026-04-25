# Frontend Workflow Entry

## Entry Description

- Root-level `SKILL.md` defines the master orchestration protocol
- This file is the workflow entry agent, responsible for mapping master protocol to each phase's rules
- **After each phase execution completes, must explicitly output phase completion conclusion**, format: `[Phase Name] Completed. Conclusion: xxx. Proceeding to next phase: [Next Phase Name].`
- Phase names: Initialization, Project Scan, Scope Analysis, Execution Plan, Material Supply, Implementation, Verification, Documentation Sync, Delivery.

## Core Chain

1. When Stage 0 starts, if Current Skill Directory contains `scripts/init-skills.js`, must first actively execute that script, before continuing any subsequent initialization actions; if not actually executed this round, Stage 0 cannot be treated as complete. Script executes improved logic: check skill version changes and update, validate config path correctness, check rules template changes, preserve state file task data; ensure users always use latest version skills and rules
2. Before each phase formally executes, first scan current available skill sources: user-provided skills/docs, project skill `fw-project-develop`, archived skills in project, other reusable public skill packs
3. If already matched suitable skill, prioritize invoking and execute according to its constraints; don't first run phase nakedly then go back to supplement skills
4. Align with `templates/intake/request-brief.md`
5. Stage 0 only handles environment initialization, file reception, state initialization and Stage 1 entry decision, doesn't generate implementation question list; before entering Stage 1, cannot proactively ask implementation scope, interface fields, validation rules, interaction details or restoration standards
6. When Stage 0 completes, user-side default only outputs brief text, like "Initializing..." or "Initialization complete, continuing to next step."; cannot directly expose internal fields like `current_stage`, `entry_conditions`, `completion_conditions` to user
7. New session first round default only allows one blocking question; but if already identified unique existing frontend project, directly enter Stage 1 scan, no extra inquiry "whether to continue existing project"
8. Stage 1 first round project baseline judgment rules:
   - Unique existing frontend project: Directly lock and enter scan/generate project skill
   - Multiple frontend projects: First round only allowed proactively asking question is "Which frontend project to continue based on this time"
   - No frontend project identified: First round only allowed proactively asking question is "Whether to initialize frontend project"
9. Only after user enters "initialization" branch, next round ask initialization combination, express by "underlying framework + language framework + language + UI library"; cannot incorrectly pull "unique existing project" back to initialization branch
10. **Stage 1 Initialize Project Branch Flow**:
    - Ask initialization combination → **Wait for user response**
    - Execute initialization command → **Scan new project structure** → **Generate project skill fw-project-develop**
    - Output project skill summary → **Wait for user confirmation**
    - User confirms → **Enter Stage 2**
    - Note: Stage 0's "initialization" only responsible for executing init-skills.js, doesn't generate project skill
11. Refer to `rules/project-scan-profile.md`
12. Stage 1 completion condition is "Already generated or refreshed project skill `fw-project-develop`, or already matched stable reusable project skill"
13. Before Stage 2, Stage 5, Stage 6 start, **must first invoke project skill `fw-project-develop`**, get project constraints
14. After Stage 1 completes, report project baseline and project skill conclusion to user, and confirm if conclusion is correct; before user confirmation, cannot enter Stage 2
15. Refer to `rules/frontend-change-scope.md`
16. After Stage 2 forms task type, modification scope, risks and skill route, only need user to confirm "my understanding is correct"; after user supplements must first merge analysis then continue confirmation, before confirmation cannot enter Stage 3 or Stage 4
17. If already installed or identified custom/private UI library, Stage 2 must also first judge whether need to ask user about component library documentation, skills or key component rules; before getting "provide / not provide / skip" clear response, cannot enter development
18. If task is longer or complex, execute `task-plan-checkpoint`
19. Stage 3 only stops when execution plan itself needs user to verify breakdown, priority or risk; otherwise can directly enter Stage 4 (confirm materials before execution)
20. Stage 4 confirms interface, permission, design, integration etc. prerequisite materials by task type: `feature` default confirm, `bug` only confirm when involves external dependency, `refactor` default can skip
21. If Stage 2 already confirmed task type and skill route, Stage 5 must invoke corresponding skills based on actual conditions:
- `bug` task → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md`
- React tech stack (marked in project skill) → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-best-practices/SKILL.md` (only applicable to React)
- React tech stack and involves component development → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-react-components/SKILL.md` (only applicable to React)
- Complex type issues → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-typescript-advanced-types/SKILL.md`
    - Prohibited from skipping skill invocation using "Stage 2 didn't specify" as reason
    - Prohibited from invoking React skills under non-React tech stack
22. After Stage 4 user has clearly "provided / not provided / skipped" materials, directly enter Stage 5 formal implementation; no extra inquiry whether to continue
23. Refer to `rules/frontend-implementation.md`
24. Stage 5 only when code implementation complete and no unresolved runtime/lint/type/build/test blocking, allows automatic entry to Stage 6; if environment issues exist, must first stay in Stage 5 and output fix suggestions to user
25. Refer to `rules/frontend-verification.md`, and invoke verification skills based on code changes:
- Changes involve pages/components/forms/keyboard interactions/focus flow → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-accessibility/SKILL.md`
- Changes involve layout/styles/spacing/UI consistency → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-web-design-guidelines/SKILL.md`
    - Prohibited from skipping skill invocation using "time urgent" as reason
26. After Stage 6 outputs verification results, must wait for user confirmation whether to continue; if verification fails, environment blocks or user requests adjustment, return to Stage 5; only after user confirmation enter Stage 7
27. Refer to `rules/directory-doc-sync.md`, and generate or update directory documentation per actual changed directories
28. After Stage 7 completes directly enter Stage 8, no extra wait for user confirmation
29. Aggregate delivery results, and write back task status in long task mode

## Query Gates

- Whenever current phase lacks user input, must first judge interaction type: `provide`, `confirm`, `choose`, `approve`, `correct`
- When asking user, prompt must match current intent: missing materials use "please provide", proofreading conclusion use "please confirm", branch decision use "you can reply 1/2/3, A/B/C, or directly tell me your choice/thoughts", risk acceptance use "if accept please reply continue", correction use "if have issues please point out directly"
- Before asking user, also need to judge inquiry method:
  - When need user to supplement documentation, skills, paths, screenshot descriptions, interface descriptions, component constraints etc., use plain text reply guidance, don't use selector
  - Only very few host environment mandatory limited branch decisions, use choice-style interaction; default still use text list items, allow user to reply numbers, letters, short tags, or directly describe their thoughts
- Stage 1 first round inquiry only triggers when "multiple project ambiguity" or "no frontend project needs initialization"; unique existing frontend project doesn't additionally ask for formal confirmation
- New session first round if still staying in Stage 1, cannot mix Stage 0 missing details or Stage 2 scope questions
- Stage 1 and initialization branch default use "directly ask user" text method, don't default popup clickable options
- Default not every Stage confirms; only when current conclusion needs user confirmation, still missing necessary materials before formal development, or verification results need user explicit approval then stop
- "Explicitly agree to enter next step" minimum judgment standard: User reply must be pure approval statement, semantically doesn't contain any new requirements, corrections, constraints, paths, pages, files, interfaces, interactions, validations, styles, copy, behaviors or implementation direction info
- If same user reply simultaneously contains "continue" and any new info, prioritize treat as "supplement/correction request", still stay in current phase
- If user supplements, corrects or expands requests at phase confirmation point, must stay in current phase, first merge requests and update current phase conclusion; cannot treat such reply as "agree to enter next step"
- After merging requests, prompt must dynamically generate based on user reply type:
  - User provides materials: `I have received and absorbed your provided materials. Above is current phase's latest conclusion; if still have deviation or supplement, you can tell me directly.`
  - User supplements/corrects requests: `I have merged your just-supplemented request. Above is current phase's latest conclusion; if still have deviation or supplement, you can tell me directly.`
  - User explicitly not provide/skip: `I have recorded you temporarily not providing that material. Above is current phase's latest conclusion; if still have deviation or supplement, you can tell me directly.`
  - User only confirms: `I have recorded your confirmation.` followed by current phase's needed next action; cannot mistakenly write as "already merged materials"
- Only explicit confirmation points need simultaneously clarify two things: when user supplements requests where to stay, when user negates result where to fallback
- `Stage 0` is temporary debugging preparation step, only has stay and continue, no extra fallback target
- User-side default doesn't show phase internal field list; only shows current step's brief summary, key conclusion, and "can continue/can supplement/can modify" prompt
- Confirmation prompt cannot just write "reply continue"; must simultaneously allow user to supplement or modify current step conclusion
- **Explicit Confirmation Point's Standard Prompt** (must use):
  > "If you have other modifications needed, please tell me; of course if no other modifications, you can directly reply 'continue', I will enter next step."
- This prompt applies to: Project Scan confirmation, Scope Analysis confirmation, Verification confirmation
- Prohibited from omitting "If you have other modifications needed, please tell me" part
- Prohibited from appending prompt after final step (Delivery completed)
- Once inquiry or explanation issued, current reply must end and wait for user input; cannot in same reply continue analysis, invoke downstream skills, modify files, execute commands or initialize project
- Command approval, tool confirmation, terminal interaction prompt, cannot treat as user's explicit answer to business questions

## Phase Switch Rules

- Before each preparation to enter new phase, must first explicitly write clear:
  - `current_stage`
  - `current_stage_status`
  - `next_stage`
  - `stage_block_reason`
- Before each phase ends, must also explicitly give that phase's minimum checkpoint artifact, not allowed to only internally complete analysis then silently switch phase
- If current phase still not complete, don't just write "continue next step", but explicitly stay in current phase.
- Only when current phase status is `completed`, can switch to next phase.
- If current phase status is `waiting_user` or `blocked`, must stop in current phase, cannot because project already created, dependencies already installed or code editable then automatically proceed.

## Task ID Carriage Mechanism

**User only inputs requirements, Task ID auto-carried via AI output**

### Task ID Carriage Methods

| Carriage Source | Description |
| --- | --- |
| Context reference | User referenced previous AI output (first line contains `Task ID: task_xxxxxxxx`) |
| IDE auto-carriage | IDE session management auto-carries previous output's Task ID |
| No carriage | First input in new session, no Task ID context |

### Judgment Logic (Step 1)

**After receiving user input, first check Task ID carriage status**:
| Carriage Status | Next Action |
| --- | --- |
| Task ID carried | → Read state file → Find corresponding task → Continue |
| **No Task ID carriage** | → **Create new task** (first input in new session) |

**Important**:
- User will not manually input Task ID, only inputs requirement content
- Task ID carried via AI output first line, subsequent dialogue auto-transmits via reference/context
- "No Task ID carriage" detected = first input in new session = create new task

### Step 2 Branches

**Branch A (Task ID carried)**:
- Read state file → Find `<!-- TASK_{TASK_ID}_START -->`
- Continue that task

**Branch B (No Task ID carriage)**:
- Generate new Task ID
- Read state file → Add new task block
- Start from Stage 0
- **First line output carries Task ID** `[Phase Name] Task ID: task_xxx`

### Example Flow

**First input in new session**:
```
User: "add user management module" (no Task ID carriage)
AI: Step 1 check → No carriage → Create new task task_abc123 → Stage 0
AI output first line: "[Initialization] Task ID: task_abc123"
```

**Continue existing session**:
```
User: "continue, need to modify this" (Task ID carried from previous round)
AI: Step 1 check → Carriage task_abc123 → Continue task_abc123
```

### Prohibited Behavior

- **Prohibited**: Read state file active tasks before checking Task ID carriage
- **Prohibited**: Assume user wants to continue existing task (must first check Task ID carriage)
- **Prohibited**: Associate unrelated new request with active task in state file

## Failure Fallback

- If project skill missing, naming chaotic or cannot match, return to project scan phase and generate standardized project skill.
- If Stage 1 only completed initialization or dependency installation, but hasn't generated project skill, still treat as staying in Stage 1.
- If phase progression depends on user input but user hasn't explicitly answered, must stay in current phase waiting, cannot self-assume continue execution.
- If current round already asked user, then current round cannot continue proceeding to next Stage.
- If Stage 2 cannot give stable task scope and skill route, cannot enter development, need return to scope analysis.
- If custom/private UI library's documentation, skills or key component rules haven't formed "provide / not provide / skip" clear conclusion, cannot enter development, need stay in Stage 2.
- If some critical skill unavailable, output unstable or conflicts with project constraints, first return to Stage 2 re-plan, then decide whether use `find-skills` or manual downgrade plan.
- If verification phase critical gate fails, must return to development phase, cannot skip enter documentation or delivery.

## Rules

- Treat this file as workflow entry agent, not as independent general specification
- Phase gates, loop circuits, fallback logic all based on root-level `SKILL.md`
- Only use repository relative paths
- Non-existent optional logic uniformly mark as `not_applicable`