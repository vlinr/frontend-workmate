---
name: frontend-implementation
description: Implement frontend changes according to task type, project playbook, and capability matrix. Use when users ask to fix a frontend bug, build a frontend feature, refactor frontend code, request interface-doc-aware implementation, or execute a prepared frontend plan with optional skill and MCP coordination.
---

# Frontend Implementation

## Preconditions

- The fixed project skill name is available
- Change scope is aligned
- Development inputs have reached a stable conclusion before formal implementation begins: `provided`, `not_provided`, `skipped`, or `not_applicable`
- If any of the above is false, stop immediately and route back to Stage 1 or Stage 2; do not start implementation
- If the project uses a private/custom UI library and its component rules or docs decision is still unresolved, stop immediately and route back to Stage 2
- Do not start formal implementation in Stage 5 unless Stage 2 scope has been confirmed and any required execution inputs have reached a stable conclusion

## Workflow

1. Verify again before implementation that the fixed project skill name exists, Stage 2 scope is user-confirmed, and any private/custom UI library input has reached a stable conclusion
2. Read the fixed project skill before implementation and treat its routing, permission, API, state, style, i18n, and build rules as hard constraints
3. If not, stop and return to Stage 1 or Stage 2 instead of implementing
4. Start Stage 5 with an execution-input check based on task type and dependency analysis
5. `feature`: ask for interface docs, Swagger, OpenAPI, mock data, design draft, 联调信息, or third-party docs when relevant
6. `bug`: ask for external docs only when the agreed scope shows the issue depends on interface, 联调, permission, design, or third-party behavior
7. `refactor`: default to proceed without extra external docs unless the scope explicitly introduces such dependencies
8. If the user skips requested inputs, continue with repository evidence and mark the risk
9. Choose execution strategy by task type:
   - `bug`: call `systematic-debugging` first, then isolate root cause
   - `feature`: prioritize project conventions and call React-related skills when the stack requires them
   - `refactor`: preserve behavior first unless the user explicitly allows behavior changes
10. If the task involves complex type constraints, call `typescript-advanced-types`
11. If the task is React-oriented, call `react-best-practices` or `react-components` when relevant
12. Use the capability matrix to decide which skills or MCP-backed abilities should be invoked
13. Execute skills in the order confirmed during scope analysis; if Stage 2 already marked a skill as required, do not skip it
14. If a critical dependency is missing, call `find-skills` and output an explicit install list
15. After implementation, automatically hand off to Stage 6 verification; do not stop only to ask whether verification should start

## Rules

- Follow project-specific routing, permission, OEM, alias, i18n, and build constraints from the fixed project skill
- Do not invent optional logic that is marked `not_applicable`
- Treat mock generation as a fallback, not a default replacement for missing interface docs
- Update the long-task state when the implementation spans multiple steps
- 若本阶段发现需要用户补充资料、确认实现分支、授权接受风险或纠正理解，必须先向用户发起对应提问，或明确说明当前需要补充的内容，并在该次回复结束后等待用户输入；不得在同一回复中继续实现、修改文件或执行命令
- `Stage 5` 的资料确认不再作为独立 `Stage 4` 存在，而是本阶段正式实现前的子步骤
- 若需要用户补充接口文档、设计稿、组件说明、三方库资料或技能文件，必须使用普通文本回复引导用户补充内容，不要做成选择器式交互
- 若用户已经给出自定义 UI 库名称，则默认先按该名称继续；未给版本时按最新版处理，不预先追问安装地址、本地路径或来源
- 仅当后续依赖安装、导入解析或构建校验实际失败，且证据表明问题来自包名、版本或来源不可解析时，才回头请用户修正依赖来源或路径
- 若依赖安装已经成功，但发现该 UI 库是私有/自研组件库且组件规则不清晰，不能直接开始页面研发；必须先回到 Stage 2，确认是否需要用户提供文档、skills 或关键组件说明
- 不得绕过 Stage 2 的用户确认直接开始实现；“项目创建成功”“依赖安装成功”都不构成研发许可
- Stage 5 完成后，必须直接进入 Stage 6 做代码验证；对用户的汇报应放到验证与交付汇总中，而不是把“是否进入验证”做成额外确认点
- If local run/lint/type/build/test is blocked by environment problems, do not report Stage 5 as finished; instead output the exact environment fix steps and remain in Stage 5
