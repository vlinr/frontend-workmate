# frontend-workmate Toolkit Maintenance Documentation

> Note: The current file is kept inside the [Current Skills Directory] as a maintenance copy; what is described here is the project skill output `fw-project-develop`, which is generated or refreshed by Stage 1 (Project Scan).

## Directory Concept Description

For the project skill storage location, see the "Directory Concept Mapping Table" in `SKILL.md`. The project skill `fw-project-develop` is stored in the [Skills Directory] (at the same level as the [Current Skills Directory]), not in the [Work Directory] or the [Code Change Directory].

## Project Positioning

- This repository is not a business frontend application — it is a "frontend development workflow toolkit".
- The primary goal is to consolidate reusable frontend development orchestration skills, project scan skills, requirements analysis templates, execution templates, validation templates, and directory documentation standards.
- Subsequent modifications to this repository should be treated as maintenance at the "orchestration protocol, templates, skill library" level, not as page-level business development.

## Directory Routing

| Development Target | Priority Directory | Description |
| --- | --- | --- |
| Main orchestration entry | `SKILL.md` | The overall orchestration protocol of the [Current Skills Directory] |
| General templates | `templates/` | Store requirements, project, analysis, task, validation, and documentation templates |
| Shared public skills | Public skill packages | Public capabilities that can be directly invoked by skill name after Stage 0 initialization |
| Process rule documents | `rules/frontend-orchestrator`, `rules/project-scan-profile`, `rules/frontend-change-scope`, `rules/frontend-implementation`, `rules/frontend-verification`, `rules/directory-doc-sync` | Stage-specific rules for the main flow |
| Project-level skill | `fw-project-develop` | Project skill output, generated or refreshed by Stage 1 |
| Task resume records | `temp/task-runs/` | Temporary records created only for long tasks or checkpoint resume |
| Directory documentation template | `templates/docs/directory-readme-template.md` | Directory documentation generation template |

## Current Development Constraints

- The root-level `SKILL.md` is the actually executable orchestration protocol and should continue to be refined around it.
- If `scripts/init-skills.js` exists in Stage 0, that script should be executed first. The script uses improved logic: checks for skill version changes and updates them, verifies config path correctness, checks for rules template changes, preserves state file task data; ensures users always use the latest skill and rule versions.
- Stage 1 should first check whether the project skill `fw-project-develop` already exists; only if no suitable candidate is found should the output be generated or refreshed.
- If the user provides project skills, project documentation, UI framework skills, or UI framework documentation, these should be absorbed and archived first before deciding whether to continue with internal generation.
- If the [Work Directory] is a blank project or no frontend project exists, Stage 1 needs to confirm whether to assist with initialization; if the user replies "exit" or "end", the flow terminates; if the user replies "skip" or empty reply, use the default setup to continue initialization.
- For any information that needs to be provided by the user, must wait for the user's explicit answer; AI cannot directly assume and proceed with initialization, selection, or skill generation.
- After Stage 1 generates or refreshes the project skill, must present the project structure, underlying framework, language framework, language, UI library, and key constraints to the user and wait for confirmation; if the user corrects, stay in Stage 1 to continue refining.
- After Stage 2 forms the task type, change scope, risks, and skill route, must first let the user confirm whether the analysis conclusion is correct; if the user supplements, stay in the analysis loop to merge corrections.
- Even if project initialization or dependency installation is complete, if the project skill has not been formed or Stage 2 confirmation has not been completed, cannot enter development.
- If a private/custom UI library has been installed and component rules are still unclear, need to first get a "provide docs/skills/description" or "explicitly not providing" conclusion before entering development.
- Stage 5 is responsible for absorbing prerequisite materials by task type before formal execution: `feature` defaults to confirmation, `bug` only confirms when involving interfaces, integration, permissions, design, or third-party libraries, `refactor` defaults to skipping.
- Public skills relied on by Stage 5 are prioritized by invocation via config file path: **first read the config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md`, `{static_config_dir}/skills/fw-task-plan-checkpoint/SKILL.md`, `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md`.
- After Stage 6 internal validation outputs results, should first wait for user confirmation; after user confirmation, enter Stage 7 and Stage 8; if the user raises questions, roll back to fix.
- All paths uniformly use relative paths within the [Current Skills Directory].
- If a certain logic does not currently exist, must mark `not_applicable` — cannot add fictitious information for completeness.
- The current stage does not retain the `skills/external/` extended skill layer.
- Historical sample directories are not main flow dependencies; directory documentation is uniformly based on `templates/docs/directory-readme-template.md` and `rules/directory-doc-sync.md`.

## Development Priorities

- When modifying the root-level orchestration protocol, prioritize syncing `rules/frontend-orchestrator.md` and related stage rules.
- When modifying Stage 1 logic, prioritize syncing `rules/project-scan-profile.md`, `templates/project/`, and the output convention of `fw-project-develop`.
- When modifying stage output contracts, prioritize syncing the corresponding `templates/` files.
- When modifying delivery rules or resume rules, prioritize syncing `fw-task-plan-checkpoint` and the convention of `temp/task-runs/`.

## Regression Focus

- Whether the root-level `SKILL.md` and stage rules are consistent.
- Whether Stage 1 reflects "first check the [Skills Directory] for existing project skill candidates, then decide whether to scan and standardize archiving".
- Whether Stage 1 reflects "first absorb user-provided materials, then handle blank initialization, then decide whether to scan and generate internally".
- Whether the Stage 1 project skill conclusion has added an explicit user confirmation loop.
- Whether the Stage 2 scope analysis conclusion has added an explicit user confirmation loop.
- Whether Stage 5 prerequisite material supplementation is triggered by task type, rather than defaulting to full inquiry.
- Whether Stage 6 reflects the gate of "user review required after internal validation passes".
- Whether all "user-provided" fields have explicit waiting gates, rather than being auto-filled by AI.
- Whether template contracts and orchestration protocols are consistent.
- Whether version numbers in task records are consistent with actual changes.

## Skill Validity and Refresh Conditions

- Current skill coverage project boundaries: `frontend-workmate` root-level orchestration protocol, template directory, skills directory, project skill discovery rules, and task record conventions.
- Conditions for direct reuse: root-level flow stages have not undergone structural adjustments, primary directory responsibilities of `templates/` and `skills/` have not changed significantly, and the project skill discovery and standardized archiving mechanism is still valid.
- Signals requiring a refresh: addition or deletion of key stage skills, significant changes to template contracts, changes to project skill discovery order, changes to blank initialization branches, changes to UI framework skill integration rules, adjustments to Stage meaning in the main orchestration protocol, changes to user confirmation loops or skill invocation rules.
- Directories or configs to prioritize checking during refresh: `../SKILL.md`, `../templates/`, `../scripts/init-skills.js`, rule documents and `fw-project-develop` under `./`.
