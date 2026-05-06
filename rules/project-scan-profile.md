# Project Scan Profile

## Directory Concept Description

For the project skill storage location, see the "Directory Concept Mapping Table" in `SKILL.md`. The project skill `fw-project-develop` is stored in the [Skills Directory] (at the same level as the [Current Skills Directory]), not in the [Work Directory] or the [Code Change Directory].

## Outputs

- Primary output: the project skill output corresponding to the frontend project under the [Work Directory]; the current default output name is fixed as `fw-project-develop`
- Project-level UI framework skill generated or refreshed as needed
- If creation or standardized archiving is needed, generate the standard project skill output `fw-project-develop`
- If skills need to be consolidated for a custom UI framework, generate the corresponding UI skill output
- `templates/project/project-architecture-profile.md`, `templates/project/project-dev-playbook.md`, `templates/project/project-skill-template.md` under the [Current Skills Directory] are only used as scan scaffolding
- `templates/project/project-ui-skill-template.md` under the [Current Skills Directory] is only used as UI framework skill generation scaffolding

## Workflow

0. Uniformly determine the status of "user-provided" inputs: `provided`, `not_provided`, `skipped`, `pending`, `not_applicable`; only `pending` blocks stage advancement
1. First check existing project skill candidates under the [Skills Directory], directory structure, and frontend entry points to identify the number and candidate frontend projects under the [Work Directory]
2. Divide Stage 1 first round into three situations:
   - One existing frontend project identified: directly lock that project, do not additionally confirm with the user "whether to continue based on the existing project"
   - Multiple frontend projects identified: the first round only asks one `choose` question around "which frontend project to continue with this time"
   - No frontend project identified: the first round only asks one `confirm` or `choose` question around "whether to initialize a frontend project"
3. In a new session's first round if still in this stage, only the above single project baseline question is allowed in this round; if the unique frontend project has been automatically locked, can proceed directly to scanning and skill generation in this round — must not change to asking "whether to continue with the existing project"
4. If the user has not yet explicitly answered "multi-project selection" or "whether to initialize" (`pending`), stay in this stage and wait — do not continue with initialization branches or ask follow-up questions
5. After locking the frontend project under the [Work Directory], prioritize checking by fixed skill name whether there is a reusable project skill; currently defaults to checking `fw-project-develop` first
6. If project skills already exist, first inform the user "existing project skills detected, I will check whether an update is needed"; after checking, present the update results to the user for review; if the user supplements content, continue merging into the skills
7. If no reusable candidate exists, this stage must pause first and ask the user whether they are willing to provide existing project skills, project documentation, or other materials that can be consolidated as project skills; this round of questions belongs to `provide`; default prompt: `You may directly reply with the content you want to provide, and I will prioritize using your materials to generate the project skill; if you don't provide anything, I will continue analyzing and generating based on the [Work Directory] content.`
8. If the user directly provides project skills, archive them as a standard project skill output according to `templates/project/project-skill-template.md` under the [Current Skills Directory], and use the fixed skill name `fw-project-develop` as the highest-priority project skill source; if a skill with the same name already exists, execute merge/refresh
9. If the user provides project documentation, prioritize generating or refreshing the fixed project skill name `fw-project-develop` based on the documentation
10. Only when the user explicitly indicates they will not provide project skills / project documentation (`not_provided`), then follow the discovery rules defined in the root-level `SKILL.md` to continue with internal scanning and generate the first version of `fw-project-develop`
11. Only stable project knowledge may be written into `fw-project-develop`, such as directory structure, technology stack, build approach, routing patterns, UI framework, and long-term constraints; the temporary goals, style approaches, implementation preferences, or page-level fixes of the current single task must not be written into the project skill output
12. If existing candidate skills still match the current project structure and constraints, reuse those project skills, and check whether there is incremental content that needs updating
13. If the user chooses to initialize, ask for the initialization combination in the second round; when recommending or recording, express using the four-layer structure "underlying framework + language framework + language + UI library"
14. Initialization questions must cover at minimum: underlying framework, underlying framework version, language framework, language framework version (if applicable), language, UI library, UI library version (if applicable); default to plain text direct questions, can list candidate options and allow users to reply with numbers, letters, short labels, or directly describe their own ideas; end the current round immediately after asking
15. If the user's answer to the initialization combination is incomplete, continue staying in this stage and waiting — must not initialize on their own before it is complete
16. If the user replies "exit" or "end", terminate the flow and stop generating project skills
17. If the user replies "skip" or direct empty reply, use the default setup (React + TypeScript + Ant Design) to continue initialization

---

### Initialization Project Branch Flow

17. **After successful initialization, must not treat "project created/dependencies installed" as Stage 1 complete**
18. **After successful initialization, must scan the new project structure**:
    - Extract directory structure, entry files, build commands, technology stack, UI library
    - Must not skip scanning
19. **After scanning is complete, must generate project skill fw-project-develop**
20. **After generation is complete, must output project skill summary and wait for user confirmation**
21. **After user confirmation, can enter Stage 2**

23. If a custom UI framework/design system is identified and only the library name is known, first record that name; if no version is provided, default to treating it as the latest version — do not preemptively ask for installation address, local path, or private repository source
21. If subsequent installation, import, or source code evidence indicates the UI library is a private/custom component library, must determine whether its component rules are clear before entering development; if unclear, first ask the user whether to provide component library documentation, skills, or key component descriptions
22. Only if subsequent dependency installation, import validation, or build verification confirms that the UI library name/version cannot be resolved, go back and ask the user to correct the source, path, or package information
23. If subsequent analysis truly depends on additional component rules, ask the user whether to supplement framework skills or framework documentation; this question belongs to `provide`, must use plain text replies to guide the user, end the current round immediately after asking; if the user has not yet answered (`pending`), stay in this stage and wait
24. Only after the user explicitly indicates they will not provide framework documentation / skills (`not_provided`) AND source code evidence is sufficient, may source code analysis be executed to generate the corresponding UI skill output
25. If the user provides framework skills or framework documentation, prioritize absorbing and archiving them, then decide whether to refresh
26. This stage must match an existing fixed project skill name corresponding skill, or create/refresh a standard project skill output; if the project skill has not been formed, must not leave Stage 1
27. If existing project skills are currently detected, inform the user: the project skills already exist, whether an update is needed, what was updated, and whether the user needs to provide supplementary content to merge into the skills
28. If the project skills were created based on user-provided materials, inform the user: project skills have been created according to the provided content, and ask the user to check whether further supplementation is needed
29. If the project skills were generated from internal scanning after the user did not provide materials, inform the user: skills have been generated based on [Work Directory] evidence, and ask the user to check whether supplementary content needs to be added
30. If the user believes Stage 1 output is inaccurate, or supplements new project constraints, directories, entry points, or technology stack information, must first determine whether this content is "stable project knowledge" or "current single-task constraints"; only stable project knowledge may be merged into `fw-project-develop`
31. After merging and refreshing, display the latest project baseline summary to the user, and choose the prompt based on the user's reply type in the current round:
   - User provided project skills / project documentation / project constraints: `I have received and absorbed the materials you provided, and the current project skills have been updated. The above is the latest result of the current project baseline; if there are still discrepancies or additions, you can let me know directly.`
   - User explicitly does not provide materials: `I have noted that you are not providing this material for now, and the current project skills have been updated based on [Work Directory] evidence. The above is the latest result of the current project baseline; if there are still discrepancies or additions, you can let me know directly.`
   - User only confirms or requests to proceed to the next step: `I have noted your confirmation.` followed by the next action prompt for the current stage; do not mistakenly write it as "materials merged"
32. If the user has not explicitly agreed to enter Stage 2, continue staying in this stage
33. Only after the project skill has been formed AND the user has explicitly agreed to enter Stage 2 can Stage 1 be left
34. When creating or refreshing the project skill, only retain necessary change descriptions — do not create extra long-term fields
35. For each optional logic domain, first determine whether it exists; if it does not exist, mark `not_applicable`
36. If the current flow is missing critical reusable skills, invoke `find-skills`

## Rules

- Only retain stable project knowledge that can guide subsequent development — do not write one-time task conclusions
- If what the user supplements in Stage 1 is implementation preferences, local style approaches, or temporary fixes for the current single task, mark them as current task constraints — must not write them into the project skill output
- If there are multiple frontend sub-projects in the [Work Directory], generate or refresh the corresponding project skill for each; only ask the user which one to choose when there is ambiguity about the frontend project for the current task
- The project skill is the final output of Stage 1 — template analysis is only a generation process
- The project skill should clearly record reusable boundaries and refresh signals
- Project skill directory names should be stable and predictable, consistent with the frontend project root directory or stable business identifier under the [Work Directory]
- If the user provides external skills or documentation, record the source, absorption time, and refresh conditions to prevent subsequent skill staleness
- Custom UI framework skills should prioritize consolidating stable component rules, directory entry points, constraints, and version/source, rather than copying the entire source code analysis process
- For any information marked as "user-provided", must wait for the user's explicit answer; only `pending` blocks, `not_provided`/`skipped` can continue; cannot substitute user choices with default values
- The first round of questions must only converge on true ambiguous project baselines like "multi-project selection" or "whether to initialize" — must not ask one extra step in scenarios where a unique existing project is identified
- Framework-related descriptions need to distinguish four layers: underlying framework, language framework, language, UI library; avoid using one "framework" to refer simultaneously to Vite, React, TypeScript, and Ant Design
- Material-type inputs must all use plain text replies to guide users to supplement — must not be implemented as "whether to provide documentation/skills" selector questions; only truly finite branching decisions are allowed to use selector-style interactions
- Even for branching decisions, default to plain text direct questions; can list numbers, letters, or short label options, letting users reply with corresponding marks via text, or directly describe their choices and ideas — do not default to relying on clickable options
- If the custom UI library name is known, default to continuing; treat missing versions as latest version — do not preemptively ask for installation address, local path, or source
- If after successful installation the UI library turns out to be a private/custom component library with unclear component rules, must get a "provide docs/skills/description" or "explicitly not providing" conclusion in Stage 1 or Stage 2
- After initialization, even newly created projects must have a project skill generated — cannot skip project skill consolidation just because it is a new project
- In scenarios with a single existing frontend project, prioritize directly scanning and generating/refreshing the project skill, rather than first confirming with the user "whether to continue with the existing project"; after completion, only user confirmation of whether the project baseline is correct is needed
- Only when actual installation, import, or build failure occurs later should the user be asked to correct dependency sources or paths
- As long as this stage has already asked the user a question in the current round, the current round must stop — cannot continue with deep scanning, skill generation, project initialization, or executing any commands
- If route permissions, button permissions, OEM, alias, build rewrites, and other logic exist, record the evidence
- Prioritize extracting project-level reusable rules, rather than copying sample project expressions
