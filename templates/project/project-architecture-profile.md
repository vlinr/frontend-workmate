# Project Architecture Profile Template

## 1. Project Overview

- Project name:
- Project positioning:
- Is multi-frontend sub-projects: `Yes | No`
- Frontend project root directory under [Work Directory]:
- Main tech stack:
- Base framework:
- Base framework version:
- Language framework:
- Language framework version:
- Language:
- UI library:
- UI library version:
- Project source: `User provided skills | User provided docs | Repository scan | Blank initialization`
- Is blank project: `Yes | No`
- Does frontend project exist: `Yes | No`
- If no frontend project, should initialize: `Yes | No | Skip`
- Initialization combo: `Base framework + Language framework + Language + UI library`
- UI library type: `General | Custom | not_applicable`
- UI library name:
- UI library version:
- UI library main entry:
- UI library material source: `User provided skills | User provided docs | Source code analysis | not_applicable`

## 2. Condition Judgment Checklist

Before filling the following content, first judge whether the project truly has corresponding structure or capability; if not, mark as `not_applicable`, don't fabricate info for template completeness.

| Logic Domain | Exists | Judgment Condition | If Not Exists, How to Handle |
| --- | --- | --- | --- |
| Multi-frontend sub-projects | `yes | no` | Multiple independently startable/buildable frontend projects in [Work Directory] | Mark `not_applicable`, only maintain single project profile |
| Route layer | `yes | no` | Project has centralized or conventional route entry | Mark `not_applicable`, explain page direct-connect or light route mode |
| State management layer | `yes | no` | Exists store, model, context, redux/rematch, zustand, etc. | Mark `not_applicable`, explain primarily local state |
| Internationalization layer | `yes | no` | Exists locale, language packs, translation functions, multilingual config | Mark `not_applicable`, explain project has no internationalization requirement |
| Build rewrite layer | `yes | no` | Exists webpack/vite/cra rewrite config, custom build chain | Mark `not_applicable`, only retain basic build commands |
| OEM / Multi-variant | `yes | no` | Exists brand config, differential packaging, runtime brand judgment | Mark `not_applicable`, don't add OEM-related conclusions |
| alias | `yes | no` | Exists tsconfig paths, webpack alias, vite alias | Mark `not_applicable`, explain by relative path |
| Mock / Integration environment | `yes | no` | Exists mock scripts, proxy config, integration environment convention | Mark `not_applicable`, only retain basic startup method |
| UI framework | `yes | no` | Exists general UI library or custom UI component system | Mark `not_applicable`, don't fabricate framework constraints |
| Custom UI framework | `yes | no` | UI capability primarily from custom component library or design system within [Work Directory] | Mark `not_applicable`, only retain general framework info |

## 3. Sub-Project List

| Sub-Project | Purpose | Tech Stack | Entry | Start Command | Build Command |
| --- | --- | --- | --- | --- | --- |
| `<sub-project>` |  |  |  |  |  |

## 4. Directory Structure Summary

| Directory | Purpose | Development Focus |
| --- | --- | --- |
| `src/` |  |  |
| `src/pages/` |  |  |
| `src/components/` |  |  |
| `src/service/` |  |  |
| `src/models/` |  |  |

## 5. Key Entries

- Application entry exists:
- Application entry:
- Route entry exists:
- Route entry:
- API config entry exists:
- API config entry:
- State management entry exists:
- State management entry:
- Internationalization entry exists:
- Internationalization entry:
- Style entry exists:
- Style entry:
- Build config entry exists:
- Build config entry:

## 6. Architecture Constraints

- UI component selection rules:
- UI framework identification rules:
- UI framework version identification basis:
- Custom UI framework directory entry:
- Custom UI framework skill archive path:
- UI framework skill refresh signals:
- Route integration rules:
- API and service constraints:
- State management constraints:
- Internationalization constraints:
- Style constraints:
- Build and release constraints:

## 7. Development Commands

| Scenario | Command | Description |
| --- | --- | --- |
| Install dependencies |  |  |
| Local start |  |  |
| Test |  |  |
| Build |  |  |
| Code quality |  |  |

## 8. Risks and Boundaries

- High-frequency risk points:
- Historical compatibility points:
- Forbidden direct modification areas:
- Integration dependencies:

## 9. Output Conclusions

- Generated or refreshed project skill path:
- Generated or refreshed UI framework skill path:
- Recommended project skill to prioritize:
- Recommended UI framework skill to prioritize:
- Project knowledge needing supplementation:
- Can proceed to requirement analysis: `Yes | No`