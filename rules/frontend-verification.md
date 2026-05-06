# Frontend Verification

## Outputs

- `templates/verification/verification-report.md` under the [Current Skills Directory]

## Workflow

1. **Auto-enter this stage after Stage 5 is complete** — no need to ask the user whether to start validation
2. **First scan the skill list for available skills**, then recommend invocation based on actual conditions:
   - Check whether the project skill `fw-project-develop` exists in the [Skills Directory]
   - If it exists, recommend invoking it to obtain validation constraints (routing, permissions, build rules, regression paths, etc.)
   - Constraints obtained after invocation serve as the reference standard for validation
3. Execute functional validation against the agreed scope
4. Run lint, type, build, and available test commands when the project provides them
5. Check route, permission, OEM, alias, and regression-sensitive paths when they are relevant
6. **Skill invocation recommendations (execute when conditions are met, dynamically read)**:
   - **First read the config file** `{project_ide_dir}/.fw-session-config.json` to obtain the three core directories
   - **Project skill reference**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md` to obtain validation constraints
- **Changes involve pages, components, forms, keyboard interactions, focus flow, user interaction experience** → invoke skill `fw-accessibility` (prioritize `{static_config_dir}/skills/`; if not found, invoke `find-skills` to locate)
- **Changes involve layout, styles, spacing, interaction presentation, UI consistency** → invoke skill `fw-web-design-guidelines` (prioritize `{static_config_dir}/skills/`)
   - Prohibited: forcing invocation when trigger conditions are not met
7. Mark unrelated verification domains as `not_applicable`
8. **After validation execution is complete, output validation results to the user**: modified files, validation results, and remaining risks
9. If validation passes, **wait for user confirmation**; only after user confirmation can enter Stage 7
10. If validation fails, route back to implementation → **auto-enter Stage 6** → validate again
11. If the user review rejects the result or asks for adjustment, route back to implementation and re-verify after changes
12. If lint/type/build/test fails because of environment blockers such as Node version, missing runtime capability, missing dependency, or unavailable host command, do not mark verification as passed and do not offer Stage 7; instead output exact environment repair steps and route back to Stage 5 for retry after repair

## Rules

- **Auto-enter Stage 6 after Stage 5 is complete** — must not output "please confirm the feature is correct" or ask "whether to enter validation" in Stage 5
- Only after Stage 6 **validation execution is complete and results are output** should user confirmation be waited for
- Treat functional correctness, lint/type/build, and key regression paths as the default baseline
- Treat accessibility, performance, security, or visual regression as conditional checks based on task needs and project capability
- Do not mark delivery ready if critical failures remain unresolved
- Do not mark delivery ready if the user has not confirmed the Stage 6 verification result
- Do not treat environment-blocked validation as a pass-with-risk summary; environment blockers are still blocking failures
- After validation passes, must first output the validation summary to the user and wait for confirmation; only after user confirmation can enter Stage 7
- If the user indicates there are still issues to fix, roll back to Stage 5 → **auto-enter Stage 6** → validate again and wait for confirmation, loop until user confirms passage
