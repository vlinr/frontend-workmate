# Request Brief Template

## 1. 基础信息

- 任务标题：
- 用户目标：
- 交付方式：`仅分析 | 修改代码 | 修改代码并补文档 | 其他`
- 优先级：`高 | 中 | 低`
- 任务类型初判：`bug | feature | refactor | pending`
- 当前阶段：`stage0_alignment | stage1_project_scan | stage2_scope | stage3_plan | stage4_inputs | stage5_implementation | stage6_verification | stage7_docs | stage8_delivery`
- 当前阶段状态：`pending | in_progress | waiting_user | completed | blocked`
- 下一阶段：`stage0_alignment | stage1_project_scan | stage2_scope | stage3_plan | stage4_inputs | stage5_implementation | stage6_verification | stage7_docs | stage8_delivery | not_applicable`
- 当前阶段目标：
- 当前阶段进入条件：
- 当前阶段完成条件：
- 阶段阻塞原因：
- 是否已获准进入下一阶段：`yes | no | pending`
- 下一阶段用户确认语句：
- 用户补充诉求后是否已合并：`yes | no | pending`
- 合并后回显提示语：
- 当前步骤被否定时回退目标：`stay_current | previous_stage | stage5_implementation | stage6_verification | stage2_scope | not_applicable`
- 以上阶段状态字段默认用于内部记录，不要求原样展示给用户；尤其在 Stage 0，不应直接输出成字段列表。

## 2. 用户原始描述

> 在这里粘贴或整理用户的原始诉求。

- 原始截图/附件摘要：
- 原始截图中已明确的页面/区域：
- 原始截图中已明确的目标或改动意图：
- 若截图已足够表达主需求，则 Stage 2 不得再次追问“要做什么”：

## 2.1 最初需求锚点

- 最初需求一句话概括：
- 最初要解决的问题：
- 最初目标对象（页面/模块/功能）：
- 最初期望结果：
- 以下内容只能在用户明确否定或重定义目标时才允许改写；普通阶段补充、技术偏好、实现约束不得覆盖本区：
  - 是否已被用户重定义：`yes | no | pending`
  - 最近一次重定义依据：

## 3. 最小必要上下文

- Stage 0 只允许被动记录本区字段；若用户未明确提供，保留空白或 `pending`，不得在 Stage 0 主动追问实现细节。
- 目标模块/页面：
- 问题现象或期望行为：
- 影响范围：
- 是否允许修改代码：`yes | no | pending`
- 是否只做方案：`yes | no | pending`

## 4. 限制条件

- 技术限制：
- 时间/范围限制：
- 环境限制：
- 兼容性要求：

## 4.1 阶段补充约束

- 本区只记录围绕最初需求新增的实现约束、技术偏好、局部限制、验证要求。
- 这些内容用于收窄实现方案，不得反向改写 `2.1 最初需求锚点`。
- 当前阶段新增约束：
- 约束来源阶段：
- 是否属于项目长期规则：`yes | no | pending`
- 若不是长期规则，禁止写入项目技能：`yes`

## 4.2 用户提问计划

- 当前阶段待发起的交互类型：`provide | confirm | choose | approve | correct | not_applicable`
- 当前提问方式：`text_reply | choice_ui | not_applicable`
- 本轮提问目标：
- 建议提示语：
- 若为选择题，候选项样式：`数字 | 字母 | 短标签 | not_applicable`
- 是否为 Stage 1 首轮最小首问：`yes | no`
- 是否为新会话首轮唯一问题：`yes | no`
- 是否为硬门禁：`yes | no`
- 若为非硬门禁，是否允许用户回复 `继续/跳过/不提供`：`yes | no | not_applicable`
- 提问后是否必须结束当前回合等待用户输入：`yes`

## 5. 用户已提供资料

- 以下字段只记录用户明确答复的内容；若用户尚未回答，保留空白或标记 `pending`，不得由 AI 自行补齐。
- 资料提供类字段统一使用：`provided | not_provided | skipped | pending | not_applicable`。
- 决策类字段统一使用：`yes | no | skipped | pending | not_applicable`。
- 门禁判定：仅 `pending` 阻塞；`not_provided`、`skipped`、`no` 不阻塞流程，但需记录风险与后续分支。
- 项目 skills 状态：`provided | not_provided | pending`
- 项目 skills 位置：
- 项目文档状态：`provided | not_provided | pending`
- 项目文档位置：
- UI 框架 skills 状态：`provided | not_provided | pending`
- UI 框架 skills 位置：
- UI 框架文档状态：`provided | not_provided | pending`
- UI 框架文档位置：
- 无前端项目时是否协助初始化：`yes | no | skipped | pending`
- 初始化底层框架：
- 初始化底层框架版本：
- 初始化语言框架：
- 初始化语言框架版本：
- 初始化语言：
- 初始化 UI 库：
- 初始化 UI 库版本：
- 版本留空是否按最新版处理：`yes | no`

## 6. 待补充信息

- [ ] 存在必须由用户回答但仍为 `pending` 的输入
- [ ] 缺少接口文档
- [ ] 缺少设计稿
- [ ] 缺少报错信息或复现路径
- [ ] 缺少测试/构建命令
- [ ] 用户已明确 `not_provided/skipped` 的资料（仅记录风险，不阻塞）
- [ ] 缺少项目 skills 或项目文档（仅当状态为 `pending` 时阻塞）
- [ ] 缺少 UI 框架 skills 或 UI 框架文档（仅当状态为 `pending` 时阻塞）
- [ ] 缺少初始化底层框架、语言框架、语言或 UI 库选择
- [ ] 其他：

## 7. 阶段决策

- 是否进入项目扫描：`yes | no | pending`
- 是否进入需求分析：`yes | no | pending`
- 是否需要长任务：`yes | no | pending`
- 下一步：

## 7.1 上下文一致性检查

- Stage 1 是否误把单次任务约束写入项目技能：`yes | no | pending`
- Stage 2 是否仍以最初需求为主目标：`yes | no | pending`
- 当前阶段补充内容属于：`最初需求修正 | 实现约束补充 | 项目长期规则 | pending`
- 若发现偏离，回退阶段：

## 8. 暂停规则

- 若 `4.1 用户提问计划` 中存在待发起问题，则本回合必须停在提问处，等待用户输入。
- 不得把命令批准、工具 approval、shell confirm 视为用户对业务问题的答复。
- 未收到用户明确答复前，不得继续进入后续 Stage、执行命令、修改文件或落地默认方案。
- 仅在当前阶段确实需要用户确认、补充资料或做选择时，才把“是否已获准进入下一阶段”记录为 `yes | no | pending`。
- 若用户在当前阶段补充、修正或扩展诉求，必须停留在当前阶段，先合并诉求并回显最新结论；提示语应根据回复类型动态生成：
  - 用户提供资料：使用“我已接收并吸收你提供的资料”类话术
  - 用户补充/修正诉求：使用“我已合并你刚补充的诉求”类话术
  - 用户不提供/跳过：使用“我已记录你暂不提供该资料”类话术
  - 用户仅确认：使用“我已记录你的确认”类话术
  - 以上类型的结尾都应包含“如果没问题，你可以回复继续；如果还要补充或修改，也可以直接告诉我”
- 除 Stage 0 外，每个确认点都应记录“当前步骤被否定时回退目标”；Stage 0 固定为 `stay_current`。
- “进入下一步”的用户答复必须是纯放行语句；若回复中夹带任何新需求、修正、限制或补充信息，则不得标记为已获准进入下一阶段。
- Stage 0 只负责诉求接收与进入 Stage 1 判定；在本阶段不得主动追问实现范围、接口字段、交互细节、校验规则、还原标准或改动边界。
- Stage 0 完成后的用户侧输出默认应为简短正文提示，例如“正在初始化...”或“初始化已完成，继续处理下一环节。”；不直接展示内部状态字段。
- Stage 1 首轮只允许处理项目基线歧义：多个前端项目时询问选哪个，未识别到前端项目时询问是否初始化；若已识别到唯一现有前端项目，则不为形式确认额外发问。
- 所有需要用户确认的阶段，用户侧输出默认采用“简短摘要 + 可继续/可补充/可修改”格式，不展示内部阶段字段列表，也不只给“回复继续”一种指令。
- 若当前仍处于新会话首轮且 Stage 1 项目基线存在歧义，本轮只能发出一个问题，不得同时追问页面细节、交互范围、数据来源、还原标准或其他 Stage 2 信息。
- 若问题需要用户补文档、skills、路径、截图说明、接口说明或组件约束，提问方式必须是 `text_reply`，只通过普通文本回复引导，不做成选择器。
- 即便是分支决策，也默认优先用文本列项直问；候选项可使用数字、字母或短标签，并明确告诉用户既可以回复对应标记，也可以直接输入自己的想法；只有宿主环境强制要求时才使用 `choice_ui`。
- 若用户已给出自定义 UI 库名称，则不要预先追问安装地址或本地路径；未给版本时默认可按最新版处理，只有在后续安装或校验失败时才回头追问来源。
- 默认不是每个 Stage 都要求用户确认；只有当前结论需要用户确认、正式研发前仍缺少必要资料，或验证结果需要用户明确放行时，才把当前回合作为暂停点。
