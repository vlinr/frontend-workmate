# Frontend Change Scope

## Outputs

- Regardless of task complexity, must form minimum Stage 2 checkpoint artifact.
- Default at least update phase fields and scope conclusion in `templates/analysis/change-scope.md` under Current Skill Directory; complex tasks additionally supplement `templates/analysis/capability-matrix.md`.

## Workflow

0. For "user-provided" inputs, uniformly judge status: `provided`, `not_provided`, `skipped`, `pending`, `not_applicable`; only `pending` blocks phase progression
1. Before formally starting Stage 2, must first read Stage 0 preserved original requirement anchor, user original description and screenshot/attachment summary, confirm this task's truly target to solve, object and expected result
2. Then scan current available skill sources: user-provided materials, project skill, project-specific skills, other reusable public skill packs
3. **First scan skill list for available skills**, then based on actual conditions recommend invocation:
   - Check if project skill `fw-project-develop` exists in Skill Directory
   - If exists, recommend invoking to get project constraints (structure, tech stack, routing, permission etc.)
   - Constraints obtained after invocation as scope analysis reference
4. If code change directory lacks documentation or implementation relationships unclear:
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
   - Dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md`
5. Prioritize confirming project's currently used UI framework, and distinguish common UI framework vs self-developed UI framework
6. If common UI framework, record framework name, version, main entry, replacement boundary and usage constraints
7. If self-developed UI framework, prioritize reading Stage 1 already generated or absorbed UI framework skill; if doesn't exist, fallback Stage 1 first ask user for framework documentation or framework skills; that round question belongs to `provide`, and must use plain text reply guidance, after asking immediately end current round
8. If current installation successful, source code visible or import evidence indicates using private/self-developed UI library, but key component rules, import constraints or style boundaries still unclear, must first ask user whether to provide component library documentation, skills or key component descriptions
9. If still missing user's clear answer for framework documentation/skills/component rules (pending), stay in this phase waiting, don't continue scope analysis
10. Separate record "original requirement", "this phase added constraints", "project long-term rules"; among them this phase added constraints can only affect implementation boundary, file scope, risks and verification, cannot rewrite original requirement
11. As long as "original requirement anchor" or "user original description" or "screenshot/attachment summary" any one non-empty, then prohibit asking user again "what to do/what is feature goal/what to implement this time"; at this point can only based on existing main requirement ask missing scope details
12. Determine task type: `bug`, `feature`, or `refactor`
13. Fill the change scope with modified modules, risk points, and regression range
14. Fill the capability matrix with only task-relevant capability domains
15. Clearly list skills that **may need to be invoked** subsequently (for reference only, actual invocation judged by each phase per conditions, dynamic read):
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
   - **Project skill**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md`
- `bug` task → recommend plan `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md` (Stage 5 actual invocation)
- React tech stack (marked in project skill) → recommend plan `{static_config_dir}/skills/fw-react-best-practices/SKILL.md` (only applicable to React, Stage 5 actual invocation)
- React tech stack and involves component development → recommend plan `{static_config_dir}/skills/fw-react-components/SKILL.md` (only applicable to React, Stage 5 actual invocation)
- Complex type issues → recommend plan `{static_config_dir}/skills/fw-typescript-advanced-types/SKILL.md` (Stage 5 actual invocation)
- Page/component changes → recommend plan `{static_config_dir}/skills/fw-accessibility/SKILL.md` (Stage 6 actual invocation)
- Style/UI changes → recommend plan `{static_config_dir}/skills/fw-web-design-guidelines/SKILL.md` (Stage 6 actual invocation)
16. Form current task's skill route recommendation, and output "what to do/why do this/temporarily not do/still lack what evidence" clear analysis conclusion
17. Stage 2 default first internally complete analysis, then show user brief scope summary, key risks, skill route and next direction; don't reversely push analysis responsibility to user, nor directly show internal phase fields
18. Stage 2 only does one core confirmation to user: `my understanding whether correct`; if user supplements, corrects or rejects, must stay in this phase, first judge new content belongs to "original requirement correction" or "implementation constraint supplement", then compare and merge with existing analysis, echo new analysis conclusion to continue confirming; must not default rewrite new constraints as new main requirement; must not proceed to Stage 3 or Stage 5
19. When echoing results, prompt must match user this round reply type:
   - User supplements/corrects scope: `I have merged your just-supplemented request. Above is current scope analysis's latest conclusion; if still have deviation or supplement, please tell me directly.`
   - User explicitly not provide materials or skip: `I have recorded you temporarily not providing that material. Above is current scope analysis's latest conclusion; if still have deviation or supplement, please tell me directly.`
   - User only confirms: `I have recorded your confirmation.` followed by next action prompt; don't write as "already merged request"
20. Mark irrelevant capability domains as `not_applicable`
21. If a critical skill or MCP is missing, call `find-skills` and output install requirements

## Rules

- Prefer existing directory documentation before broad code exploration
- The original user goal from Stage 0 is the primary anchor; stage-specific constraints must not overwrite it
- If the original request text or screenshot summary already makes the main goal clear, asking again "what to build" is a protocol violation
- If the fixed project skill name is missing or clearly stale, route back to the project scan stage first
- If UI framework information is missing, stale, or contradictory, route back to the project scan stage first
- Do not invent user-provided framework docs, framework skills, or initialization choices
- As long as user has explicitly answered as `not_provided` or `skipped`, can continue per rules, must not misjudge as "must supplement materials" before can proceed
- Material-type supplement questions should let user through text reply, file reference or path supplement, don't implement into selector-style interaction
- If skill corresponding to fixed project skill name not generated, not refreshed, this phase must not treat as executable
- If Stage 1 project skill mixed in current single task's temporary implementation plan, partial preference or page-level constraints, should first strip these contents, then continue scope analysis
- If private/self-developed UI library's component rules still unclear, this phase must not output "can directly develop" conclusion
- If this phase hasn't formed minimum checkpoint artifact, must not switch to Stage 3 or Stage 5
- This phase must wait for user to confirm whether analysis conclusion is correct; but confirmation content only around analysis conclusion itself, no longer additionally show "enter Stage 2/enter next step" this kind of phase prompt
- As long as this phase has already initiated question to user, this round must stop, cannot continue scope convergence, skill planning or enter development
- Do not start coding until scope and risk are aligned
- Separate `already available`, `can encapsulate`, `missing`, and `not_applicable`
- If external docs or interface definitions are required, flag them as development inputs for the next stage