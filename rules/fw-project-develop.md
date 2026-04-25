# frontend-workmate Toolkit Maintenance Documentation

> Note: Current file is retained in Current Skill Directory as maintenance copy; here describes project skill artifact `fw-project-develop`, project skill is generated or refreshed by Stage 1 (Project Scan).

## Directory Concept Description

Project skill storage location is detailed in `SKILL.md` under "Directory Concept Mapping". Project skill `fw-project-develop` is stored in Skill Directory (at the same level as Current Skill Directory), not in Working Directory or Code Change Directory.

## Project Positioning

- This repository is not a business frontend application, but a "frontend development workflow toolkit".
- Main goal is consolidating reusable frontend development orchestration skills, project scan skills, requirement analysis templates, execution templates, verification templates and directory documentation standards.
- Subsequent modifications around this repository, prioritize treating as "orchestration protocol, templates, skill library" level maintenance, not page business development.

## Directory Routing

| Development Object | Priority Directory | Description |
| --- | --- | --- |
| Master orchestration entry | `SKILL.md` | Current Skill Directory's master orchestration protocol |
| Common templates | `templates/` | Place requirement, project, analysis, task, verification, documentation templates |
| Shared public skills | Public skill pack | After Stage 0 initialization, can directly invoke public capabilities by skill name |
| Workflow rule documents | `rules/frontend-orchestrator`, `rules/project-scan-profile`, `rules/frontend-change-scope`, `rules/frontend-implementation`, `rules/frontend-verification`, `rules/directory-doc-sync` | Main workflow each phase rules |
| Project-level skills | `fw-project-develop` | Project skill artifact, generated or refreshed by Stage 1 |
| Task resume records | `temp/task-runs/` | Temporary records only created when long task or checkpoint resume |
| Directory doc template | `templates/docs/directory-readme-template.md` | Directory documentation generation template |

## Current Development Constraints

- Root-level `SKILL.md` is actually executable orchestration protocol, subsequent should continue polishing around it.
- Stage 0 if `scripts/init-skills.js` exists, should first organize skills under `skills/curated/`, `skills/external/` in Static Config Directory into directly callable public skill pack (copy to Static Skill Directory), then enter formal phase scan.
- Stage 1 should first check whether project skill `fw-project-develop` already exists; only when suitable candidate cannot be found, then generate or refresh that artifact.
- If user provides project skills, project documentation, UI framework skills or UI framework documentation, should prioritize absorbing and archiving, then decide whether to continue internal generation.
- If Working Directory is blank project or frontend engineering doesn't exist, Stage 1 needs first to confirm whether to assist initialization; when user replies "exit" or "end", workflow terminates; when user replies "skip" or empty reply, use default plan to continue initialization.
- All info requiring user to provide must wait for user to explicitly answer; cannot have AI directly assume and execute initialization, selection or skill generation.
- After Stage 1 generates or refreshes project skill, needs to show user project structure, underlying framework, language framework, language, UI library and key constraints, and wait for confirmation; if user corrects, then stay in Stage 1 to continue fixing.
- After Stage 2 forms task type, modification scope, risks and skill route, needs first to let user confirm whether analysis conclusion is correct; if user supplements, then continue staying in analysis loop to merge corrections.
- If only completed project initialization or dependency installation, but project skill hasn't formed or Stage 2 confirmation hasn't completed, still must not enter development.
- If installed is private/self-developed UI library, and component rules still unclear, needs first to get "provide documentation/skills/description" or "explicitly not provide" conclusion, then enter development.
- Stage 5 before formal execution, responsible for absorbing prerequisite materials by task type: `feature` default confirm, `bug` only confirm when involves interface, integration, permission, design or third-party library, `refactor` default can skip.
- Stage 5 dependent public skills prioritize invoking by config file path: **First read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md`, `{static_config_dir}/skills/fw-task-plan-checkpoint/SKILL.md`, `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md`.
- After Stage 6 internal verification output, should first wait for user confirmation; after user confirmation then enter Stage 7 and Stage 8, if user raises questions then fallback to fix.
- All paths uniformly use relative paths within Current Skill Directory.
- If some logic currently doesn't exist, must mark `not_applicable`, cannot fabricate information for completeness.
- Current phase doesn't retain `skills/external/` extension skill layer.
- Historical sample directories don't belong to main workflow dependency, directory documentation uniformly based on `templates/docs/directory-readme-template.md` and `rules/directory-doc-sync.md`.

## Development Priority

- When modifying root-level orchestration protocol, prioritize syncing `rules/frontend-orchestrator.md` and related phase rules.
- When modifying Stage 1 logic, prioritize syncing `rules/project-scan-profile.md`, `templates/project/` and `fw-project-develop` artifact conventions.
- When modifying phase artifact contract, prioritize syncing corresponding `templates/` files.
- When modifying delivery rules or resume rules, prioritize syncing `fw-task-plan-checkpoint` and `temp/task-runs/` conventions.

## Regression Focus

- Whether root-level `SKILL.md` and phase rules are consistent.
- Whether Stage 1 reflects "first check existing project skill candidates in Skill Directory, then decide whether to scan and standardize archive".
- Whether Stage 1 reflects "first absorb user provided materials, then handle blank initialization, then decide whether internal scan and generation".
- Whether Stage 1 project skill conclusion added explicit user confirmation loop.
- Whether Stage 2 scope analysis conclusion added explicit user confirmation loop.
- Whether Stage 5 pre-execution material supplement triggers by task type, not default full inquiry.
- Whether Stage 6 reflects "after internal verification pass still needs user review" gate.
- Whether all "user provided" fields have explicit wait gate, not being automatically filled by AI.
- Whether template contract and orchestration protocol are consistent.
- Whether version number in task record and actual changes are consistent.

## Skill Validity and Refresh Conditions

- Current skill covered project boundary: `frontend-workmate` root-level orchestration protocol, template directories, skill directories, project skill discovery rules and task record conventions.
- Directly reusable conditions: Root-level workflow phases haven't undergone structural adjustment, main directory responsibilities under `templates/` and `skills/` haven't significantly changed, project skill discovery and standardize archive mechanism still holds.
- Must refresh signals: Added or removed critical phase skills, template contract significantly changed, project skill discovery order changed, blank initialization branch changed, UI framework skill access rules changed, master orchestration protocol adjusted Stage meaning, user confirmation loop or skill invocation rules.
- When refreshing prioritize checking directories or config: `SKILL.md`, `templates/`, `scripts/init-skills.js`, rule documents under `rules/` directory and `fw-project-develop`.