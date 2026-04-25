---
name: fw-code-analysis-doc
description: General code analysis and documentation skill. Triggered when users request "analyze function/file/component/module/feature and generate documentation", also used in the documentation sync phase after code development or modification is complete. Applicable to frontend, backend, and general code directories. Executes "implementation interpretation + repository-wide reference retrieval + special usage extraction + case-based explanation", outputs or updates maintainable Markdown usage documentation in target directory for subsequent AI reuse.
---

# Code Analysis Doc

Execute the following workflow and produce documentation directly.

## 0) Trigger Conditions

- This skill should be triggered in the following scenarios:
  - User explicitly requests code analysis and documentation generation.
  - User requests supplementation, revision, or synchronization of module documentation.
  - AI completes code development or modification and enters the delivery/closing phase.
- In "post-development/modification closing" scenarios, must execute documentation sync judgment:
  - If target directory already has corresponding documentation, perform incremental update.
  - If target directory lacks corresponding documentation, create new file with complete explanation.

## 1) Identify Analysis Target and Output Path

- Identify analysis target: function, file, component, page, service, module, directory.
- If user provides specific path, prioritize outputting documentation under that path.
- Default document name: `README.md`; if directory already has similar documentation, update existing file rather than create multiple versions.
- If triggered by "post-development/modification closing", first determine target document path based on change scope:
  - Component/module-level changes: prioritize corresponding directory `README.md`
  - Cross-directory changes: update respective documentation by main modified modules

## 2) Code Research (Implementation + References)

- First read target implementation, extract:
  - Core purpose
  - Input/output (parameters/returns/props/return structure)
  - Internal dependencies (hooks, services, stores, configurations)
  - Key flows (data flow, render flow, interaction flow)
- Then query repository-wide reference patterns, must cover:
  - Typical integration patterns (most common usage)
  - Variant patterns (parameter differences, context differences, lifecycle differences)
  - Special/boundary usage (fallback logic, conditional branches, compatibility handling)
  - Common constraints and implicit contracts
- Reference research output requirements:
  - Provide 2-4 "representative reference points" (don't list all files exhaustively)
  - For each reference point, explain "why it represents a pattern"
  - Must include at least 1 special or boundary usage reference
  - Each reference point must include "key code snippet" (10-40 lines, preserving core parameters and call context)
  - Below code snippet, only annotate "source scenario name/pattern name", not filenames, paths, or line numbers

## 3) Extract Stable Rules and Reference Conclusions

- Only retain "long-term stable" knowledge:
  - Purpose and boundaries
  - Applicable/non-applicable scenarios
  - Interface contracts and required fields
  - Notes and common errors
- Merge "implementation logic" with "reference behavior" into rules:
  - Which parameters/preconditions are universally relied upon by callers
  - Which patterns only work in specific scenarios
  - Which special usages are reusable, which should only be cautiously referenced
- Avoid accumulating high-volatility information:
  - Don't write exhaustive call file lists
  - Don't write easily-expiring statistics
  - Don't write temporary branch information

## 4) Document Structure Template

Organize document content in the following order:

1. Purpose and Function
2. Applicable Scenarios
3. External Contracts (parameters, returns, dependencies)
4. In-Project Reference Analysis (representative references + pattern explanation)
5. Usage Rules (summarized by pattern)
6. Usage Examples (2-3, at least 1 special usage example)
7. Notes (stable, actionable)

## 5) Writing Standards

- Use concise English, preserve technical terms as original code names.
- Present examples as copyable code blocks, prioritize minimal working examples.
- Examples must "derive from real reference patterns", prohibit purely fabricated examples.
- Reference analysis must include real code snippets, prohibit paths, filenames, or line number links.
- If positioning info needed, only use "scenario tag + key parameters/key calls" description.
- Conclusions should be actionable, avoid vague descriptions.
- If uncertain behavior exists, annotate "depends on caller constraints" and explain impact.

## 6) Delivery Checklist

- Documentation written to user-specified directory.
- Content covers "purpose, scenarios, reference analysis, examples, notes".
- Includes at least 1 special/boundary usage explanation and example.
- Each representative reference in "in-project reference analysis" includes code snippet and scenario explanation.
- Documentation does not contain paths, filenames, line number links or other volatile positioning info.
- No high-volatility list information.
- Consistent with current code implementation.
- If this task includes code development or modification, completed "update if exists, create if absent" documentation sync action.