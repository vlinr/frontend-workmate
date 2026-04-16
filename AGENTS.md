# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-15
**Commit:** 6a7f924
**Branch:** main

## OVERVIEW

前端研发编排工具包。技能驱动的前端任务流程框架，用于规范化执行 bug 修复、feature 实现、refactor 改造等前端研发任务。

## STRUCTURE

```
frontend-workmate/
├── SKILL.md              # 总编排协议 (Stage 0-8 流程定义)
├── scripts/              # 初始化脚本
│   └── init-skills.js    # 技能同步脚本
├── skills/               # 技能库
│   ├── core/             # 核心编排技能
│   ├── curated/          # 内置可复用技能 (10个)
│   ├── projects/         # 项目扫描技能
│   ├── analysis/         # 范围分析技能
│   ├── execution/        # 实施技能
│   ├── verification/     # 验证技能
│   ├── docs/             # 文档同步技能
│   └── workflow/         # 流程技能索引
├── templates/            # 产物模板 (7类)
│   ├── analysis/         # change-scope, capability-matrix
│   ├── delivery/         # delivery-summary
│   ├── docs/             # directory-readme
│   ├── intake/           # request-brief
│   ├── project/          # project-skill templates
│   ├── task/             # 长任务模板
│   └── verification/     # verification-report
└── mcp/                  # MCP 集成 (当前空)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| 理解总流程 | `SKILL.md` | 8 Stage 流程定义 |
| 项目扫描 | `skills/projects/project-scan-profile/SKILL.md` | Stage 1 项目技能生成 |
| 范围分析 | `skills/analysis/frontend-change-scope/SKILL.md` | Stage 2 bug/feature/refactor 分类 |
| 执行实现 | `skills/execution/frontend-implementation/SKILL.md` | Stage 5 代码修改 |
| 验证流程 | `skills/verification/frontend-verification/SKILL.md` | Stage 6 功能验证 |
| 文档同步 | `skills/docs/directory-doc-sync/SKILL.md` | Stage 7 目录文档 |
| React 最佳实践 | `skills/curated/react-best-practices/` | 40+ 规则，8 分类 |
| 系统化调试 | `skills/curated/systematic-debugging/SKILL.md` | 根因追踪方法论 |
| 可访问性 | `skills/curated/accessibility/SKILL.md` | WCAG 2.2 合规 |
| TypeScript 高级类型 | `skills/curated/typescript-advanced-types/SKILL.md` | 泛型、条件类型、映射类型 |
| 长任务续跑 | `skills/curated/task-plan-checkpoint/SKILL.md` | 断点续跑机制 |
| 模板文件 | `templates/` | 各阶段产物模板 |

## CONVENTIONS

- **技能定义**: 所有技能使用 `SKILL.md` 文件，YAML frontmatter 必含 `name`、`description`
- **项目技能名**: Stage 1 产物固定为 `frontend-workmate-project-skill`
- **阶段状态**: 必须维护 `current_stage`、`current_stage_status`、`stage_block_reason`
- **输入状态**: 用户输入使用 `provided | not_provided | skipped | pending | not_applicable`
- **阶段切换**: 仅 `current_stage_status = completed` 时允许进入下一阶段
- **禁止虚构**: 项目不存在的能力标记 `not_applicable`

## ANTI-PATTERNS (THIS PROJECT)

| Pattern | Location | Rule |
|---------|----------|------|
| 不得自行改写流程 | `SKILL.md` L10 | 必须把本文件视为最高优先级执行协议 |
| 不得跳过技能 | `SKILL.md` L265 | Stage 2 已标记的必需技能不得跳过 |
| 不得虚构能力 | `SKILL.md` L79 | 项目不存在的能力不得虚构实现 |
| 不得提前追问 | `SKILL.md` L342 | Stage 0 禁止追问实现细节 |
| 不得覆盖最初需求 | `SKILL.md` L73 | 阶段补充约束不得改写最初需求锚点 |
| NO FIXES WITHOUT ROOT CAUSE | `systematic-debugging/SKILL.md` | 调试前必须先找到根因 |
| NEVER fix just the symptom | `root-cause-tracing.md` | 修复症状而非根因是失败 |

## UNIQUE STYLES

- **双语文档**: 中英文混合，协议规则使用中文，技能内容中英混合
- **Mermaid 流程图**: 总流程使用 Mermaid 定义 Stage 切换关系
- **技能调用矩阵**: 明确各阶段必须调用的技能清单
- **门禁判定**: 用户输入状态严格分类，仅 `pending` 阻塞

## COMMANDS

```bash
# 初始化技能同步
node scripts/init-skills.js

# 参数选项
node scripts/init-skills.js --dry-run      # 预览操作
node scripts/init-skills.js --dirs curated,external  # 指定源目录
```

## NOTES

- 技能来源优先级: 用户提供 > 项目技能 > 公共技能包
- 现有 AGENTS.md: `skills/curated/react-best-practices/AGENTS.md` (React 性能优化规则)
- `skills/external/` 当前为空，不保留扩展技能目录
- 项目技能产物名统一为 `fw-project-develop`