# Frontend Change Scope

## Outputs

- 无论任务复杂度如何，都必须形成最小 Stage 2 过站产物。
- 默认至少更新【当前技能目录】下的 `templates/analysis/change-scope.md` 中的阶段字段与范围结论；复杂任务再补充 `templates/analysis/capability-matrix.md`。

## Workflow

0. 对"由用户提供"的输入统一判定状态：`provided`、`not_provided`、`skipped`、`pending`、`not_applicable`；仅 `pending` 阻塞阶段推进
1. 正式开始 Stage 2 前，必须先读取 Stage 0 保留的最初需求锚点、用户原始描述与截图/附件摘要，确认本次任务真正要解决的目标、对象与期望结果
2. 再扫描当前可用技能来源：用户提供资料、项目技能、项目内专项 skill、其他可复用公共技能包
3. **先扫描技能列表是否有可用技能**，然后根据实际条件建议调用：
   - 检查【技能目录】中是否存在项目技能 `fw-project-develop`
   - 若存在，建议调用获取项目约束（结构、技术栈、路由、权限等）
   - 调用后获取的约束作为范围分析参考
4. 若【代码改动目录】缺少说明文档或实现关系不清晰，调用 `code-analysis-doc`
5. 优先确认项目当前使用的 UI 框架，并区分通用 UI 框架与自研 UI 框架
6. 若是通用 UI 框架，记录框架名、版本、主入口、替代边界与使用约束
7. 若是自研 UI 框架，优先读取 Stage 1 已生成或吸收的 UI 框架 skill；若不存在，则回退 Stage 1 先向用户询问框架文档或框架 skills；该轮问题属于 `provide`，且必须使用普通文本回复引导，发问后立即结束当前回合
8. 若当前安装成功、源码可见或导入证据表明使用的是私有/自研 UI 库，但关键组件规则、导入约束或样式边界仍不清晰，则必须先向用户询问是否提供组件库文档、skills 或关键组件说明
9. 若当前仍缺少用户对框架文档 / skills / 组件规则说明的明确回答（`pending`），停留在本阶段等待，不继续范围分析
10. 把"最初需求""本阶段新增约束""项目长期规则"分开记录；其中本阶段新增约束只能影响实现边界、文件范围、风险与验证，不得改写最初需求
11. 只要"最初需求锚点"或"用户原始描述"或"截图/附件摘要"任一非空，就禁止再向用户追问"要做什么 / 功能目标是什么 / 这次要实现什么"；此时只能在已有主需求基础上追问缺失的范围细节
12. Determine task type: `bug`, `feature`, or `refactor`
13. Fill the change scope with modified modules, risk points, and regression range
14. Fill the capability matrix with only task-relevant capability domains
15. 明确后续**可能需要调用**的技能（仅供参考，实际调用由各阶段根据条件判定）：
    - `bug` 任务 → 建议规划 `systematic-debugging`（Stage 5 实际调用）
    - React 技术栈（项目技能中标记） → 建议规划 `react-best-practices`（仅适用于 React，Stage 5 实际调用）
    - React 技术栈且涉及组件开发 → 建议规划 `react-components`（仅适用于 React，Stage 5 实际调用）
    - 复杂类型问题 → 建议规划 `typescript-advanced-types`（Stage 5 实际调用）
    - 页面/组件改动 → 建议规划 `accessibility`（Stage 6 实际调用）
    - 样式/UI 改动 → 建议规划 `web-design-guidelines`（Stage 6 实际调用）
16. 形成当前任务的技能路线建议，并输出"要做什么 / 为什么这样做 / 暂不做什么 / 还缺什么证据"的清晰分析结论
17. Stage 2 默认先内部完成分析，再向用户展示简短范围摘要、关键风险、技能路线与下一步方向；不要反向把分析责任推给用户，也不要原样展示内部阶段字段
18. Stage 2 对用户只做一个核心确认：`我的理解是否正确`；若用户补充、纠正或拒绝，则必须留在本阶段，先判断新增内容属于"最初需求修正"还是"实现约束补充"，再与现有分析对比合并，回显新的分析结论继续确认；不得默认把新增约束改写成新的主需求；不得推进到 Stage 3 或 Stage 5
19. 回显结果时，提示语必须匹配用户本轮回复类型：
   - 用户补充/修正范围：`我已合并你刚补充的诉求。以上是当前范围分析的最新结论；如果还有偏差或补充，请直接告诉我。`
   - 用户明确不提供资料或跳过：`我已记录你暂不提供该资料。以上是当前范围分析的最新结论；如果还有偏差或补充，请直接告诉我。`
   - 用户仅确认：`我已记录你的确认。` 后接下一步动作提示；不要写成"已合并诉求"
20. Mark irrelevant capability domains as `not_applicable`
21. If a critical skill or MCP is missing, call `find-skills` and output install requirements

## Rules

- Prefer existing directory documentation before broad code exploration
- The original user goal from Stage 0 is the primary anchor; stage-specific constraints must not overwrite it
- If the original request text or screenshot summary already makes the main goal clear, asking again "what to build" is a protocol violation
- If the fixed project skill name is missing or clearly stale, route back to the project scan stage first
- If UI framework information is missing, stale, or contradictory, route back to the project scan stage first
- Do not invent user-provided framework docs, framework skills, or initialization choices
- 只要用户已明确回答为 `not_provided` 或 `skipped`，即可按规则继续，不得误判为"必须补齐资料"后才可推进
- 资料型补充问题应让用户通过文本回复、文件引用或路径补充，不要实现成选择器式交互
- 若固定项目技能名对应技能未生成、未刷新，本阶段不得视为可执行
- 若 Stage 1 项目技能中混入了当前单次任务的临时实现方案、局部偏好或页面级约束，应先剥离这些内容，再继续范围分析
- 若私有/自研 UI 库的组件规则仍不清晰，本阶段不得输出"可直接研发"的结论
- 若本阶段尚未形成最小过站产物，不得切换到 Stage 3 或 Stage 5
- 本阶段必须等待用户确认分析结论是否正确；但确认内容只围绕分析结论本身，不再额外展示"进入 Stage 2 / 进入下一步"这类阶段提示
- 只要本阶段已经向用户发起提问，本回合就必须停止，不能继续范围收敛、技能规划或进入研发
- Do not start coding until scope and risk are aligned
- Separate `已具备`, `可封装`, `缺失`, and `not_applicable`
- If external docs or interface definitions are required, flag them as development inputs for the next stage