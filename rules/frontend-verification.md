# Frontend Verification

## Outputs

- 【当前技能目录】下的 `templates/verification/verification-report.md`

## Workflow

1. **Stage 5 完成后自动进入本阶段**，无需询问用户是否开始验证
2. **先扫描技能列表是否有可用技能**，然后根据实际条件建议调用：
   - 检查【技能目录】中是否存在项目技能 `fw-project-develop`
   - 若存在，建议调用获取验证约束（路由、权限、构建规则、回归路径等）
   - 调用后获取的约束作为验证的参考标准
3. Execute functional validation against the agreed scope
3. Run lint, type, build, and available test commands when the project provides them
4. Check route, permission, OEM, alias, and regression-sensitive paths when they are relevant
5. **技能建议调用（满足条件时建议执行，动态读取）**：
   - **先读取配置文件** `{project_ide_dir}/.fw-session-config.json`，获取三核心目录
   - **项目技能引用**：`{project_ide_dir}/skills/fw-project-develop/SKILL.md` 获取验证约束
- **改动涉及页面、组件、表单、键盘交互、焦点流、用户交互体验** → 调用技能 `fw-accessibility`（优先查找 `{static_config_dir}/skills/`，若未找到则调用 `find-skills` 查找）
- **改动涉及布局、样式、间距、交互呈现、UI 一致性** → 调用技能 `fw-web-design-guidelines`（优先查找 `{static_config_dir}/skills/`）
   - 禁止在不满足触发条件时强行调用
6. Mark unrelated verification domains as `not_applicable`
7. **验证执行完成后，向用户输出验证结果**：modified files, validation results, and remaining risks
8. If validation passes, **等待用户确认**；only after user confirmation can enter Stage 7
9. If validation fails, route back to implementation → **自动进入 Stage 6** → 再次验证
10. If the user review rejects the result or asks for adjustment, route back to implementation and re-verify after changes
11. If lint/type/build/test fails because of environment blockers such as Node version, missing runtime capability, missing dependency, or unavailable host command, do not mark verification as passed and do not offer Stage 7; instead output exact environment repair steps and route back to Stage 5 for retry after repair

## Rules

- **Stage 5 完成后自动进入 Stage 6**，不得在 Stage 5 输出"请确认功能是否正确"或询问"是否进入验证"
- 只有 Stage 6 **验证执行完成并输出结果后**，才等待用户确认
- Treat functional correctness, lint/type/build, and key regression paths as the default baseline
- Treat accessibility, performance, security, or visual regression as conditional checks based on task needs and project capability
- Do not mark delivery ready if critical failures remain unresolved
- Do not mark delivery ready if the user has not confirmed the Stage 6 verification result
- Do not treat environment-blocked validation as a pass-with-risk summary; environment blockers are still blocking failures
- 验证通过后，必须先向用户输出验证摘要并等待确认；只有用户确认后才进入 Stage 7
- 若用户指出仍需修改的问题，回退到 Stage 5 → **自动进入 Stage 6** → 再次验证并等待确认，循环直到用户确认通过