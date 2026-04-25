---
alwaysApply: true
description: "frontend-workmate 技能规则（静态规则部分）"
---

# ⚠️ 核心强制规则（必须遵守）

## 1. 单一阶段输出原则

**每次输出只包含当前阶段内容**，禁止：
- 输出未来阶段计划
- 自创任务列表（必须使用状态文件的任务列表）
- 幻想用户反馈或未来结果

**正确示例**：`[初始化] 任务ID: task_xxx... [初始化] 执行完成。进入下一阶段：[项目扫描]。`

## 2. 任务ID携带原则

**每次 AI 输出必须在首行携带任务ID**：
- 每条输出的第一行：`[阶段名称] 任务ID: task_xxxxxxxx`
- 状态更新时携带任务ID
- 禁止脱离任务上下文执行操作

**为什么每条输出都要携带任务ID**：
- 防止上下文超限导致任务上下文丢失
- 新会话可以通过提取用户引用内容中的任务ID来判断是否继续已有任务
- 用户可以显式引用任务ID来继续特定任务

**新会话任务关联逻辑**：
1. 新会话启动 → 读取状态文件，检查是否有活跃任务
2. 从用户输入或引用的 AI 输出中提取任务ID：
   - 用户输入显式包含 `任务ID: task_xxxxxxxx` → 继续该任务
   - 用户输入引用的 AI 输出包含任务ID → 继续该任务
   - 用户输入不包含任务ID引用 → **默认：创建新任务**

## 3. 阶段确认闭环原则

**必须等待用户确认后进入下一阶段**：
| 阶段结束 | 动作 |
| --- | --- |
| 有产物输出 | 输出摘要 + 等待确认提示语 |
| 用户确认"继续" | **先更新状态文件** → 进入下一阶段 |
| 用户提出修改 | 停留当前阶段 → 合并反馈 → 再次等待 |

**禁止**：未经确认进入下一阶段、连续输出多阶段内容

## 4. 状态文件更新原则

**必须读取和更新状态文件**：
| 时间点 | 动作 |
| --- | --- |
| 进入阶段前 | `read` 状态文件，获取当前阶段和任务ID |
| 阶段完成后 | `edit` 状态文件，更新阶段进度 |
| 用户提出修改后 | `edit` 状态文件，更新状态 |

**禁止**：不读取状态文件就推断阶段、不更新状态文件就进入下一阶段

## 5. 动态路径读取原则（三核心目录）

**配置文件仅存储三个核心目录**，其他路径通过拼接：

| 目录概念 | 配置字段 | 说明 |
| --- | --- | --- |
| 用户项目根目录 | `project_work_dir` | 用户打开的目录，研发改动参考依据 |
| 项目IDE配置根目录 | `project_ide_dir` | 存放项目配置、技能、规则、状态 |
| 静态资源根目录 | `static_config_dir` | IDE配置根目录（如 ~/.qoder），存放静态技能、静态规则 |

**路径拼接规则**：

| 引用类型 | 拼接方式 |
| --- | --- |
| 静态技能（fw-react-best-practices 等） | `{static_config_dir}/skills/{技能名}/SKILL.md` |
| 静态规则（frontend-implementation.md 等） | `{static_config_dir}/rules/{规则名}.md` |
| 项目技能（fw-project-develop） | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` |
| 项目规则（fw-skill-rule.md） | `{project_ide_dir}/rules/fw-skill-rule.md` |
| 项目状态（fw-session-state.md） | `{project_ide_dir}/rules/fw-session-state.md` |
| 改动代码 | `{project_work_dir}/src/...` |

**引用步骤**：
1. `read` `{project_ide_dir}/.fw-session-config.json`
2. 获取 `project_work_dir`、`project_ide_dir`、`static_config_dir`
3. 根据引用类型拼接路径

**禁止**：硬编码路径（如 `skills/curated/xxx/SKILL.md`）

## 6. 回退重置原则

**回退时必须重置后续阶段**：
| 回退场景 | 重置阶段 |
| --- | --- |
| stage8 → stage5 | stage5-8 → 待重新执行 |
| stage8 → stage2 | stage2-8 → 待重新执行 |
| stage5 → stage2 | stage2-5 → 待重新执行 |

**禁止**：回退时不重置后续阶段

---

# 配置文件结构

配置文件 `.fw-session-config.json` 存放于 `{project_ide_dir}`，**仅存储三个核心目录**：

```json
{
  "project_work_dir": "/home/user/my-project",
  "project_ide_dir": "/home/user/my-project/.opencode",
  "static_config_dir": "~/.opencode",
  "created_at": "2026-04-21T..."
}
```

**其他路径通过拼接**：
- 静态技能目录 = `{static_config_dir}/skills/`
- 静态规则目录 = `{static_config_dir}/rules/`
- 项目技能目录 = `{project_ide_dir}/skills/`
- 项目规则目录 = `{project_ide_dir}/rules/`

---

# 各阶段职责边界

| 阶段 | 负责 | 不负责（记录到上下文） |
| --- | --- | --- |
| stage0 | 初始化、任务ID生成 | 项目分析、范围分析 |
| stage1 | 项目扫描、技能生成 | 研发需求、功能描述 |
| stage2 | 范围分析、任务类型判断 | 具体实现方案 |
| stage3 | 执行计划、任务拆分 | 研发实施 |
| stage4 | 资料补充 | 研发实施 |
| stage5 | 代码修改、技能调用 | 验证、文档更新 |
| stage6 | 验证执行 | 代码修改（回 stage5） |
| stage7 | 文档同步 | 验证、代码修改 |
| stage8 | 交付确认 | 研发实施（回 stage5） |

**处理原则**：用户可提供任何内容，AI只处理当前阶段需要的，其他记录到上下文。

---

# 循环路径汇总

| 阶段 | 下一阶段 | 用户修改时 | 自动衔接 |
| --- | --- | --- | --- |
| stage0 | stage1 | 无 | ✅ |
| stage1 | stage2 | 保持stage1循环 | ❌ 等待确认 |
| stage2 | stage3/4 | 保持stage2循环 | ❌ 等待确认 |
| stage3 | stage4 | 回stage2 | ✅ |
| stage4 | stage5 | 可跳过 | ✅ |
| stage5 | stage6 | stage8统一处理 | ✅ |
| stage6 | stage7 | 不暂停 | ✅ |
| stage7 | stage8 | 不暂停 | ✅ |
| stage8 | 完成 | 回stage5重置 | ❌ 等待确认 |

---

# 执行顺序（最重要）

**收到用户输入后**：
1. **读取配置文件** `{project_ide_dir}/.fw-session-config.json`
2. **读取状态文件** `{project_ide_dir}/rules/fw-session-state.md` → 获取活跃任务列表
3. **从用户输入中提取任务ID**（新会话任务关联）：
   | 模式 | 动作 |
   | --- | --- |
   | 用户输入包含 `任务ID: task_xxxxxxxx` | 提取 → 继续该任务 |
   | 用户输入引用的 AI 输出包含任务ID | 从引用中提取 → 继续该任务 |
   | 无任务ID引用 | **创建新任务** → 生成新任务ID → 从 Stage 0 开始 |
4. **根据阶段处理输入**：
   | 阶段 | 状态 | 输入类型 | 处理 |
   | --- | --- | --- | --- |
   | stage8 | waiting | 修改内容 | **先更新状态为stage5 + 重置阶段** |
   | stage8 | waiting | "继续" | 标记完成 |
   | stage1-7 | waiting | 任何内容 | 执行当前阶段回复处理 |
   | completed | - | 新需求 | 生成新任务ID → stage0 |

5. **执行阶段动作** → 禁止跳过状态更新

---

# 状态文件说明

状态文件 `fw-session-state.md` 包含：
- 活跃任务列表
- 各任务的当前状态（阶段、状态、下一步）
- 阶段进度（已完成/进行中/待完成/待重新执行）

详见状态文件模板 `fw-session-state.template.md`。