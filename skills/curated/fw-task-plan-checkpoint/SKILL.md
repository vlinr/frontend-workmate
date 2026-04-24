---
name: fw-task-plan-checkpoint
description: 长任务分步执行与断点续跑技能。用于 feature 实现、refactor、排障、迁移等多步骤任务；要求先在技能包内的临时运行目录生成详细计划，再按步骤执行并持续回写状态。支持用户按步骤 ID 直接引用文档重跑某一步或修改某一步；若上下文或 token 预算接近上限，自动输出任务交接文件，记录关键词、已完成项、未完成项与下一步执行指令，便于继续执行。
---

# Task Plan Checkpoint

按以下流程执行，不跳步。

## 0) 执行实际（必须对齐）

- 本技能不是“只产出计划”，而是“计划文件 + 实际执行 + 持续回写”一体化流程。
- 触发本技能后，必须在同一任务中完成：
  - 初始化任务目录与 5 个文件
  - 先写计划，再按步骤执行
  - 每步执行后同步更新状态与日志
  - 支持用户按步骤 ID 直接继续/重跑/修改
- 若用户只要求“先出计划不执行”，需在 `TASK_PLAN.md` 显式标注“当前模式：plan_only”。
- 若用户未特别声明，默认进入“plan_and_execute”模式并按步骤落地执行。

## 1) 初始化任务临时目录

- 在技能目录的上层目录创建任务运行目录：
  - `temp/task-runs/<task-id>/`
- `<task-id>` 规则：
  - 优先：`YYYYMMDD-HHMMSS-任务短名`
  - 无短名时：`YYYYMMDD-HHMMSS-task`

在目录内创建以下文件：
- `TASK_PLAN.md`：任务计划与状态清单
- `PROGRESS_LOG.md`：执行日志（按时间追加）
- `CONTEXT_KEYS.md`：上下文关键词与约束
- `HANDOFF.md`：断点续跑信息（仅在需要交接时更新）
- `STEP_INDEX.md`：步骤索引与可引用执行指令

## 2) 先产出详细计划（必须先于实现）

- 在 `TASK_PLAN.md` 写可执行步骤，至少包含：
  - 步骤 ID（稳定 ID，格式 `S01`, `S02`...，后续不改号）
  - 步骤目标
  - 输入/依赖
  - 预期产出
  - 状态（`pending | in_progress | done | blocked | skipped`）
  - 版本（初始为 `v1`，修改后 `v2/v3...`）
- 在 `STEP_INDEX.md` 记录每个步骤的“可直接引用指令模板”：
  - 继续执行模板
  - 重跑模板
  - 修改并重执行模板
- 步骤粒度要求：
  - 每步可在一个短回合内完成并可验证
  - 避免“大而全”的单步描述

## 3) 执行策略（逐步推进）

- 严格按 `TASK_PLAN.md` 顺序执行：
  - 开始某步前，先将该步置为 `in_progress`
  - 完成后立即置为 `done`
  - 若受阻置为 `blocked` 并写明阻塞原因
- 每完成一步，必须同时更新：
  - `TASK_PLAN.md`（状态变化）
  - `PROGRESS_LOG.md`（记录“做了什么、产出什么、如何验证”）
  - `STEP_INDEX.md`（同步步骤最新版本与最近执行时间）

## 3.1) 步骤重跑与步骤修改机制（必须支持）

- 当用户明确引用步骤 ID（如 `S03`）时，按意图处理：
  - **重跑某步**：保持步骤目标不变，版本不变，重新执行并追加日志。
  - **修改某步**：先更新该步内容并版本 +1，再执行该步骤。
- 重跑/修改后状态回滚规则：
  - 目标步骤设为 `in_progress -> done/blocked`
  - 若目标步骤输出影响后续步骤，将受影响步骤设为 `pending` 并在 `TASK_PLAN.md` 标注“因 Sxx 变更回滚”
- 在 `PROGRESS_LOG.md` 追加“操作类型”：
  - `normal_execute | rerun_step | revise_step`

## 3.2) 文档直引协议（给用户直接引用）

- 在 `STEP_INDEX.md` 为每一步维护固定条目：
  - `step_id`
  - `title`
  - `current_version`
  - `status`
  - `continue_prompt`
  - `rerun_prompt`
  - `revise_prompt`
- 模板示例：
  - `continue_prompt`: `请读取 temp/task-runs/<task-id>/TASK_PLAN.md 与 STEP_INDEX.md，继续执行 S03。`
  - `rerun_prompt`: `请读取 temp/task-runs/<task-id>/TASK_PLAN.md 与 PROGRESS_LOG.md，重跑 S03，并记录差异。`
  - `revise_prompt`: `请读取 temp/task-runs/<task-id>/TASK_PLAN.md，将 S03 按以下要求修改后以新版本执行：<变更要求>`

## 4) 上下文关键词沉淀

- 在 `CONTEXT_KEYS.md` 维护可续跑关键词，至少包含：
  - 任务目标关键词
  - 涉及模块/功能关键词
  - 关键约束关键词（接口契约、兼容要求、风险点）
  - 关键决策关键词（为什么这样做）
- 每当方案变更、范围扩展、约束变化时立即更新。

## 5) token/上下文预算保护（断点机制）

在以下任一情况触发“交接写盘”：
- 任务明显无法在当前回合完成
- 步骤上下文过长，继续执行会丢失关键信息
- 预计继续输出会接近 token 限制

触发后必须更新 `HANDOFF.md`，包含：
- 任务摘要（1 段）
- 当前进度（已完成步骤列表）
- 未完成步骤（按优先级）
- 当前阻塞项与解法建议
- 下一回合首步动作（明确到可直接执行）
- 可直接引用的继续执行提示词（1~3 条，优先引用 `STEP_INDEX.md` 中对应模板）

## 6) 交付标准

- 任意时刻中断后，用户可仅凭任务目录五个文件继续任务（含 `STEP_INDEX.md`）。
- `TASK_PLAN.md` 与真实进度一致，不允许“执行了但未回写”。
- `HANDOFF.md` 在触发断点机制时必须可直接接力执行。
- 用户可通过步骤 ID 精确指定“继续/重跑/修改”某一步，无需重新描述全任务。

## 7) 输出要求

- 对用户汇报时同步给出任务目录路径。
- 若发生断点，明确提示用户可直接引用 `HANDOFF.md` 继续。
