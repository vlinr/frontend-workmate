# frontend-workmate 工具包维护文档

> 说明：当前文件保留在【当前技能目录】内作为维护副本；这里描述的是项目技能产物 `fw-project-develop`，项目技能由 Stage 1（项目扫描）生成或刷新。

## 目录概念说明

项目技能存放位置详见 `SKILL.md` 中的"目录概念映射表"。项目技能 `fw-project-develop` 存放于【技能目录】（和【当前技能目录】同级），而非【工作目录】或【代码改动目录】。

## 项目定位

- 本仓库不是业务前端应用，而是"前端研发流程工具包"。
- 主目标是沉淀可复用的前端研发编排技能、项目扫描技能、需求分析模板、执行模板、验证模板与目录说明规范。
- 后续围绕本仓库的修改，优先视为"编排协议、模板、技能库"层面的维护，而不是页面业务开发。

## 目录路由

| 研发对象 | 优先目录 | 说明 |
| --- | --- | --- |
| 主编排入口 | `SKILL.md` | 【当前技能目录】的总编排协议 |
| 通用模板 | `templates/` | 放需求、项目、分析、任务、验证、文档模板 |
| 共享公共技能 | 公共技能包 | Stage 0 初始化后可直接按技能名调用的公共能力 |
| 流程规则文档 | `rules/frontend-orchestrator`、`rules/project-scan-profile`、`rules/frontend-change-scope`、`rules/frontend-implementation`、`rules/frontend-verification`、`rules/directory-doc-sync` | 主流程各阶段规则 |
| 项目级技能 | `fw-project-develop` | 项目技能产物，由 Stage 1 生成或刷新 |
| 任务续跑记录 | `temp/task-runs/` | 仅在长任务或断点续跑时创建的临时记录 |
| 目录文档模板 | `templates/docs/directory-readme-template.md` | 目录说明文档生成模板 |

## 当前研发约束

- 根级 `SKILL.md` 是实际可执行的编排协议，后续要继续围绕它打磨。
- Stage 0 若存在 `scripts/init-skills.js`，应先把【静态配置目录】下的 `skills/curated/`、`skills/external/` 里的技能整理为可直接调用的公共技能包（拷贝到【静态技能目录】），再进入正式阶段扫描。
- Stage 1 应先检查是否已存在项目技能 `fw-project-develop`；只有找不到合适候选时，才生成或刷新该产物。
- 若用户提供项目 skills、项目文档、UI 框架 skills 或 UI 框架文档，应优先吸收并归档，再决定是否继续内部生成。
- 若【工作目录】为空白项目或不存在前端工程，Stage 1 需要先确认是否协助初始化；用户回复"退出"或"结束"时流程终止；用户回复"跳过"或空回复时采用默认方案继续初始化。
- 凡是需要用户提供的信息，都必须等待用户明确回答；不能由 AI 直接假设并执行初始化、选型或技能生成。
- Stage 1 生成或刷新项目技能后，需要向用户展示项目结构、底层框架、语言框架、语言、UI 库与关键约束，并等待确认；用户若纠正，则留在 Stage 1 继续修正。
- Stage 2 形成任务类型、修改范围、风险与技能路线后，需要先让用户确认分析结论是否正确；若用户补充，则继续留在分析回路中合并修正。
- 若只是完成项目初始化或依赖安装，但尚未形成项目 skill 或尚未完成 Stage 2 确认，仍不得进入研发。
- 若已安装的是私有/自研 UI 库，且组件规则尚不清晰，需要先得到"提供文档/skills/说明"或"明确不提供"的结论，再进入研发。
- Stage 5 在正式执行前负责按任务类型吸收前置资料：`feature` 默认确认，`bug` 仅在涉及接口、联调、权限、设计或三方库时确认，`refactor` 默认可跳过。
- Stage 5 依赖的公共技能优先按配置文件路径调用：**先读取配置文件** `{project_ide_dir}/.fw-session-config.json`，动态拼接 `{static_config_dir}/skills/fw-systematic-debugging/SKILL.md`、`{static_config_dir}/skills/fw-task-plan-checkpoint/SKILL.md`、`{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md`。
- Stage 6 内部验证输出后，应先等待用户确认；用户确认后再进入 Stage 7 与 Stage 8，若用户提出问题再回退修正。
- 所有路径统一使用【当前技能目录】内相对路径。
- 若某项逻辑当前不存在，必须标记 `not_applicable`，不能为了完整性补虚构信息。
- 当前阶段不保留 `skills/external/` 扩展技能层。
- 历史样例目录不属于主流程依赖，目录说明文档统一以 `templates/docs/directory-readme-template.md` 与 `rules/directory-doc-sync.md` 为准。

## 研发优先级

- 修改根级编排协议时，优先同步 `rules/frontend-orchestrator.md` 与相关阶段规则。
- 修改 Stage 1 逻辑时，优先同步 `rules/project-scan-profile.md`、`templates/project/` 与 `fw-project-develop` 的产物约定。
- 修改阶段产物契约时，优先同步对应 `templates/` 文件。
- 修改交付规则或续跑规则时，优先同步 `fw-task-plan-checkpoint` 与 `temp/task-runs/` 的约定。

## 回归重点

- 根级 `SKILL.md` 与阶段规则是否一致。
- Stage 1 是否体现"先查【技能目录】下已有项目技能候选，再决定是否扫描并标准化归档"。
- Stage 1 是否体现"先吸收用户提供资料、再处理空白初始化、再决定是否内部扫描与生成"。
- Stage 1 项目技能结论是否增加了显式用户确认闭环。
- Stage 2 范围分析结论是否增加了显式用户确认闭环。
- Stage 5 执行前资料补充是否按任务类型触发，而不是默认全量询问。
- Stage 6 是否体现"内部验证通过后仍需用户审查"的门禁。
- 所有"由用户提供"的字段是否都存在明确等待门禁，而不是被 AI 自动补齐。
- 模板契约与编排协议是否一致。
- 任务记录中的版本号与实际改动是否一致。

## 技能有效性与刷新条件

- 当前技能覆盖的项目边界：`frontend-workmate` 根级编排协议、模板目录、技能目录、项目技能发现规则与任务记录约定。
- 可直接复用的条件：根级流程阶段未发生结构性调整，`templates/` 与 `skills/` 的主目录职责未发生明显变化，项目技能发现与标准化归档机制仍然成立。
- 必须刷新的信号：新增或删除关键阶段技能、模板契约发生明显变化、项目技能发现顺序变化、空白初始化分支变化、UI 框架技能接入规则变化、主编排协议调整了 Stage 含义、用户确认闭环或技能调用规则。
- 刷新时优先检查的目录或配置：`SKILL.md`、`templates/`、`scripts/init-skills.js`、`rules/` 目录下的各规则文档与 `fw-project-develop`。