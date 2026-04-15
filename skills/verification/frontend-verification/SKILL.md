---
name: frontend-verification
description: Verify frontend changes before delivery through functional checks, lint/type/build validation, and task-relevant regression gates. Use when users ask to test frontend changes, validate a fix or feature, check regression impact, or decide whether frontend work can move to documentation and final delivery.
---

# Frontend Verification

## Outputs

- `../../../templates/verification/verification-report.md`

## Workflow

1. Execute functional validation against the agreed scope
2. Run lint, type, build, and available test commands when the project provides them
3. Check route, permission, OEM, alias, and regression-sensitive paths when they are relevant
4. If the change touches pages, components, forms, keyboard interaction, focus flow, or any user-facing experience, call `accessibility`
5. If the change touches layout, style, spacing, interaction presentation, or UI consistency, call `web-design-guidelines`
6. Mark unrelated verification domains as `not_applicable`
7. If validation passes, summarize modified files, validation results, and remaining risks for user review and Stage 7 handoff
8. If validation fails, route back to implementation with a clear failure list
9. If the user review rejects the result or asks for adjustment, route back to implementation and re-verify after changes
10. If lint/type/build/test fails because of environment blockers such as Node version, missing runtime capability, missing dependency, or unavailable host command, do not mark verification as passed and do not offer Stage 7; instead output exact environment repair steps and route back to Stage 5 for retry after repair

## Rules

- Treat functional correctness, lint/type/build, and key regression paths as the default baseline
- Treat accessibility, performance, security, or visual regression as conditional checks based on task needs and project capability
- Do not mark delivery ready if critical failures remain unresolved
- Do not mark delivery ready if the user has not confirmed the Stage 6 verification result
- Do not treat environment-blocked validation as a pass-with-risk summary; environment blockers are still blocking failures
- 本阶段验证通过后，必须先向用户输出验证摘要并等待确认；只有用户确认后才进入 Stage 7。若用户指出仍需修改的问题，回退到 Stage 5
