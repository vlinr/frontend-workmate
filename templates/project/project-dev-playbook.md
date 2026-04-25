# Project Dev Playbook Template

## 1. Development Positioning

- Project name:
- Applicable scope:
- Default development order:
- Project skill source:
- UI library skill source:

## 2. Directory Positioning Rules

| Development Object | Priority Directory | Description |
| --- | --- | --- |
| Pages |  |  |
| Components |  |  |
| Routes |  |  |
| API Constants |  |  |
| Service |  |  |
| State Management |  |  |
| Internationalization |  |  |
| Styles |  |  |
| Build Config |  |  |

## 3. Component and Framework Selection

- Existing business component priority:
- Base UI library priority:
- Base framework:
- Base framework version:
- Language framework:
- Language framework version:
- Language:
- UI library type: `General | Custom | not_applicable`
- UI library name:
- UI library version:
- UI library main entry:
- UI library skill path:
- UI library docs or source entry:
- Fallback strategy:
- Component docs check rules:
- If version blank, use latest version: `Yes | No`

## 4. Condition Judgment Checklist

Before filling the following sections, first judge whether the project truly has corresponding logic; if not, mark `not_applicable`, don't fabricate for template completeness.

| Logic Domain | Exists | Judgment Condition | If Not Exists, How to Handle |
| --- | --- | --- | --- |
| Route permission | `yes | no` | Route config has `authority`, login state, menu visibility, redirect control | Mark `not_applicable`, only retain basic route explanation |
| Button/action permission | `yes | no` | Page, table, action column has permission control, show/hide control, disable control | Mark `not_applicable`, don't fabricate permission points |
| Data permission | `yes | no` | Query conditions, API params, return results controlled by user role or scope | Mark `not_applicable`, note in risk items no data scope control |
| OEM / Multi-variant | `yes | no` | Exists `oem`, brand config, differential packaging scripts, runtime brand judgment | Mark `not_applicable`, don't generate OEM section details |
| alias | `yes | no` | Build config, tsconfig, webpack/vite config has path aliases | Mark `not_applicable`, explain by relative path rules |
| Dynamic import | `yes | no` | Route or module has `import()`, lazy loading, on-demand chunking | Mark `not_applicable`, don't add dynamic import constraints |
| Internationalization | `yes | no` | User-visible text uses translation functions, language packs, or locale config | Mark `not_applicable`, explain project has no internationalization requirement |
| State management | `yes | no` | Project has store, model, context, redux/rematch state layer | Mark `not_applicable`, explain by local state |
| Mock / Integration | `yes | no` | Project has mock scripts, mock directory, proxy config, integration environment convention | Mark `not_applicable`, only retain basic startup and build commands |
| General UI framework | `yes | no` | Dependencies have antd, element, mui, chakra, etc. mature UI library | Mark `not_applicable`, turn to custom UI framework judgment |
| Custom UI framework | `yes | no` | Project has custom component library, design-system, ui-core, etc. independent system | Mark `not_applicable`, only record general UI framework |

## 5. Development Implementation Rules

### 5.1 Pages

- Page directory standards:
- Entry file standards:
- Private component standards:

### 5.1A UI Library

- Does this logic exist:
- UI library type:
- UI library name and version:
- UI library main entry:
- General UI library substitution boundary:
- Custom UI library directory entry:
- Custom UI library priority reuse rules:
- Custom UI library skill path:
- UI library material source:
- UI library skill refresh conditions:
- If name known but version missing, use latest: `Yes | No`
- If subsequent install or verification fails, ask user for source/path: `Yes | No`

### 5.2 Routes

- Does this logic exist:
- Route registration location:
- Route permission field:
- Menu field:
- Login exemption field:
- New window field:
- Redirect check point:

### 5.3 Permission and Access Control

- Does this logic exist:
- Page access permission rules:
- Button show/hide permission rules:
- Button disable permission rules:
- Table row action permission rules:
- Batch action permission rules:
- Data permission or scope control rules:
- Show vs disable usage boundary:
- Permission missing fallback behavior:

### 5.4 OEM / Multi-variant Logic

- Does this logic exist:
- Identification evidence:
- OEM identifier source:
- OEM config file:
- OEM packaging script:
- Build-time OEM branch location:
- Runtime OEM branch location:
- OEM resource differences:
- OEM text differences:
- OEM page or feature toggle differences:
- OEM regression check items:

### 5.5 API / Service

- API constant naming rules:
- Service encapsulation rules:
- Request parameter constraints:
- Response type constraints:

### 5.6 State Management

- Does this logic exist:
- Solution used:
- Model registration location:
- Page read method:
- Page dispatch method:

### 5.7 Internationalization

- Does this logic exist:
- User-visible text handling rules:
- Config text handling rules:
- Language pack maintenance requirements:

### 5.8 Styles

- Local style rules:
- Global style rules:
- Theme variable rules:

### 5.9 Import Aliases and Module Boundaries

- Does this logic exist:
- Identification evidence:
- Alias definition location:
- Common aliases:
- Relative path vs alias usage priority:
- Cross-layer reference restrictions:
- Dynamic import constraints:

### 5.10 Build and Integration

- Does Mock / integration special logic exist:
- Local integration command:
- Mock solution:
- Runtime config file:
- Build rewrite config file:
- Build verification command:
- Pre-release check items:

## 6. Regression Checklist

- Route permission and menu:
- Button show/hide and disable:
- Table row action and batch action permission:
- Build-time OEM branch behavior:
- Runtime OEM branch behavior:
- OEM resource and text differences:
- Alias and dynamic import:
- Permission and menu:
- Empty state and error state:
- API error codes:
- Pagination, filtering, navigation:
- Build and startup:

## 7. Common Risks

- Easy to miss entry modifications:
- Easy to miss permission configurations:
- Easy to miss build-time OEM branches:
- Easy to miss runtime OEM branches:
- Easy to miss button show/hide and disable differences:
- Easy to write wrong alias or import method:
- Easy to break compatibility logic:
- Links needing extra verification:

## 8. User Inquiry Supplement Rules

- When needing user to supplement docs, skills, paths, component rules, or constraint explanations, default use plain text reply guidance, don't make selectors.
- When finite solution branches exist, default also prioritize text list items; candidate items can use numbers, letters, or short labels, and clearly tell user can reply with corresponding marker, or directly input their own idea.
- Once inquiry or explanation issued, current reply should end and wait for user input, don't continue implementing within same reply.