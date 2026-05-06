# Frontend Change Scope

## Outputs

- Regardless of task complexity, a minimum Stage 2 pass output must always be formed.
- By default, at least update the stage fields and scope conclusions in `templates/analysis/change-scope.md` under the [Current Skills Directory]; for complex tasks, additionally supplement `templates/analysis/capability-matrix.md`.

## Workflow

0. Uniformly determine the status of "user-provided" inputs: `provided`, `not_provided`, `skipped`, `pending`, `not_applicable`; only `pending` blocks stage advancement
1. Before formally starting Stage 2, must first read the original requirement anchor, user's original description, and screenshot/attachment summary saved from Stage 0, to confirm the actual goal, target, and expected result of the current task
2. Then scan the currently available skill sources: user-provided materials, project skill, project-specific skills, and other reusable public skill packages
3. **First scan the skill list for available skills**, then recommend invocation based on actual conditions:
   - Check whether the project skill `fw-project-develop` exists in the [Skills Directory]
   - If it exists, recommend invoking it to obtain project constraints (structure, technology stack, routing, permissions, etc.)
   - Constraints obtained after invocation serve as reference for scope analysis
4. If the [Code Change Directory] is missing documentation or implementation relationships are unclear:
   - **First read the config file** `{project_ide_dir}/.fw-session-config.json` to obtain the three core directories
   - Invoke skill `fw-code-analysis-doc` (prioritize searching in `{static_config_dir}/skills/`; if not found, invoke `find-skills` to locate it)
5. First confirm the UI framework currently used by the project, distinguishing between a general UI framework and a custom UI framework
6. For a general UI framework, record the framework name, version, main entry point, replacement boundaries, and usage constraints
7. For a custom UI framework, prioritize reading the UI framework skill already generated or absorbed in Stage 1; if it does not exist, roll back to Stage 1 to first ask the user for framework documentation or framework skills; this round of questions belongs to `provide`, and must use plain text replies to guide the user, ending the current round immediately after asking
8. If the current installation was successful, source code is visible, or import evidence indicates a private/custom UI library is used, but key component rules, import constraints, or style boundaries are still unclear, must first ask the user whether to provide component library documentation, skills, or key component descriptions
9. If the user has not yet given a clear answer about framework documentation / skills / component rule descriptions (`pending`), stay in this stage and wait — do not continue scope analysis
10. Record "original requirement", "constraints added in this stage", and "long-term project rules" separately; constraints added in this stage can only affect implementation boundaries, file scope, risks, and validation — they must not rewrite the original requirement
11. As long as any of "original requirement anchor", "user's original description", or "screenshot/attachment summary" is non-empty, it is prohibited to ask the user again "what to do / what the functional goal is / what to implement this time"; only missing scope details may be asked based on the existing main requirement
12. Determine task type: `bug`, `feature`, or `refactor`
13. Fill the change scope with modified modules, risk points, and regression range
14. Fill the capability matrix with only task-relevant capability domains
15. Clearly identify the skills **that may need to be invoked** in subsequent stages (for reference only; actual invocation is determined conditionally by each stage, dynamically read):
   - **First read the config file** `{project_ide_dir}/.fw-session-config.json` to obtain the three core directories
   - **Project skill**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md`
- `bug` task → recommend planning skill `fw-systematic-debugging` (actually invoked in Stage 5, prioritize `{static_config_dir}/skills/`)
- React technology stack (marked in project skill) → recommend planning skill `fw-react-best-practices` (only for React, actually invoked in Stage 5)
- React technology stack with component development → recommend planning skill `fw-react-components` (only for React, actually invoked in Stage 5)
- Complex type issues → recommend planning skill `fw-typescript-advanced-types` (actually invoked in Stage 5)
- Page/component changes → recommend planning skill `fw-accessibility` (actually invoked in Stage 6)
- Style/UI changes → recommend planning skill `fw-web-design-guidelines` (actually invoked in Stage 6)
16. Form skill route recommendations for the current task, and output a clear analysis conclusion of "what to do / why / what not to do for now / what evidence is still missing"
17. Stage 2 defaults to completing the analysis internally first, then presenting a brief scope summary, key risks, skill route, and next steps direction to the user; do not push the analysis responsibility back to the user, and do not show internal stage fields verbatim
18. Stage 2 makes only one core confirmation with the user: `is my understanding correct`; if the user supplements, corrects, or rejects, must stay in this stage, first determine whether the new content is a "correction to the original requirement" or a "supplement to implementation constraints", then merge with the existing analysis and re-display the new analysis conclusion for continued confirmation; must not default to rewriting the new constraint as a new main requirement; must not advance to Stage 3 or Stage 5
19. When re-displaying results, the prompt must match the type of user reply in the current round:
   - User supplements/corrects scope: `I have merged the requirement you just supplemented. The above is the latest conclusion of the current scope analysis; if there are still discrepancies or additions, please let me know directly.`
   - User explicitly does not provide materials or skips: `I have noted that you are not providing this material for now. The above is the latest conclusion of the current scope analysis; if there are still discrepancies or additions, please let me know directly.`
   - User only confirms: `I have noted your confirmation.` followed by the next action prompt; do not write it as "requirement merged"
20. Mark irrelevant capability domains as `not_applicable`
21. If a critical skill or MCP is missing, call `find-skills` and output install requirements

## Rules

- Prefer existing directory documentation before broad code exploration
- The original user goal from Stage 0 is the primary anchor; stage-specific constraints must not overwrite it
- If the original request text or screenshot summary already makes the main goal clear, asking again "what to build" is a protocol violation
- If the fixed project skill name is missing or clearly stale, route back to the project scan stage first
- If UI framework information is missing, stale, or contradictory, route back to the project scan stage first
- Do not invent user-provided framework docs, framework skills, or initialization choices
- As long as the user has already explicitly answered `not_provided` or `skipped`, proceed according to the rules — do not mistakenly judge it as "must supplement materials before advancing"
- Material-type supplementary questions should guide the user to reply via plain text, file references, or path supplementation — do not implement as selector-style interactions
- If the fixed project skill name's corresponding skill has not been generated or refreshed, this stage must not be treated as executable
- If Stage 1 project skill contains temporary implementation approaches, local preferences, or page-level constraints for the current single task, strip these out first, then continue scope analysis
- If the component rules of a private/custom UI library are still unclear, this stage must not output a "can proceed to development" conclusion
- If the minimum pass output for this stage has not been formed, must not switch to Stage 3 or Stage 5
- This stage must wait for the user to confirm whether the analysis conclusion is correct; but the confirmation content only revolves around the analysis conclusion itself, without additionally displaying "enter Stage 2 / proceed to next step" type of stage prompts
- As long as this stage has already asked the user a question in the current round, the current round must stop — scope convergence, skill planning, or entering development must not continue
- Do not start coding until scope and risk are aligned
- Separate `available`, `encapsulatable`, `missing`, and `not_applicable`
- If external docs or interface definitions are required, flag them as development inputs for the next stage
