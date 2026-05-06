# Frontend Implementation

## Preconditions

- The fixed project skill name is available
- Change scope is aligned
- Development inputs have reached a stable conclusion before formal implementation begins: `provided`, `not_provided`, `skipped`, or `not_applicable`
- If any of the above is false, stop immediately and route back to Stage 1 or Stage 2; do not start implementation
- If the project uses a private/custom UI library and its component rules or docs decision is still unresolved, stop immediately and route back to Stage 2
- Do not start formal implementation in Stage 5 unless Stage 2 scope has been confirmed and any required execution inputs have reached a stable conclusion

## Workflow

1. Verify again before implementation that the fixed project skill exists, Stage 2 scope is user-confirmed, and any private/custom UI library input has reached a stable conclusion
2. **First scan the skill list for available skills**, then recommend invocation based on actual conditions:
   - Check whether the project skill `fw-project-develop` exists in the [Skills Directory]
   - If it exists, recommend invoking it to obtain project constraints (structure, technology stack, routing, permissions, API, state, styles, build rules, etc.)
   - Constraints obtained after invocation serve as implementation reference, avoiding violations of existing project rules
3. If not, stop and return to Stage 1 or Stage 2 instead of implementing
4. Start Stage 5 with an execution-input check based on task type and dependency analysis
5. `feature`: ask for interface docs, Swagger, OpenAPI, mock data, design draft, integration information, or third-party docs when relevant
6. `bug`: ask for external docs only when the agreed scope shows the issue depends on interface, integration, permission, design, or third-party behavior
7. `refactor`: default to proceed without extra external docs unless the scope explicitly introduces such dependencies
8. If the user skips requested inputs, continue with repository evidence and mark the risk
9. **Skill invocation recommendations (execute when conditions are met, dynamically read)**:
   - **First read the config file** `{project_ide_dir}/.fw-session-config.json` to obtain the three core directories
   - **Project skill reference**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md` to obtain project constraints
- **`bug` task** → invoke skill `fw-systematic-debugging` (prioritize `{static_config_dir}/skills/`; if not found, invoke `find-skills` to locate)
- **React technology stack** (marked in project skill) → invoke skill `fw-react-best-practices` (only for React, prioritize `{static_config_dir}/skills/`)
- **React technology stack with component development or modification** → invoke skill `fw-react-components` (only for React, prioritize `{static_config_dir}/skills/`)
- **Complex type constraints or type issues** → invoke skill `fw-typescript-advanced-types` (prioritize `{static_config_dir}/skills/`)
   - **Missing critical skill detected** → invoke skill `find-skills` and output install recommendations
   - **Prohibited: invoking React skills with non-React technology stacks**
   - **Prohibited: forcing invocation when trigger conditions are not met**
10. If a critical dependency is missing, call `find-skills` and output an explicit install list
11. After implementation, automatically hand off to Stage 6 verification; do not stop only to ask whether verification should start

## Rules

- Follow project-specific routing, permission, OEM, alias, i18n, and build constraints from the fixed project skill
- Do not invent optional logic that is marked `not_applicable`
- Treat mock generation as a fallback, not a default replacement for missing interface docs
- Update the long-task state when the implementation spans multiple steps
- If this stage discovers that the user needs to supplement materials, confirm implementation branches, authorize risk acceptance, or correct understanding, must first ask the user the corresponding question, or explicitly state what needs to be supplemented, and wait for user input after the reply ends; must not continue implementing, modifying files, or executing commands in the same reply
- Material supplementation in Stage 5 is no longer a separate Stage 4 but a sub-step before formal implementation in this stage
- If the user needs to supplement interface documentation, design mockups, component descriptions, third-party library materials, or skill files, must use plain text replies to guide users to supplement content — do not implement as selector-style interactions
- If the user has already provided a custom UI library name, default to continuing with that name; treat missing versions as latest version — do not preemptively ask for installation address, local path, or source
- Only if subsequent dependency installation, import resolution, or build validation actually fails, and evidence shows the problem comes from an unresolvable package name, version, or source, then go back and ask the user to correct the dependency source or path
- If the dependency installation was successful but the UI library turns out to be a private/custom component library with unclear component rules, do not start page development directly; must first return to Stage 2 to confirm whether the user needs to provide documentation, skills, or key component descriptions
- Must not bypass Stage 2 user confirmation and start implementation directly; "project created successfully" and "dependencies installed successfully" do not constitute development authorization
- After Stage 5 is complete, must proceed directly to Stage 6 for code validation; reports to the user should be placed in the validation and delivery summary, not made into an additional confirmation point for "whether to enter validation"
- If local run/lint/type/build/test is blocked by environment problems, do not report Stage 5 as finished; instead output the exact environment fix steps and remain in Stage 5
