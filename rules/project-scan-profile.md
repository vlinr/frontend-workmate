# Project Scan Profile

## Directory Concept Description

Project skill storage location is detailed in `SKILL.md` under "Directory Concept Mapping". Project skill `fw-project-develop` is stored in Skill Directory (at the same level as Current Skill Directory), not in Working Directory or Code Change Directory.

## Outputs

- Main artifact: Project skill artifact corresponding to frontend project under Working Directory; current default artifact name is fixed as `fw-project-develop`
- As-needed generated or refreshed project-level UI framework skill
- If need to newly create or standardize archive, then generate standard project skill artifact `fw-project-develop`
- If need to consolidate skills for self-developed UI framework, then generate corresponding UI skill artifact
- `templates/project/project-architecture-profile.md`, `templates/project/project-dev-playbook.md`, `templates/project/project-skill-template.md` under Current Skill Directory only serve as scan scaffolding
- `templates/project/project-ui-skill-template.md` under Current Skill Directory only serves as UI framework skill generation scaffolding

## Workflow

0. For "user-provided" inputs, uniformly judge status: `provided`, `not_provided`, `skipped`, `pending`, `not_applicable`; only `pending` blocks phase progression
1. First check existing project skill candidates, directory structure and frontend entry in Skill Directory, identify frontend project count and candidate frontend projects under Working Directory
2. Split Stage 1 first round into three scenarios:
   - Identified unique existing frontend project: Directly lock that project, don't additionally ask user to confirm "whether to continue based on existing project"
   - Identified multiple frontend projects: First round only initiate one `choose` question around "which frontend project to continue based on this time"
   - No frontend project identified: First round only initiate one `confirm` or `choose` question around "whether to initialize frontend project"
3. New session first round if still staying in this phase, then this round only allowed to issue above sole project baseline question; if already auto-locked unique frontend project, then this round can directly enter scan and skill generation, must not change to ask "whether to continue existing project"
4. If user hasn't explicitly answered "multiple project selection" or "whether to initialize" (pending), stay in this phase waiting, don't continue initialization branch or ask subsequent materials
5. After locking frontend project under Working Directory, prioritize checking by fixed skill name whether reusable project skill exists; current default prioritize checking `fw-project-develop`
6. If project skills already exist, first explain to user "already detected existing project skills, I will check whether need update"; after check completes, hand update results to user for checking, if user supplements content then continue merging to that skills
7. If no reusable candidate exists, then this phase must first stop, ask user whether willing to provide existing project skills, project documentation or other materials that can be consolidated as project skills; that round question belongs to `provide`; default prompt use: `You can directly reply provided content, I will prioritize using your provided materials to generate project skills; if you don't provide, I will continue analyzing based on Working Directory content and generate.`
8. If user directly provides project skills, then archive as standard project skill artifact per `templates/project/project-skill-template.md` under Current Skill Directory, and use fixed skill name `fw-project-develop` as highest priority project skill source; if project skills with same name already exist, then execute merge/refresh
9. If user provides project documentation, then prioritize generating or refreshing fixed project skill name `fw-project-develop` based on documentation
10. If user explicitly states not providing project skills / project documentation (not_provided), then continue internal scan and generate initial `fw-project-develop` per discovery rules defined in root-level `SKILL.md`
11. Only allowed to write stable project knowledge into `fw-project-develop`, such as directory structure, tech stack, build method, routing mode, UI framework, long-term constraints; must not write current single task's temporary goals, style plans, implementation preferences, page-level approaches into project skill artifact
12. If existing candidate skill still matches current project structure and constraints, then reuse that project skills, and check whether content needing incremental update exists
13. If user chooses initialization, then second round ask initialization combination; when recommending or recording, express per "underlying framework + language framework + language + UI library" four-layer structure
14. Initialization inquiry must at least cover: underlying framework, underlying framework version, language framework, language framework version (if applicable), language, UI library, UI library version (if applicable); default use plain text to ask directly, can list candidate plans and allow user to reply numbers, letters, short tags, or directly describe their thoughts; after asking immediately end current round
15. If user's reply to initialization combination is incomplete, then continue staying in this phase waiting, must not self-initialize before completing
16. If user replies "exit" or "end", then terminate workflow, no longer continue generating project skill
17. If user replies "skip" or directly empty reply, then use default plan (React + TypeScript + Ant Design) to continue initialization

---

### Initialize Project Branch Flow

17. **After initialization success, must not treat "project created/dependencies installed" as Stage 1 complete**
18. **After initialization success, must scan new project structure**:
    - Extract directory structure, entry files, build commands, tech stack, UI library
    - Must not skip scan
19. **After scan completes, must generate project skill fw-project-develop**
20. **After generation completes, must output project skill summary and wait for user confirmation**
21. **After user confirmation, can then enter Stage 2**

23. If identified self-developed UI framework/design system, and only library name is known, then first record that name; if version not provided, default process per latest version, don't pre-ask install address, local path or private repository source
21. If subsequent installation, import or source code evidence indicates that UI library is private/self-developed component library, then before entering development must judge whether its component rules are clear; if unclear, first ask user whether to provide component library documentation, skills or key component descriptions
22. Only when subsequent dependency installation, import verification or build validation confirms that UI library name/version cannot be resolved, then ask user to correct source, path or package info
23. If subsequent analysis indeed depends on extra component rules, then ask user whether to supplement framework skills or framework documentation; that question belongs to `provide`, must use plain text reply guide, after asking immediately end current round; if user hasn't answered (pending), stay in this phase waiting
24. Only after user explicitly states not providing framework documentation / skills (not_provided), and source code evidence is sufficient, can execute source code analysis to generate corresponding UI skill artifact
25. If user provides framework skills or framework documentation, then prioritize absorbing and archiving, then decide whether to refresh
26. This phase must hit skill corresponding to existing fixed project skill name, or create/refresh standard project skill artifact; if project skill hasn't formed, must not leave Stage 1
27. If currently detected project skills already exist, then explain to user: existing project skills, whether need update, already updated what, whether still need user to provide supplement content to merge into skills
28. If currently project skills created based on user provided materials, then explain to user: already created internal project skills per provided content, and ask user to check whether need to continue supplementing
29. If currently project skills generated by internal scan after user didn't provide materials, then explain to user: already generated skills based on Working Directory evidence, and ask user to check whether need to supplement content to continue refining
30. If user thinks Stage 1 artifact is inaccurate, or supplemented new project constraints, directory, entry, tech stack info, must first judge whether these contents are "stable project knowledge" or "current single task constraints"; only stable project knowledge is allowed to merge into `fw-project-develop`
31. After merging and refreshing, echo latest project baseline summary to user, and choose prompt based on user this round reply type:
    - User provided project skills / project documentation / project constraints: `I have received and absorbed your provided materials, current project skills already updated. Above is current project baseline's latest result; if still have deviation or supplement, you can tell me directly.`
    - User explicitly not providing materials: `I have recorded you temporarily not providing that material, current project skills already updated per Working Directory evidence. Above is current project baseline's latest result; if still have deviation or supplement, you can tell me directly.`
    - User only confirms or only requests to enter next step: `I have recorded your confirmation.` followed by current phase's needed next action prompt; must not mistakenly write as "already merged materials"
32. If user hasn't explicitly agreed to enter Stage 2, also continue staying in this phase
33. Only after project skill has formed and user has explicitly agreed to enter Stage 2, can leave Stage 1
34. If creating or refreshing project skill, only retain necessary change explanation, don't additionally create long-term fields
35. For each optional logic domain, first judge whether exists; when not existing, mark `not_applicable`
36. If identified current workflow lacks critical reusable skills, call `find-skills`

## Rules

- Only retain stable project knowledge that can guide subsequent development, don't write one-time task conclusions
- If user in Stage 1 supplements current single task's implementation preferences, partial style plans or temporary approaches, should mark as current task constraints, must not write into project skill artifact
- If multiple frontend sub-projects exist under Working Directory, should separately generate or refresh corresponding project skills; only when this frontend project has ambiguity, ask user which to choose
- Project skill is Stage 1's final artifact, template analysis is only generation process
- Project skill should clearly record reusable boundary and refresh signals
- Project skill directory naming should be stable, predictable, and consistent with frontend project root directory or stable business identifier under Working Directory
- If user provides external skills or documentation, should record source, absorption time and refresh conditions, prevent subsequent skill outdated
- Self-developed UI framework skill should prioritize consolidating stable component rules, directory entry, constraints and version/source, not copying entire source code analysis process
- All info marked as "user provided" must wait for user to explicitly answer; only pending blocks, not_provided/skipped can continue; cannot use default values to replace user choice
- First round inquiry must only converge "multiple project selection" or "whether to initialize" this kind of truly ambiguous project baseline, must not additionally ask one more step under unique existing project scenario
- "Framework" related descriptions need to distinguish four layers: underlying framework, language framework, language, UI library; avoid using one "framework" to simultaneously refer to Vite, React, TypeScript, Ant Design
- Material-type inputs uniformly use plain text reply to guide user supplementing, must not make into "whether provide documentation/skills" selector question; only truly finite branch decisions allow using choice-style interaction
- Even for branch decision, also default use text to ask directly; can list numbers, letters or short tag plans, let user through text reply corresponding marker, or directly describe choice and thoughts, don't default rely on clickable options
- If custom UI library name is known, then default can continue; version missing process per latest version, don't pre-ask install address, local path or source
- If that UI library after installation success appears as private/self-developed component library, and component rules unclear, then must in Stage 1 or Stage 2 first get "provide documentation/skills/description" or "explicitly not provide" conclusion
- After initialization, initial project also must generate project skill, cannot because being newly created project skip project skill consolidation
- Single existing frontend project scenario, prioritize directly scanning and generating/refreshing project skill, not first asking user to confirm "whether to continue existing project"; after completion only need user to confirm whether project baseline is correct
- Only when subsequent real installation, import or build failure, then ask user to correct dependency source or path
- As long as this phase has already initiated question to user, this round must stop, cannot continue deep scan, generate skills, initialize project or execute any commands
- If routing permission, button permission, OEM, alias, build rewrite etc. logic exists, should record evidence
- Prioritize extracting project-level reusable rules, not copying sample project expressions