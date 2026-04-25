# Project UI Skill Template

## Frontmatter

- `name`: `<project-slug>-<ui-skill-slug>-skill`
- `description`: Current project UI library or design system explanation skill. Used in `<project-name>` to continue locating `<ui-framework-name>` component entry, usage boundaries, substitution rules, version info, and refresh conditions.

## Recommended Structure

### 1. UI Library Positioning

- Belongs to project:
- UI library name:
- UI library type: `General | Custom`
- UI library version:
- Material source: `User provided skills | User provided docs | Source code analysis`
- Has user explicitly confirmed: `Yes | No`
- If version blank, use latest version: `Yes | No`
- Applicable scope:

### 2. Directory and Entry

| Object | Location | Description |
| --- | --- | --- |
| Component main entry |  |  |
| Style entry |  |  |
| Theme entry |  |  |
| Icon entry |  |  |
| Docs entry |  |  |

### 3. Usage Rules

- Component selection priority:
- Common component mapping:
- Secondary encapsulation rules:
- Style override rules:
- Theme variable rules:
- Forbidden direct usage capabilities:
- Substitution strategy:

### 4. Development Boundaries

- Directly reusable scenarios:
- Must check docs or skill first scenarios:
- Must fallback to source analysis scenarios:
- Boundary with business components:

### 5. Regression Focus

- Component regression:
- Theme and style regression:
- Compatibility regression:
- Documentation sync requirements:

### 6. Skill Validity and Refresh Conditions

- Current skill coverage project boundaries:
- Direct reuse conditions:
- Must-refresh signals:
- Prioritized directories, docs, or configs to check during refresh:

## Usage Requirements

- Current project's UI library skill defaults to `<shared-skill-root>/<project-slug>/ui/<ui-skill-slug>/SKILL.md`.
- If user directly provides UI library skills, prioritize archiving and reuse, don't regenerate.
- If user only provides UI library docs, first generate from docs, then supplement entries and boundaries with repository evidence.
- Only after user explicitly says not providing UI library skills/docs, and workspace has analyzable custom UI library source, can generate skill from source.
- If user already gave UI library name, default treat as dependency name known; if version not given, can use latest version, don't pre-ask install location, local path, or source.
- Only when subsequent install, import, or build verification fails, then explain to user what package name, version, source, or path needs supplementing.
- When needing user to supplement docs, skills, paths, or component rules, use plain text reply guidance, clearly tell user what can be provided; can also add "If you temporarily don't provide, please reply continue/skip, I'll record risk and proceed".
- Don't write one-time page implementation details into UI library skill, only retain stable component rules, entries, boundaries, and refresh conditions.