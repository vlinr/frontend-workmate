---
name: frontend-workmate
description: 前端研发流程编排技能，9阶段闭环执行（初始化→项目扫描→范围分析→执行计划→资料补充→实施研发→内部验证→文档同步→交付）。适用于任何前端任务：修复bug、添加功能、重构代码、修改UI、调整样式、更新组件、改页面、接口联调、状态管理、路由处理、表单处理、性能优化、可访问性改进。用户说"修复"、"添加"、"改一下"、"优化"、"重构"等涉及前端代码时自动触发，或使用 `/frontend-workmate` 显式调用。
user-invocable: true
layer: 1
---

# 前端研发编排技能

## 执行起点（首要动作）

**收到用户请求后，必须立即执行以下动作，不得跳过**：

1. 输出：`正在初始化...`
2. 设置内部状态：`current_stage = stage0`
3. **读取并执行** `stages/init.md`（初始化阶段定义）
4. 初始化完成后输出：`[初始化] 执行完成。结论：具体结论。接下来进入下一阶段：[项目扫描]。`
5. **设置内部状态**：`current_stage = stage1`，**读取并执行** `stages/project-scan.md`

**流程映射表**：详见 `stages/index.md`（ID ↔ 名称）
- 内部状态用 ID（如 `stage0`）
- 用户输出用名称（如 `[初始化]`）

**禁止**：跳过初始化、对用户输出 ID 或编号。

---

## 阶段流转机制（通用规则）

**每个阶段完成后，必须执行以下动作**：

1. 输出阶段完成结论：`[阶段名称] 执行完成。结论：具体结论。接下来进入下一阶段：[下一阶段名称]。`
2. 设置内部状态：`current_stage = <下一阶段ID>`，`current_stage_status = in_progress`
3. **读取并执行** `stages/<下一阶段定义文件>.md`
4. 按阶段定义执行，形成最小过站产物

**显式确认点**（需等待用户答复才能进入下一阶段）：
- **项目扫描完成后** → 输出项目技能摘要，等待用户确认
- **范围分析完成后** → 输出分析结论，等待用户确认
- **交付续跑完成后** → 输出交付结果，等待用户确认；用户可补充修改或明确指定回退阶段

**显式确认点的标准提示语**：

每个显式确认点输出结论后，**必须附加以下提示语**：

> "如果您还有其他需要修改的，请告诉我；当然如果没有其他修改，您可以直接回复'继续'，我将进入下一步。"

**提示语使用场景**：
- 项目扫描确认：输出项目技能摘要后 → 附加提示语
- 范围分析确认：输出分析结论后 → 附加提示语
- 交付续跑确认：输出交付结果后 → 附加确认提示语（包含智能回退选项）

**禁止事项**：
- 禁止只输出"请确认"或"回复继续"
- 禁止省略"如果您还有其他需要修改的，请告诉我"部分
- 禁止在最后一步（交付续跑完成后）附加提示语

**自动衔接点**（无需等待，直接进入下一阶段）：
- 初始化 → 自动进入项目扫描
- 执行计划 → 自动进入资料补充
- 资料补充（用户已答复 `provided | not_provided | skipped | not_applicable`） → 自动进入实施研发
- **实施研发 → 自动进入内部验证**（Stage 5 完成后直接执行 Stage 6）
- **内部验证 → 自动进入文档同步**（Stage 6 完成后直接执行 Stage 7）
- 文档同步 → 自动进入交付续跑

**等待期间禁止事项**：
- 不得在同一回复中继续分析、调用下游技能、修改文件、执行命令
- 不得自行假设用户已同意并跳过确认点

---

## 目录概念映射表（三核心目录设计）

本技能包使用**三核心目录**设计，配置文件仅存储这3个路径，其他路径通过拼接：

| 概念名称 | 配置字段 | 说明 |
| --- | --- | --- |
| **【项目工作目录】** | `project_work_dir` | 用户打开的目录，研发改动参考依据 |
| **【项目IDE配置目录】** | `project_ide_dir` | 存放项目配置、项目技能、项目规则、项目状态 |
| **【静态资源根目录】** | `static_config_dir` | IDE配置根目录（如 ~/.qoder），存放静态技能、静态规则 |

**路径拼接规则**：

| 引用类型 | 拼接方式 |
| --- | --- |
| 静态技能 | `{static_config_dir}/skills/{技能名}/SKILL.md` |
| 静态规则 | `{static_config_dir}/rules/{规则名}.md` |
| 项目技能 | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` |
| 项目规则 | `{project_ide_dir}/rules/fw-skill-rule.md` |
| 项目状态 | `{project_ide_dir}/rules/fw-session-state.md` |
| 改动代码 | `{project_work_dir}/src/...` |

**关键规则**：
- **配置文件存放于【项目IDE配置目录】**：`.fw-session-config.json`
- **静态技能存放于【静态资源根目录】/skills/**：与 `frontend-workmate` 同级
- **项目技能存放于【项目IDE配置目录】/skills/**：`fw-project-develop/`

**示例（全局安装，IDE配置目录 ~/.qoder）**：
```
# 【静态资源根目录】
~/.qoder/                                        # static_config_dir
├── skills/
│   ├── frontend-workmate/                       # 本技能包
│   │   ├── rules/
│   │   │   ├── frontend-implementation.md
│   │   │   └── frontend-verification.md
│   │   └── templates/
│   ├── fw-react-best-practices/                    # 静态技能
│   ├── fw-systematic-debugging/                    # 静态技能
│   └── ...
├── rules/
│   └── ...
└── ...

# 【项目IDE配置目录】（跟随项目）
/home/user/my-project/.qoder/                    # project_ide_dir
├── .fw-session-config.json                      # 配置文件（仅3个路径）
├── skills/
│   └── fw-project-develop/                      # 项目技能
├── rules/
│   ├── fw-skill-rule.md                         # 项目规则
│   └── fw-session-state.md                      # 项目状态
└── output/

```

**示例（项目内安装）**：
当技能安装在项目内时，`static_config_dir` = `<项目>/<IDE>/`（如 `/home/user/my-project/.qoder/`）。
└── output/

# 【项目工作目录】（用户打开的目录）
/home/user/my-project/
├── src/
├── package.json
└── ...
```

**示例关系（项目内安装）**：
当技能安装在项目内时，【静态配置目录】和【项目IDE配置目录】可能相同或相邻。

---

## 流程执行协议

### 阶段名称与顺序

| 顺序 | 阶段名称 | 定义文件 | 核心职责 |
| --- | --- | --- | --- |
| 1 | 初始化 | `stages/init.md` | 执行初始化脚本，建立任务上下文 |
| 2 | 项目扫描 | `stages/project-scan.md` | 生成或刷新项目技能 `fw-project-develop` |
| 3 | 范围分析 | `stages/scope-analysis.md` | 分析任务类型、修改范围、技能路线 |
| 4 | 执行计划 | `stages/plan.md` | 长任务拆分与断点续跑（可选） |
| 5 | 资料补充 | `stages/supply.md` | 按任务类型补充前置资料 |
| 6 | 实施研发 | `stages/implementation.md` | 执行代码修改 |
| 7 | 内部验证 | `stages/verification.md` | 验证修改有效性 |
| 8 | 文档同步 | `stages/docs.md` | 更新目录级说明文档 |
| 9 | 交付续跑 | `stages/delivery.md` | 输出交付结果 |

### 总流程表

详见 `stages/index.md`，包含完整的执行逻辑表（阶段/节点、判断条件、分支走向）。

### 阶段流转概览

```
初始化 → 项目扫描 → [用户确认] → 范围分析 → [用户确认] → 执行计划（可选） → 资料补充 → [用户提供] → 实施研发 → 内部验证 → 文档同步 → 交付续跑 → [用户确认]
```

**显式确认点**：
- 项目扫描完成后需用户确认项目技能是否正确
- 范围分析完成后需用户确认分析结论是否正确
- 交付续跑完成后需用户确认交付结果（用户可补充修改或明确指定回退阶段）

**自动衔接点**：实施研发、内部验证、文档同步完成后自动进入下一阶段（Stage 5→6→7→8 全自动衔接）

### 阶段完成输出规范

**每个阶段完成后必须输出**：

```
[阶段名称] 执行完成。结论：具体结论内容。接下来进入下一阶段：[下一阶段名称]。
```

**内部状态维护**（用 ID）：
- `current_stage`：内部 ID（如 `stage0`）
- `current_stage_status`：`pending | in_progress | waiting_user | completed | blocked`
- `next_stage`：下一阶段 ID（如 `stage1`）

**用户输出**（用名称）：
- 输出 `[初始化]` 而非 `[stage0]`
- 输出 `[项目扫描]` 而非 `[stage1]`

**流程映射表**：详见 `stages/index.md`

**禁止**：
- 输出 Stage 编号或内部 ID
- 静默切换阶段

---

## 核心门禁规则

### 1. 必须从初始化开始

首轮必须从初始化阶段开始执行，不得跳过初始化直接进入项目扫描或其他阶段。

### 2. 阶段产物必须形成

每个阶段必须形成最小过站产物，不得"内部想完就直接跳下一阶段"。

### 3. 用户确认必须等待

在显式确认点，必须等待用户明确答复：
- 用户回复 `继续 / 同意 / 没问题`：允许进入下一阶段
- 用户回复补充、修正内容：留在当前阶段合并后重新确认
- 用户回复否定：按回退规则处理

### 4. 禁止虚构项目能力

若项目不存在某项能力（如路由、权限、状态管理），标记 `not_applicable`，不得虚构实现。

### 5. 最初需求锚点不得覆盖

初始化阶段建立的"最初需求锚点"是任务主目标，后续阶段只能补充约束，不得改写最初需求。

### 6. 项目技能只承载长期规则

`fw-project-develop` 只承载稳定项目知识，不得写入当前单次任务的临时诉求或实现偏好。

### 7. 技能建议调用规则

**各阶段建议根据实际条件调用技能，满足条件时建议使用**：

| 阶段 | 触发条件 | 建议调用的技能 | 说明 |
| --- | --- | --- | --- |
| **Stage 2（范围分析）** | 项目技能存在 | `fw-project-develop` | 建议调用项目技能，获取项目结构、技术栈、路由、权限等约束 |
| **Stage 5（实施研发）** | 项目技能存在 | `fw-project-develop` | 建议先调用项目技能，理解项目约束后再开始实现 |
| **Stage 5（实施研发）** | 任务类型为 `bug` | `fw-systematic-debugging` | bug 任务建议先找到根因 |
| **Stage 5（实施研发）** | 技术栈为 React（项目技能中标记） | `fw-react-best-practices` | **仅适用于 React 技术栈** |
| **Stage 5（实施研发）** | 技术栈为 React 且涉及组件开发 | `fw-react-components` | **仅适用于 React 技术栈** |
| **Stage 5（实施研发）** | 涉及复杂类型约束 | `fw-typescript-advanced-types` | TypeScript 复杂类型场景 |
| **Stage 6（内部验证）** | 项目技能存在 | `fw-project-develop` | 建议调用项目技能，获取验证约束（路由、权限、构建规则等） |
| **Stage 6（内部验证）** | 改动涉及页面/组件/表单/键盘交互/焦点流 | `fw-accessibility` | WCAG 2.2 可访问性检查 |
| **Stage 6（内部验证）** | 改动涉及布局/样式/间距/UI 一致性 | `fw-web-design-guidelines` | Web 界面规范检查 |

**项目技能说明**：
- `fw-project-develop` 是项目技能，包含项目结构、技术栈、路由、权限、状态管理、构建规则等关键信息
- 建议调用：Stage 2（范围分析）、Stage 5（实施研发）、Stage 6（内部验证）开始时建议调用项目技能
- 调用目的：让 AI 理解项目约束，避免违背项目已有规则

**技术栈说明**：
- `fw-react-best-practices`、`fw-react-components` **仅适用于 React 技术栈**（项目技能中标记）
- 其他技术栈（Vue、Angular、Svelte 等）目前暂无对应技能，后续可扩展
- 技术栈判断依据：调用 `fw-project-develop` 后获取的技术栈字段

**禁止事项**：
- 禁止在不满足触发条件时强行调用（避免过度调用）
- 禁止在非 React 技术栈下调用 React 技能

---

## 技能与规则调用

### 流程规则入口

详见 `rules/frontend-orchestrator.md`，包含完整的核心链路、提问门禁、阶段切换规则、失败回退逻辑。

### 各阶段规则

| 阶段 | 规则文件 |
| --- | --- |
| 项目扫描 | `rules/project-scan-profile.md` |
| 范围分析 | `rules/frontend-change-scope.md` |
| 实施研发 | `rules/frontend-implementation.md` |
| 内部验证 | `rules/frontend-verification.md` |
| 文档同步 | `rules/directory-doc-sync.md` |

### 可复用技能

| 技能 | 用途 | 调用时机 |
| --- | --- | --- |
| `fw-systematic-debugging` | 系统化调试 | bug 修复 |
| `fw-react-best-practices` | React 最佳实践 | React 相关实现 |
| `fw-react-components` | React 组件规范 | 组件开发 |
| `fw-typescript-advanced-types` | TypeScript 高级类型 | 复杂类型问题 |
| `fw-task-plan-checkpoint` | 长任务续跑 | 多步骤任务 |
| `fw-code-analysis-doc` | 代码分析文档 | 目录关系提炼 |
| `fw-accessibility` | 可访问性检查 | 界面验证 |
| `fw-web-design-guidelines` | UI 规范检查 | 界面验证 |
| `find-skills` | 技能发现 | 缺少关键技能时 |

---

## 回退规则

| 场景 | 回退目标 |
| --- | --- |
| 项目技能缺失或失效 | 项目扫描 |
| 范围分析结论不稳定 | 范围分析 |
| 实施发现关键技能不可用 | 范围分析 |
| 验证失败 | 实施研发 |
| 文档同步发现实现不稳定 | 实施研发或内部验证 |
| 交付后用户补充新需求 | 范围分析 |

---

## 最终交付要求

- 汇报：改了什么、如何验证、还有什么风险
- 任何声称"已完成"的结果必须经过实际验证
- 若任务中断，续跑记录在 `temp/task-runs/<task-id>/`

---

## 相关文件索引

| 类别 | 目录/文件 |
| --- | --- |
| 阶段定义 | `stages/*.md` |
| 流程规则 | `rules/*.md` |
| 可复用技能 | `skills/curated/*/SKILL.md` |
| 产物模板 | `templates/` |
| 项目知识 | `AGENTS.md` |
