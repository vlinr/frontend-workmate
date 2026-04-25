# Directory Doc Sync

## Outputs

- `templates/docs/directory-readme-template.md` under Current Skill Directory

## Workflow

1. Before Stage 7 formally starts, scan available skill sources: user-provided docs, the fixed project skill name resolved in Stage 1, existing directory docs, and other reusable skill packages
2. Collect the actual directories touched by Stage 5 code changes; documentation sync must be based on changed directories, not on the whole project
3. For each changed directory, determine the owning directory that should hold the local document; if the file itself already sits in the stable owning directory, use that directory directly
4. Read existing documentation first if present
5. If a target directory lacks clear docs or reference relationships are complex:
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
   - Dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md`
6. Summarize stable purpose, scenarios, contracts, usage rules, and examples for each changed directory
7. Create or update one directory-level document per changed directory
8. Keep only information that matches current implementation

## Rules

- Prefer directory-level consolidation over fragmented duplicate documents
- Do not generate a single project-wide document when the code changes only affect specific subdirectories
- If code changed in `src`, sync docs in `src`; if code changed in `src/aaa/ddd`, sync docs in `src/aaa/ddd`; if multiple directories changed, sync each unique directory in turn
- Use real project usage patterns instead of fabricated examples
- Sync docs after implementation or after explicit analysis requests