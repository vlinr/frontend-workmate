# Frontend Verification

## Outputs

- `templates/verification/verification-report.md` under Current Skill Directory

## Workflow

1. **Stage 5 completion automatically enters this phase**, no need to ask user whether to start verification
2. **First scan skill list for available skills**, then based on actual conditions recommend invocation:
   - Check if project skill `fw-project-develop` exists in Skill Directory
   - If exists, recommend invoking to get verification constraints (routing, permission, build rules, regression paths etc.)
   - Constraints obtained after invocation as verification reference standard
3. Execute functional validation against the agreed scope
3. Run lint, type, build, and available test commands when the project provides them
4. Check route, permission, OEM, alias, and regression-sensitive paths when they are relevant
5. **Skill Recommend Invocation (Execute when conditions met, dynamic read)**:
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
   - **Project skill reference**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md` get verification constraints
- **Changes involve pages, components, forms, keyboard interactions, focus flow, user interaction experience** → Recommend dynamically concatenate `{static_config_dir}/skills/fw-accessibility/SKILL.md`
- **Changes involve layout, styles, spacing, interaction presentation, UI consistency** → Recommend dynamically concatenate `{static_config_dir}/skills/fw-web-design-guidelines/SKILL.md`
   - Prohibited from forcibly invoking when trigger conditions not met
6. Mark unrelated verification domains as `not_applicable`
7. **After verification execution completes, output verification results to user**: modified files, validation results, and remaining risks
8. If validation passes, **wait for user confirmation**; only after user confirmation can enter Stage 7
9. If validation fails, route back to implementation → **automatically enter Stage 6** → re-verify
10. If the user review rejects the result or asks for adjustment, route back to implementation and re-verify after changes
11. If lint/type/build/test fails because of environment blockers such as Node version, missing runtime capability, missing dependency, or unavailable host command, do not mark verification as passed and do not offer Stage 7; instead output exact environment repair steps and route back to Stage 5 for retry after repair

## Rules

- **Stage 5 completion automatically enters Stage 6**, cannot in Stage 5 output "please confirm if function is correct" or ask "whether to enter verification"
- Only Stage 6 **verification execution complete and output results**, then wait for user confirmation
- Treat functional correctness, lint/type/build, and key regression paths as the default baseline
- Treat accessibility, performance, security, or visual regression as conditional checks based on task needs and project capability
- Do not mark delivery ready if critical failures remain unresolved
- Do not mark delivery ready if the user has not confirmed the Stage 6 verification result
- Do not treat environment-blocked validation as a pass-with-risk summary; environment blockers are still blocking failures
- After verification passes, must first output verification summary to user and wait for confirmation; only after user confirmation enter Stage 7
- If user points out still need modification issues, fallback to Stage 5 → **automatically enter Stage 6** → re-verify and wait for confirmation, loop until user confirms pass