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
2. **First scan skill list for available skills**, then based on actual conditions recommend invocation:
   - Check if project skill `fw-project-develop` exists in Skill Directory
   - If exists, recommend invoking to get project constraints (structure, tech stack, routing, permission, API, state, style, build rules etc.)
   - Constraints obtained after invocation as implementation reference, avoid violating existing project rules
3. If not, stop and return to Stage 1 or Stage 2 instead of implementing
4. Start Stage 5 with an execution-input check based on task type and dependency analysis
5. `feature`: ask for interface docs, Swagger, OpenAPI, mock data, design draft, integration info, or third-party docs when relevant
6. `bug`: ask for external docs only when the agreed scope shows the issue depends on interface, integration, permission, design, or third-party behavior
7. `refactor`: default to proceed without extra external docs unless the scope explicitly introduces such dependencies
8. If the user skips requested inputs, continue with repository evidence and mark the risk
9. **Skill Recommend Invocation (Execute when conditions met, dynamic read)**:
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
   - **Project skill reference**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md` get project constraints
- **`bug` task** → Recommend dynamically concatenate `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md`, find root cause before fix
- **Tech stack is React** (marked in project skill) → Recommend dynamically concatenate `{static_config_dir}/skills/fw-react-best-practices/SKILL.md` (only applicable to React tech stack)
- **Tech stack is React and involves component development or modification** → Recommend dynamically concatenate `{static_config_dir}/skills/fw-react-components/SKILL.md` (only applicable to React tech stack)
- **Involves complex type constraints or type issues** → Recommend dynamically concatenate `{static_config_dir}/skills/fw-typescript-advanced-types/SKILL.md`
   - **Discover missing critical skill** → **First read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/find-skills/SKILL.md` and output install suggestions
   - **Prohibited from invoking React skills under non-React tech stack**
   - **Prohibited from forcibly invoking when trigger conditions not met**
10. If a critical dependency is missing, call `find-skills` and output an explicit install list
11. After implementation, automatically hand off to Stage 6 verification; do not stop only to ask whether verification should start

## Rules

- Follow project-specific routing, permission, OEM, alias, i18n, and build constraints from the fixed project skill
- Do not invent optional logic that is marked `not_applicable`
- Treat mock generation as a fallback, not a default replacement for missing interface docs
- Update the long-task state when the implementation spans multiple steps
- If this phase discovers need user to supplement materials, confirm implementation branch, authorize accept risk or correct understanding, must first initiate corresponding question to user, or clearly explain current needed supplement content, and after that reply end waiting for user input; must not continue implementation, modify files or execute commands in same reply
- `Stage 5`'s material supplement no longer exists as independent `Stage 4`, but is sub-step before this phase formal implementation
- If need user to supplement interface documentation, design spec, component description, third-party library materials or skill files, must use plain text reply guide user to supplement content, don't make into selector-style interaction
- If user already gave custom UI library name, then default first continue per that name; version not given process per latest version, don't pre-ask install address, local path or source
- Only when subsequent dependency installation, import resolution or build validation actually fails, and evidence indicates problem from package name, version or source unresolvable, then ask user to correct dependency source or path
- If dependency installation already successful, but discover that UI library is private/self-developed component library and component rules unclear, cannot directly start page development; must first return to Stage 2, confirm whether need user to provide documentation, skills or key component descriptions
- Cannot bypass Stage 2's user confirmation directly start implementation; "project creation successful" "dependency installation successful" don't constitute development license
- After Stage 5 completes, must directly enter Stage 6 for code verification; user's report should be put in verification and delivery summary, not make "whether enter verification" as extra confirmation point
- If local run/lint/type/build/test is blocked by environment problems, do not report Stage 5 as finished; instead output the exact environment fix steps and remain in Stage 5