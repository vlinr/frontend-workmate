# Execution Plan Template

## 1. 任务概览

- 任务名称：
- 对应需求：
- 执行模式：`直接执行 | 长任务`
- 负责人：
- 任务标识：
- 当前阶段：`stage0_alignment | stage1_project_scan | stage2_scope | stage3_plan | stage4_inputs | stage5_implementation | stage6_verification | stage7_docs | stage8_delivery`
- 当前阶段状态：`pending | in_progress | waiting_user | completed | blocked`
- 下一阶段：`stage0_alignment | stage1_project_scan | stage2_scope | stage3_plan | stage4_inputs | stage5_implementation | stage6_verification | stage7_docs | stage8_delivery | not_applicable`
- 当前阶段目标：
- 当前阶段进入条件：
- 当前阶段完成条件：
- 阶段阻塞原因：

## 2. 步骤拆解

| Step ID | 标题 | 目标 | 输入/依赖 | 预期产出 | 状态 | 版本 |
| --- | --- | --- | --- | --- | --- | --- |
| S01 |  |  |  |  | `pending` | `v1` |

## 3. 能力绑定

| 步骤 | 使用的 skill | 是否调用 MCP | 失败降级策略 |
| --- | --- | --- | --- |
| S01 |  | `是 | 否` |  |

## 4. 关键门禁

- 进入研发前门禁：
- 进入验证前门禁：
- 进入交付前门禁：
- Stage 1 用户确认状态：`approved | revise_needed | not_applicable`
- Stage 2 用户确认状态：`approved | revise_needed | pending`
- Stage 6 用户审查状态：`approved | revise_needed | pending | not_applicable`

## 5. 风险与回退

- 高风险步骤：
- 回退点：
- 用户确认点：
- 用户审查点：

## 6. 执行结论

- 是否可直接执行：`yes | no`
- 若否，阻塞项：
- 断点续跑策略：
- 下一步：
- 当前等待对象：`用户确认 | 用户审查 | 内部执行 | 无`

## 7. 阶段切换要求

- 切换阶段前，必须先更新“当前阶段 / 当前阶段状态 / 下一阶段 / 阶段阻塞原因”。
- 若当前阶段状态不是 `completed`，不得切换到下一阶段。
- 若当前阶段状态为 `waiting_user` 或 `blocked`，执行计划必须停留在当前阶段，不得继续执行后续步骤。
