# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-24
**Commit:** Latest
**Branch:** main

## OVERVIEW

**frontend-workmate** 是一个前端研发全流程编排技能包，采用技能驱动架构，通过 9 阶段流程规范化执行 Bug 修复、Feature 实现、Refactor 改造等前端研发任务。

核心设计理念：
- **三核心目录**：用户项目目录、项目 IDE 配置目录、静态资源目录
- **技能驱动**：内置 10 个可复用技能，按条件自动调用
- **智能回退**：根据用户反馈自动判断回退阶段
- **多任务并发**：支持同时处理多个研发任务

---

## STRUCTURE

```
frontend-workmate/
├── SKILL.md                        # 总编排协议（最高优先级）
├── AGENTS.md                       # 项目知识库
├── README.md                       # 使用文档
│
├── scripts/
│   └── init-skills.js              # 初始化脚本（生成配置、同步技能）
│
├── stages/                         # 9 阶段定义
│   ├── index.md                    # 阶段索引与总流程表
│   ├── init.md                     # Stage 0: 初始化
│   ├── project-scan.md             # Stage 1: 项目扫描
│   ├── scope-analysis.md           # Stage 2: 范围分析
│   ├── plan.md                     # Stage 3: 执行计划
│   ├── supply.md                   # Stage 4: 资料补充
│   ├── implementation.md           # Stage 5: 实施研发
│   ├── verification.md             # Stage 6: 内部验证
│   ├── docs.md                     # Stage 7: 文档同步
│   └── delivery.md                 # Stage 8: 交付续跑
│
├── rules/                          # 流程规则
│   ├── frontend-orchestrator.md    # 核心链路规则
│   ├── frontend-change-scope.md    # 范围分析规则
│   ├── frontend-implementation.md  # 研发实施规则
│   ├── frontend-verification.md    # 验证规则
│   ├── directory-doc-sync.md       # 文档同步规则
│   └── fw-project-develop.md       # 项目技能模板规则
│
├── skills/
│   └── curated/                    # 内置可复用技能（10 个）
│       ├── fw-react-best-practices/   # React 最佳实践
│       ├── fw-react-components/       # React 组件规范
│       ├── fw-systematic-debugging/   # 系统化调试
│       ├── fw-typescript-advanced-types/  # TypeScript 高级类型
│       ├── fw-accessibility/          # WCAG 可访问性
│       ├── fw-web-design-guidelines/  # UI 规范
│       ├── fw-task-plan-checkpoint/   # 长任务续跑
│       ├── fw-code-analysis-doc/      # 代码分析文档
│       ├── skill-creator/          # 技能创建工具
│       └── find-skills/            # 技能发现
│
├── templates/                      # 产物模板
│   ├── fw-skill-rule.template.md      # 规则文件模板
│   ├── fw-session-state.template.md   # 状态文件模板
│   ├── analysis/                    # 分析产物模板
│   ├── delivery/                    # 交付产物模板
│   ├── docs/                        # 文档模板
│   ├── intake/                      # 输入模板
│   ├── project/                     # 项目技能模板
│   ├── task/                        # 任务模板
│   └── verification/                # 验证模板
│
└── prd-ux-code/                    # UX 代码转换（扩展模块）
```

---

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| 理解总流程 | `SKILL.md` | 9 阶段流程定义、门禁规则 |
| 阶段索引 | `stages/index.md` | 总流程表、显式确认点、自动衔接点 |
| 项目扫描 | `stages/project-scan.md` | Stage 1 项目技能生成 |
| 范围分析 | `stages/scope-analysis.md` | Stage 2 bug/feature/refactor 分类 |
| 实施研发 | `stages/implementation.md` | Stage 5 代码修改 |
| 内部验证 | `stages/verification.md` | Stage 6 功能验证 |
| 文档同步 | `stages/docs.md` | Stage 7 目录文档 |
| 交付续跑 | `stages/delivery.md` | Stage 8 智能回退 |
| React 最佳实践 | `skills/curated/fw-react-best-practices/` | 40+ 规则 |
| 系统化调试 | `skills/curated/fw-systematic-debugging/` | 根因追踪方法论 |
| 可访问性 | `skills/curated/fw-accessibility/` | WCAG 2.2 合规 |
| TypeScript 高级类型 | `skills/curated/fw-typescript-advanced-types/` | 泛型、条件类型 |
| 长任务续跑 | `skills/curated/fw-task-plan-checkpoint/` | 断点续跑机制 |
| 初始化脚本 | `scripts/init-skills.js` | 配置生成、技能同步 |

---

## THREE CORE DIRECTORIES

**配置文件仅存储 3 个核心目录路径**：

| 目录概念 | 配置字段 | 说明 |
| --- | --- | --- |
| 用户项目根目录 | `project_work_dir` | 用户打开的目录 |
| 项目 IDE 配置目录 | `project_ide_dir` | 存放项目配置、技能、规则、状态 |
| 静态资源根目录 | `static_config_dir` | IDE 配置根目录，存放静态技能、静态规则 |

**路径拼接规则**：

| 引用类型 | 拼接方式 |
| --- | --- |
| 静态技能 | `{static_config_dir}/skills/{技能名}/SKILL.md` |
| 静态规则 | `{static_config_dir}/rules/{规则名}.md` |
| 项目技能 | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` |
| 项目规则 | `{project_ide_dir}/rules/fw-skill-rule.md` |
| 项目状态 | `{project_ide_dir}/rules/fw-session-state.md` |

---

## CONVENTIONS

- **技能定义**: 所有技能使用 `SKILL.md` 文件，YAML frontmatter 必含 `name`、`description`
- **项目技能名**: Stage 1 产物固定为 `fw-project-develop`
- **阶段状态**: 必须维护状态文件 `fw-session-state.md`
- **配置文件**: 仅存储 3 个核心目录路径，其他路径通过拼接
- **自动衔接**: Stage 5→6→7→8 自动衔接，不等待用户确认
- **显式确认**: Stage 1、2、8 结束后等待用户确认
- **禁止虚构**: 项目不存在的能力标记 `not_applicable`

---

## ANTI-PATTERNS (THIS PROJECT)

| Pattern | Location | Rule |
|---------|----------|------|
| 不得自行改写流程 | `SKILL.md` | 必须把本文件视为最高优先级执行协议 |
| 不得跳过技能 | `stages/*.md` | 各阶段标记的必需技能不得跳过 |
| 不得虚构能力 | `SKILL.md` | 项目不存在的能力不得虚构实现 |
| 不得提前追问 | `stages/init.md` | Stage 0 禁止追问实现细节 |
| 不得覆盖最初需求 | `SKILL.md` | 阶段补充约束不得改写最初需求锚点 |
| NO FIXES WITHOUT ROOT CAUSE | `skills/curated/fw-systematic-debugging/` | 调试前必须先找到根因 |
| NEVER fix just the symptom | `skills/curated/fw-systematic-debugging/` | 修复症状而非根因是失败 |

---

## UNIQUE STYLES

- **双语文档**: 中英文混合，协议规则使用中文，技能内容中英混合
- **Mermaid 流程图**: 使用 Mermaid 定义 9 阶段切换关系
- **技能调用矩阵**: 明确各阶段必须调用的技能清单
- **三核心目录设计**: 配置文件仅存储 3 个路径，其他通过拼接
- **智能回退**: 根据用户反馈自动判断回退阶段

---

## COMMANDS

```bash
# 初始化（推荐参数）
node scripts/init-skills.js --workdir "项目路径" --ide ".trae"

# 预览模式
node scripts/init-skills.js --dry-run

# 指定源技能目录
node scripts/init-skills.js --dirs curated,external
```

---

## NOTES

- 技能来源优先级: 用户提供 > 项目技能 > 公共技能包
- 项目技能产物名统一为 `fw-project-develop`
- 支持全局安装和项目内安装
- 支持 15+ IDE 目录名（`.trae`, `.cursor`, `.opencode` 等）