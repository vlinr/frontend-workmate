# Project Skill Template

## 目录概念说明

项目技能存放位置详见 `SKILL.md` 中的"目录概念映射表"。项目技能存放于【技能目录】（和【当前技能目录】同级），而非【工作目录】或【代码改动目录】。

## Frontmatter

- `name`: 固定项目技能名，当前默认使用 `fw-project-develop`
- `description`: 项目说明技能，用于继续定位目录、路由、接口、状态、样式、构建、验证与文档更新规则。

## 建议结构

### 1. 项目定位

- 项目名称：
- 项目用途：
- 适用范围：
- 项目类型：`SPA | MPA | SSR | Hybrid | 微前端`
- 运行环境：`Web | Mobile | Desktop | Electron`

### 2. 目录路由

| 研发对象 | 优先目录 | 说明 |
| --- | --- | --- |
| 页面 |  |  |
| 组件 |  |  |
| 路由 |  |  |
| API / Service |  |  |
| 状态管理 |  |  |
| 样式 |  |  |
| 国际化 |  |  |
| 构建配置 |  |  |
| 静态资源 |  | 图片、字体、图标等 |
| 类型定义 |  | TypeScript 类型文件 |

### 3. 技术栈约束

| 约束项 | 具体值 | 来源 |
| --- | --- | --- |
| 底层框架 |  | package.json / 配置文件 |
| 底层框架版本 |  | package.json |
| 语言框架 |  | 如 Vite、Webpack |
| 语言框架版本 |  | package.json |
| 语言 | TypeScript / JavaScript |  |
| UI 库类型 | 通用库 / 自研库 |  |
| UI 库名称 |  | package.json |
| UI 库版本 |  | package.json |

### 4. 设计规范（前端特有）

#### 4.1 配色方案

| 颜色类型 | 主色值 | CSS 变量名 | 用途 |
| --- | --- | --- | --- |
| 主色 |  | --color-primary | 主要按钮、重点元素 |
| 主色浅 |  | --color-primary-light | hover 状态 |
| 主色深 |  | --color-primary-dark | active 状态 |
| 次色 |  | --color-secondary | 辅助按钮 |
| 成功色 |  | --color-success | 成功提示 |
| 警告色 |  | --color-warning | 警告提示 |
| 错误色 |  | --color-error | 错误提示 |
| 信息色 |  | --color-info | 信息提示 |
| 背景色 |  | --color-bg | 页面背景 |
| 文字主色 |  | --color-text-primary | 主要文字 |
| 文字次色 |  | --color-text-secondary | 辅助文字 |
| 边框色 |  | --color-border | 边框 |
| 链接色 |  | --color-link | 链接 |

**配色来源**：`设计稿 / 设计系统文档 / CSS 变量文件 / tailwind.config.js`

#### 4.2 字体规范

| 字体类型 | 字体名称 | CSS 变量名 | 使用场景 |
| --- | --- | --- | --- |
| 主字体 |  | --font-family-primary | 正文内容 |
| 次字体 |  | --font-family-secondary | 标题、强调 |
| 代码字体 |  | --font-family-code | 代码展示 |

**字号规范**：
- 标题 H1：`px / rem`
- 标题 H2：`px / rem`
- 正文：`px / rem`
- 小字：`px / rem`

#### 4.3 间距规范

| 间距级别 | 像素值 | CSS 变量名 | 使用场景 |
| --- | --- | --- | --- |
| xs | 4px | --spacing-xs | 极小间距 |
| sm | 8px | --spacing-sm | 小间距 |
| md | 16px | --spacing-md | 中等间距 |
| lg | 24px | --spacing-lg | 大间距 |
| xl | 32px | --spacing-xl | 极大间距 |

#### 4.4 响应式断点

| 断点名称 | 宽度范围 | CSS 变量名 | 设备类型 |
| --- | --- | --- | --- |
| xs | < 576px |  | 手机 |
| sm | ≥ 576px |  | 小平板 |
| md | ≥ 768px |  | 平板 |
| lg | ≥ 992px |  | 小屏电脑 |
| xl | ≥ 1200px |  | 大屏电脑 |
| xxl | ≥ 1600px |  | 超大屏 |

### 5. 代码规范（前端特有）

#### 5.1 命名规范

| 命名对象 | 命名规则 | 示例 |
| --- | --- | --- |
| 组件文件 | PascalCase | `UserProfile.tsx` |
| 页面文件 | PascalCase 或 kebab-case | `HomePage.tsx` / `home-page.tsx` |
| 样式文件 | 同组件名 + `.style` | `UserProfile.style.ts` |
| Hook 文件 | camelCase + `use` 前缀 | `useUserProfile.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 类型文件 | PascalCase + `.types` | `User.types.ts` |
| 常量文件 | camelCase + `.const` | `api.const.ts` |
| CSS 类名 | kebab-case 或 BEM | `.user-profile` / `.user-profile__title` |
| CSS 变量 | kebab-case + `--` 前缀 | `--color-primary` |

#### 5.2 TypeScript 规范

| 规范项 | 约束内容 |
| --- | --- |
| 类型定义位置 | `types/` 目录或组件同级 `.types.ts` |
| 接口命名 | `I` 前缀或无前缀，如 `IUser` 或 `User` |
| 类型别名命名 | 无前缀，如 `UserType` |
| 泛型命名 | 单字母 `T` 或描述性名称 `TData` |
| 严格模式 | `strict: true` |
| 禁止类型 | `any` / `unknown`（除非必要） |

#### 5.3 组件规范

| 规范项 | 约束内容 |
| --- | --- |
| 组件结构 | 导入 → 类型定义 → 组件 → 样式 → 导出 |
| Props 定义 | 使用 interface 或 type |
| 默认 Props | 使用 defaultProps 或默认参数 |
| 组件导出 | 具名导出 `export const Xxx` 或 `export default` |
| 组件注释 | 必须包含用途说明 |

### 6. 样式方案（前端特有）

| 样式方案 | 是否使用 | 配置文件 |
| --- | --- | --- |
| CSS Modules | 是 / 否 |  |
| CSS-in-JS (styled-components) | 是 / 否 |  |
| CSS-in-JS (emotion) | 是 / 否 |  |
| Tailwind CSS | 是 / 否 | tailwind.config.js |
| Sass / SCSS | 是 / 否 |  |
| Less | 是 / 否 |  |

**样式变量文件位置**：`variables.scss / theme.ts / tailwind.config.js`

### 7. 公共能力（前端特有）

#### 7.1 通用组件列表

| 组件名 | 路径 | 功能描述 |
| --- | --- | --- |
|  |  |  |

#### 7.2 通用 Hooks

| Hook 名 | 路径 | 功能描述 |
| --- | --- | --- |
|  |  |  |

#### 7.3 通用工具函数

| 函数名 | 路径 | 功能描述 |
| --- | --- | --- |
|  |  |  |

#### 7.4 通用类型定义

| 类型名 | 路径 | 功能描述 |
| --- | --- | --- |
|  |  |  |

### 8. 特殊处理特征（前端特有）

#### 8.1 错误处理模式

| 场景 | 处理方式 | 代码示例位置 |
| --- | --- | --- |
| API 错误 |  |  |
| 表单验证错误 |  |  |
| 路由错误 |  |  |
| 全局错误边界 |  |  |

#### 8.2 异步处理模式

| 场景 | 处理方式 | 代码示例位置 |
| --- | --- | --- |
| API 请求 | async/await 或 Promise |  |
| 加载状态 | loading 状态变量 |  |
| 数据缓存 |  |  |

#### 8.3 表单处理模式

| 场景 | 处理方式 | 使用的库 |
| --- | --- | --- |
| 表单验证 |  | react-hook-form / formik / 自研 |
| 表单提交 |  |  |
| 表单重置 |  |  |

#### 8.4 权限处理模式

| 场景 | 处理方式 | 代码示例位置 |
| --- | --- | --- |
| 路由权限 |  |  |
| 按钮权限 |  |  |
| 数据权限 |  |  |

#### 8.5 国际化处理模式

| 场景 | 处理方式 | 使用的库 |
| --- | --- | --- |
| 文本国际化 |  | i18next / react-intl / 自研 |
| 日期国际化 |  |  |
| 数字国际化 |  |  |

### 9. 项目约束

- 项目技能来源：
- 是否已得到用户明确确认：`是 | 否`
- 项目技能更新时间：
- 项目技能刷新依据：
- 路由接入规则：
- 权限规则：
- API / Service 约束：
- 状态管理约束：
- 构建与发布约束：

### 10. 研发优先级

- 优先复用的公共能力：
- 目录级文档优先级：
- 需要谨慎修改的区域：
- 禁止修改的区域：

### 11. 回归重点

- 功能回归：
- 权限回归：
- 构建回归：
- 文档同步要求：
- 样式回归：

### 12. 技能有效性与刷新条件

- 当前技能覆盖的项目边界：
- 可直接复用的条件：
- 必须刷新的信号：
- 刷新时优先检查的目录或配置：
- 关联 UI 框架 skill 的刷新规则：

## 使用要求

- 项目技能产物必须是一个**目录**（符合技能目录结构），目录名固定为 `fw-project-develop/`，入口文件为 `SKILL.md`
- **存放位置**：存放于【技能目录】（和【当前技能目录】同级），而非【工作目录】或【代码改动目录】。详见 `SKILL.md` 中的"目录概念映射表"
- frontmatter `name` 固定为 `fw-project-develop`，后续阶段默认直接按该固定技能名引用。
- **前端特有内容必须从实际代码中提取**：
  - 配色方案：从 CSS 变量、tailwind.config.js、设计稿提取
  - 命名规范：从现有文件命名模式总结
  - 组件规范：从现有组件代码结构总结
  - 公共能力：从 `components/`、`hooks/`、`utils/` 目录提取
  - 特殊处理：从现有代码中识别模式
- **禁止虚构前端特有信息**：若项目中不存在对应内容，标记 `not_applicable`，不得虚构
- 若用户已提供项目 skills，则优先吸收并归档，再判断是否需要刷新。
- 若用户已提供项目文档（含设计稿、设计系统文档），则优先基于文档提取设计规范。
- 若当前已存在 `fw-project-develop` 对应技能，Stage 1 的默认目标是检查是否需要更新该文件，而不是额外产出一份扫描总结。
- 若用户后续补充项目文档、项目 skills 或项目约束，这些内容应继续合并到固定技能名产物 `fw-project-develop` 中，而不是另起临时结论。
- 若未发现现有项目 skills，Stage 1 必须先询问用户是否愿意提供项目 skills 或项目文档；只有在用户明确不提供后，才允许基于仓库证据内部分析生成首版 `fw-project-develop`。
- 在该询问场景下，默认提示语使用：`你可以直接回复提供的内容，我将优先采用您提供的资料生成项目的技能；如果你不提供，我再基于仓库内容继续分析并生成。`
- 若项目不存在前端工程且用户要求初始化，必须在用户明确给出底层框架、语言框架、语言、UI 库等初始化组合后，先创建项目并回填到项目技能；若版本缺失，可按最新版暂记。
- 仅完成项目初始化或依赖安装，不构成 Stage 1 完成；必须先形成 `fw-project-develop`，并让用户确认项目基线是否正确，才能离开 Stage 1。
- 若用户尚未明确回答项目资料、初始化方案或 UI 库文档/skills 结论，对应字段保留 `待确认`，不能由 AI 自行推断。
- 若项目使用自研 UI 库，可配合 `project-ui-skill-template` 沉淀关联 UI 技能产物。
- 再将稳定项目知识沉淀为 `fw-project-develop`，并保证后续默认通过固定技能名引用。
- 不把一次性任务结论写入项目技能，只保留可复用的稳定知识。
- 不把当前单次任务的临时目标、页面级实现方案、样式迁移偏好、局部技术选型写入项目技能。
- 若用户在 Stage 1 补充的是"这次任务怎么做"，应记录到当前任务上下文，而不是记录到 `fw-project-develop`。