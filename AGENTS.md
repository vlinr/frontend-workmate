# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-24
**Commit:** Latest
**Branch:** main

## OVERVIEW

**frontend-workmate** is a full-stack frontend development orchestration skill pack using a skill-driven architecture. It standardizes execution of Bug fixes, Feature implementations, Refactoring, and other frontend development tasks through a 9-phase workflow.

Core Design Principles:
- **Three Core Directories**: User project directory, project IDE config directory, static resources directory
- **Skill-Driven**: Built-in 10 reusable skills, automatically invoked based on conditions
- **Smart Fallback**: Automatically determines fallback phase based on user feedback
- **Multi-task Concurrency**: Supports simultaneous processing of multiple development tasks

---

## STRUCTURE

```
frontend-workmate/
├── SKILL.md                        # Master orchestration protocol (highest priority)
├── AGENTS.md                       # Project knowledge base
├── README.md                       # Usage documentation
│
├── scripts/
│   └── init-skills.js              # Initialization script (generates config, syncs skills)
│
├── stages/                         # 9 phase definitions
│   ├── index.md                    # Phase index and master process table
│   ├── init.md                     # Stage 0: Initialization
│   ├── project-scan.md             # Stage 1: Project Scan
│   ├── scope-analysis.md           # Stage 2: Scope Analysis
│   ├── plan.md                     # Stage 3: Execution Plan
│   ├── supply.md                   # Stage 4: Material Supply
│   ├── implementation.md           # Stage 5: Implementation
│   ├── verification.md             # Stage 6: Verification
│   ├── docs.md                     # Stage 7: Documentation Sync
│   └── delivery.md                 # Stage 8: Delivery
│
├── rules/                          # Process rules
│   ├── frontend-orchestrator.md    # Core chain rules
│   ├── frontend-change-scope.md    # Scope analysis rules
│   ├── frontend-implementation.md  # Implementation rules
│   ├── frontend-verification.md    # Verification rules
│   ├── directory-doc-sync.md       # Documentation sync rules
│   └── fw-project-develop.md       # Project skill template rules
│
├── skills/
│   └── curated/                    # Built-in reusable skills (10)
│       ├── fw-react-best-practices/   # React best practices
│       ├── fw-react-components/       # React component standards
│       ├── fw-systematic-debugging/   # Systematic debugging
│       ├── fw-typescript-advanced-types/  # TypeScript advanced types
│       ├── fw-accessibility/          # WCAG accessibility
│       ├── fw-web-design-guidelines/  # UI guidelines
│       ├── fw-task-plan-checkpoint/   # Long task checkpoint resume
│       ├── fw-code-analysis-doc/      # Code analysis documentation
│       ├── skill-creator/          # Skill creation tool
│       └── find-skills/            # Skill discovery
│
├── templates/                      # Artifact templates
│   ├── fw-skill-rule.template.md      # Rule file template
│   ├── fw-session-state.template.md   # State file template
│   ├── analysis/                    # Analysis artifact templates
│   ├── delivery/                    # Delivery artifact templates
│   ├── docs/                        # Documentation templates
│   ├── intake/                      # Input templates
│   ├── project/                     # Project skill templates
│   ├── task/                        # Task templates
│   └── verification/                # Verification templates
│
└── prd-ux-code/                    # UX code conversion (extension module)
```

---

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Understand master process | `SKILL.md` | 9-phase workflow definition, gate rules |
| Phase index | `stages/index.md` | Master process table, explicit confirmation points, automatic transitions |
| Project Scan | `stages/project-scan.md` | Stage 1 project skill generation |
| Scope Analysis | `stages/scope-analysis.md` | Stage 2 bug/feature/refactor classification |
| Implementation | `stages/implementation.md` | Stage 5 code modification |
| Verification | `stages/verification.md` | Stage 6 functional verification |
| Documentation Sync | `stages/docs.md` | Stage 7 directory documentation |
| Delivery | `stages/delivery.md` | Stage 8 smart fallback |
| React best practices | `skills/curated/fw-react-best-practices/` | 40+ rules |
| Systematic debugging | `skills/curated/fw-systematic-debugging/` | Root cause tracing methodology |
| Accessibility | `skills/curated/fw-accessibility/` | WCAG 2.2 compliance |
| TypeScript advanced types | `skills/curated/fw-typescript-advanced-types/` | Generics, conditional types |
| Long task checkpoint resume | `skills/curated/fw-task-plan-checkpoint/` | Checkpoint resume mechanism |
| Initialization script | `scripts/init-skills.js` | Config generation, skill sync |

---

## THREE CORE DIRECTORIES

**Config file only stores 3 core directory paths**:

| Directory Concept | Config Field | Description |
| --- | --- | --- |
| User project root directory | `project_work_dir` | User-opened directory |
| Project IDE config directory | `project_ide_dir` | Stores project config, skills, rules, state |
| Static config root directory | `static_config_dir` | IDE config root directory, stores static skills, static rules |

**Path Concatenation Rules**:

| Reference Type | Concatenation Method |
| --- | --- |
| Static skill | `{static_config_dir}/skills/{skill_name}/SKILL.md` |
| Static rule | `{static_config_dir}/rules/{rule_name}.md` |
| Project skill | `{project_ide_dir}/skills/fw-project-develop/SKILL.md` |
| Project rule | `{project_ide_dir}/rules/fw-skill-rule.md` |
| Project state | `{project_ide_dir}/rules/fw-session-state.md` |

---

## CONVENTIONS

- **Skill definition**: All skills use `SKILL.md` file, YAML frontmatter must contain `name`, `description`
- **Project skill name**: Stage 1 artifact is fixed as `fw-project-develop`
- **Phase state**: Must maintain state file `fw-session-state.md`
- **Config file**: Only stores 3 core directory paths, other paths via concatenation
- **Automatic transition**: Stage 5→6→7→8 automatic transition, no user confirmation wait
- **Explicit confirmation**: Stage 1, 2, 8 completion waits for user confirmation
- **Prohibit fabrication**: Project non-existent capabilities marked as `not_applicable`

---

## ANTI-PATTERNS (THIS PROJECT)

| Pattern | Location | Rule |
|---------|----------|------|
| Must not rewrite process | `SKILL.md` | Must treat this file as highest priority execution protocol |
| Must not skip skills | `stages/*.md` | Required skills marked in each phase cannot be skipped |
| Must not fabricate capabilities | `SKILL.md` | Project non-existent capabilities cannot be fabricated |
| Must not ask ahead | `stages/init.md` | Stage 0 prohibits asking implementation details |
| Must not override original requirements | `SKILL.md` | Phase supplement constraints cannot rewrite original requirement anchor |
| NO FIXES WITHOUT ROOT CAUSE | `skills/curated/fw-systematic-debugging/` | Must find root cause before debugging |
| NEVER fix just the symptom | `skills/curated/fw-systematic-debugging/` | Fixing symptoms not root cause is failure |

---

## UNIQUE STYLES

- **English documentation**: Skill files and rules are in English; README.md supports bilingual (Chinese/English) switching
- **Mermaid flowcharts**: Use Mermaid to define 9-phase transition relationships
- **Skill invocation matrix**: Explicit skill list required for each phase
- **Three core directories design**: Config file only stores 3 paths, others via concatenation
- **Smart fallback**: Automatically determines fallback phase based on user feedback

---

## COMMANDS

```bash
# Initialization (recommended parameters - workdir auto-detected from script location)
node scripts/init-skills.js

# Preview mode
node scripts/init-skills.js --dry-run

# Specify source skill directories
node scripts/init-skills.js --dirs curated,external
```

---

## NOTES

- Skill source priority: User provided > Project skill > Public skill pack
- Project skill artifact name unified as `fw-project-develop`
- Supports global install and in-project install
- Supports 15+ IDE directory names (`.trae`, `.cursor`, `.opencode`, etc.)