# Skills 目录导航

## 1. 设计目标

- 本目录沉淀前端研发编排工具包的技能库，而不只是流程步骤说明。
- 当前只保留“可复用内置技能 + 自建流程技能”两层结构。
- 自建技能优先引用 `templates/` 中的稳定模板，不直接写死单项目知识。
- 若项目或任务不存在某类逻辑，技能应优先输出 `not_applicable`，而不是补虚构内容。

## 2. 目录结构

- `curated/`：已完整落盘到当前仓库的可复用通用技能
- `workflow/`：当前工具包自建的前端流程编排技能
- `projects/`：存放项目扫描技能与项目技能索引说明；正式项目技能以标准项目技能产物的形式复用
- `core/`、`projects/`、`analysis/`、`execution/`、`verification/`、`docs/`：首批自建技能分类目录

## 3. 技能来源

- `curated/` 用于沉淀已经拷贝到当前仓库、且与前端研发高相关的完整技能目录。
- `workflow/` 用于沉淀当前仓库自建的主流程技能定义。
- `projects/` 主要承担两类内容：Stage 1 项目扫描技能，以及项目技能归档规则说明。
- Stage 1 应先检查当前工作区已有项目专项技能；只有在没有可复用候选时，才生成标准化项目技能产物。
- Stage 1 还应优先吸收用户提供的项目 skills / 文档与 UI 框架资料；若工作区为空白或没有前端项目，则先走初始化分支，再决定是否继续分析。
- 凡是标记为需要用户提供的资料，必须先询问并等待用户明确回答；技能不得用默认技术栈、默认版本或默认 UI 框架代替用户选择。
- Stage 1 生成或刷新项目技能后，应先向用户展示关键项目结论并等待确认；用户若纠正，则留在 Stage 1 修正。
- Stage 2 完成范围分析后，应先向用户展示任务类型、修改范围、风险与技能路线，并确认分析结论是否正确；用户补充后继续留在当前分析回路合并修正。
- Stage 5 在正式执行前负责按任务类型吸收外部资料：`feature` 默认确认，`bug` 仅在涉及外部依赖时确认，`refactor` 默认可跳过。
- Stage 6 内部验证输出后，需要先等待用户确认；确认后再进入文档同步与最终交付。
- 正式项目技能统一通过固定技能名复用；当前默认项目技能产物名为 `frontend-workmate-project-skill`，项目扫描技能名固定为 `project-scan-profile`。
- 根级 [SKILL.md](../SKILL.md) 是当前仓库的总编排技能入口。

## 4. 当前已落地的自建技能

- `frontend-orchestrator` 负责驱动主流程、用户确认闭环与阶段回退。
- `project-scan-profile` 在没有可复用候选或现有候选失效时，扫描项目并生成标准项目技能产物。
- `frontend-change-scope` 生成 `change-scope` 与 `capability-matrix`，并负责把需求分析结论回显给用户确认。
- `frontend-implementation` 根据任务类型、能力矩阵与资料输入执行研发，并按任务类型决定是否要求外部资料。
- `frontend-verification` 负责内部测试、回归与文档同步前的交付门禁判断。
- `directory-doc-sync` 负责按目录 README 模板同步说明文档。

## 5. 当前已落地的内置技能

- `accessibility`
- `code-analysis-doc`
- `find-skills`
- `react-components`
- `skill-creator`
- `systematic-debugging`
- `task-plan-checkpoint`
- `typescript-advanced-types`
- `react-best-practices`
- `web-design-guidelines`

## 6. 当前外部技能入口

- 当前阶段不保留 `external/` 扩展技能目录
