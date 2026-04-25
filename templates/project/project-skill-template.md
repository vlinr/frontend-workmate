# Project Skill Template

## Directory Concept Explanation

Project skill storage location is detailed in `SKILL.md` under "Directory Concept Mapping Table". Project skills are stored in [Skill Directory] (same level as [Current Skill Directory]), not [Work Directory] or [Code Change Directory].

## Frontmatter

- `name`: Fixed project skill name, currently default uses `fw-project-develop`
- `description`: Project explanation skill, used for continuing to locate directories, routing, interfaces, state, styles, build, verification, and documentation update rules.

## Recommended Structure

### 1. Project Positioning

- Project name:
- Project purpose:
- Applicable scope:
- Project type: `SPA | MPA | SSR | Hybrid | Micro-frontend`
- Runtime environment: `Web | Mobile | Desktop | Electron`

### 2. Directory Routing

| Development Object | Priority Directory | Description |
| --- | --- | --- |
| Pages |  |  |
| Components |  |  |
| Routes |  |  |
| API / Service |  |  |
| State Management |  |  |
| Styles |  |  |
| Internationalization |  |  |
| Build Config |  |  |
| Static Resources |  | Images, fonts, icons, etc. |
| Type Definitions |  | TypeScript type files |

### 3. Tech Stack Constraints

| Constraint Item | Specific Value | Source |
| --- | --- | --- |
| Base Framework |  | package.json / config file |
| Base Framework Version |  | package.json |
| Language Framework |  | e.g., Vite, Webpack |
| Language Framework Version |  | package.json |
| Language | TypeScript / JavaScript |  |
| UI Library Type | General Library / Custom Library |  |
| UI Library Name |  | package.json |
| UI Library Version |  | package.json |

### 4. Design Specifications (Frontend-Specific)

#### 4.1 Color Scheme

| Color Type | Primary Value | CSS Variable Name | Usage |
| --- | --- | --- | --- |
| Primary |  | --color-primary | Main buttons, key elements |
| Primary Light |  | --color-primary-light | hover state |
| Primary Dark |  | --color-primary-dark | active state |
| Secondary |  | --color-secondary | Secondary buttons |
| Success |  | --color-success | Success messages |
| Warning |  | --color-warning | Warning messages |
| Error |  | --color-error | Error messages |
| Info |  | --color-info | Info messages |
| Background |  | --color-bg | Page background |
| Text Primary |  | --color-text-primary | Main text |
| Text Secondary |  | --color-text-secondary | Secondary text |
| Border |  | --color-border | Borders |
| Link |  | --color-link | Links |

**Color Source**: `Design specs / Design system docs / CSS variable files / tailwind.config.js`

#### 4.2 Typography Specifications

| Font Type | Font Name | CSS Variable Name | Usage Scenario |
| --- | --- | --- | --- |
| Primary Font |  | --font-family-primary | Body content |
| Secondary Font |  | --font-family-secondary | Headings, emphasis |
| Code Font |  | --font-family-code | Code display |

**Font Size Specifications**:
- Heading H1: `px / rem`
- Heading H2: `px / rem`
- Body: `px / rem`
- Small: `px / rem`

#### 4.3 Spacing Specifications

| Spacing Level | Pixel Value | CSS Variable Name | Usage Scenario |
| --- | --- | --- | --- |
| xs | 4px | --spacing-xs | Minimal spacing |
| sm | 8px | --spacing-sm | Small spacing |
| md | 16px | --spacing-md | Medium spacing |
| lg | 24px | --spacing-lg | Large spacing |
| xl | 32px | --spacing-xl | Extra large spacing |

#### 4.4 Responsive Breakpoints

| Breakpoint Name | Width Range | CSS Variable Name | Device Type |
| --- | --- | --- | --- |
| xs | < 576px |  | Mobile |
| sm | ≥ 576px |  | Small tablet |
| md | ≥ 768px |  | Tablet |
| lg | ≥ 992px |  | Small laptop |
| xl | ≥ 1200px |  | Large laptop |
| xxl | ≥ 1600px |  | Extra large screen |

### 5. Code Standards (Frontend-Specific)

#### 5.1 Naming Standards

| Naming Object | Naming Rule | Example |
| --- | --- | --- |
| Component File | PascalCase | `UserProfile.tsx` |
| Page File | PascalCase or kebab-case | `HomePage.tsx` / `home-page.tsx` |
| Style File | Same as component + `.style` | `UserProfile.style.ts` |
| Hook File | camelCase + `use` prefix | `useUserProfile.ts` |
| Utility Function | camelCase | `formatDate.ts` |
| Type File | PascalCase + `.types` | `User.types.ts` |
| Constant File | camelCase + `.const` | `api.const.ts` |
| CSS Class Name | kebab-case or BEM | `.user-profile` / `.user-profile__title` |
| CSS Variable | kebab-case + `--` prefix | `--color-primary` |

#### 5.2 TypeScript Standards

| Standard Item | Constraint Content |
| --- | --- |
| Type Definition Location | `types/` directory or component-level `.types.ts` |
| Interface Naming | `I` prefix or no prefix, e.g., `IUser` or `User` |
| Type Alias Naming | No prefix, e.g., `UserType` |
| Generic Naming | Single letter `T` or descriptive name `TData` |
| Strict Mode | `strict: true` |
| Forbidden Types | `any` / `unknown` (unless necessary) |

#### 5.3 Component Standards

| Standard Item | Constraint Content |
| --- | --- |
| Component Structure | Imports → Type definitions → Component → Styles → Export |
| Props Definition | Use interface or type |
| Default Props | Use defaultProps or default parameters |
| Component Export | Named export `export const Xxx` or `export default` |
| Component Comments | Must include purpose explanation |

### 6. Style Solutions (Frontend-Specific)

| Style Solution | In Use | Config File |
| --- | --- | --- |
| CSS Modules | Yes / No |  |
| CSS-in-JS (styled-components) | Yes / No |  |
| CSS-in-JS (emotion) | Yes / No |  |
| Tailwind CSS | Yes / No | tailwind.config.js |
| Sass / SCSS | Yes / No |  |
| Less | Yes / No |  |

**Style Variable File Location**: `variables.scss / theme.ts / tailwind.config.js`

### 7. Common Capabilities (Frontend-Specific)

#### 7.1 Common Component List

| Component Name | Path | Feature Description |
| --- | --- | --- |
|  |  |  |

#### 7.2 Common Hooks

| Hook Name | Path | Feature Description |
| --- | --- | --- |
|  |  |  |

#### 7.3 Common Utility Functions

| Function Name | Path | Feature Description |
| --- | --- | --- |
|  |  |  |

#### 7.4 Common Type Definitions

| Type Name | Path | Feature Description |
| --- | --- | --- |
|  |  |  |

### 8. Special Handling Features (Frontend-Specific)

#### 8.1 Error Handling Patterns

| Scenario | Handling Method | Code Example Location |
| --- | --- | --- |
| API Error |  |  |
| Form Validation Error |  |  |
| Route Error |  |  |
| Global Error Boundary |  |  |

#### 8.2 Async Handling Patterns

| Scenario | Handling Method | Code Example Location |
| --- | --- | --- |
| API Request | async/await or Promise |  |
| Loading State | loading state variable |  |
| Data Caching |  |  |

#### 8.3 Form Handling Patterns

| Scenario | Handling Method | Library Used |
| --- | --- | --- |
| Form Validation |  | react-hook-form / formik / custom |
| Form Submission |  |  |
| Form Reset |  |  |

#### 8.4 Permission Handling Patterns

| Scenario | Handling Method | Code Example Location |
| --- | --- | --- |
| Route Permission |  |  |
| Button Permission |  |  |
| Data Permission |  |  |

#### 8.5 Internationalization Handling Patterns

| Scenario | Handling Method | Library Used |
| --- | --- | --- |
| Text Internationalization |  | i18next / react-intl / custom |
| Date Internationalization |  |  |
| Number Internationalization |  |  |

### 9. Project Constraints

- Project skill source:
- Has user explicitly confirmed: `Yes | No`
- Project skill update time:
- Project skill refresh basis:
- Route integration rules:
- Permission rules:
- API / Service constraints:
- State management constraints:
- Build and release constraints:

### 10. Development Priorities

- Common capabilities to prioritize for reuse:
- Directory-level documentation priority:
- Areas requiring careful modification:
- Forbidden modification areas:

### 11. Regression Focus

- Functional regression:
- Permission regression:
- Build regression:
- Documentation sync requirements:
- Style regression:

### 12. Skill Validity and Refresh Conditions

- Current skill coverage project boundaries:
- Conditions for direct reuse:
- Signals requiring refresh:
- Prioritized directories or configs to check during refresh:
- Associated UI framework skill refresh rules:

## Usage Requirements

- Project skill artifact must be a **directory** (matching skill directory structure), directory name fixed as `fw-project-develop/`, entry file as `SKILL.md`
- **Storage Location**: Stored in [Skill Directory] (same level as [Current Skill Directory]), not [Work Directory] or [Code Change Directory]. See `SKILL.md` "Directory Concept Mapping Table"
- frontmatter `name` fixed as `fw-project-develop`, subsequent phases default to referencing by this fixed skill name.
- **Frontend-specific content must be extracted from actual code**:
  - Color scheme: Extract from CSS variables, tailwind.config.js, design specs
  - Naming standards: Summarize from existing file naming patterns
  - Component standards: Summarize from existing component code structure
  - Common capabilities: Extract from `components/`, `hooks/`, `utils/` directories
  - Special handling: Identify patterns from existing code
- **Do not fabricate frontend-specific info**: If corresponding content doesn't exist in project, mark `not_applicable`, do not fabricate
- If user already provided project skills, prioritize absorbing and archiving, then judge if refresh needed.
- If user already provided project docs (including design specs, design system docs), prioritize extracting design standards from docs.
- If `fw-project-develop` corresponding skill already exists, Stage 1 default goal is to check if update needed, not produce extra scan summary.
- If user subsequently supplements project docs, project skills, or project constraints, these should continue merging into fixed skill name artifact `fw-project-develop`, not create temporary conclusions.
- If no existing project skills found, Stage 1 must first ask user if willing to provide project skills or project docs; only after user explicitly says no, can proceed with repository evidence-based analysis to generate initial `fw-project-develop`.
- In this inquiry scenario, default prompt: `You can directly reply with the content you provide, I will prioritize using your materials to generate project skill; if you don't provide, I'll continue analyzing based on repository content and generate.`
- If project doesn't have frontend engineering and user requests initialization, must wait for user to explicitly provide base framework, language framework, language, UI library, etc. initialization combo, then create project and fill into project skill; if version missing, can tentatively use latest version.
- Only completing project initialization or dependency installation doesn't constitute Stage 1 completion; must first form `fw-project-develop`, and let user confirm project baseline is correct, before leaving Stage 1.
- If user hasn't explicitly answered about project materials, initialization plan, or UI library docs/skills conclusion, corresponding fields remain `pending confirmation`, AI cannot self-infer.
- If project uses custom UI library, can use `project-ui-skill-template` to produce associated UI skill artifact.
- Then consolidate stable project knowledge into `fw-project-develop`, ensuring subsequent default referencing by fixed skill name.
- Don't write one-time task conclusions into project skill, only retain reusable stable knowledge.
- Don't write current single task's temporary goals, page-level implementation plans, style migration preferences, or local tech choices into project skill.
- If user supplements "how to do this task" during Stage 1, should record into current task context, not into `fw-project-develop`.