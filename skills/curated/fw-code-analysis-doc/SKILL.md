---
name: fw-code-analysis-doc
description: General-purpose code analysis and documentation skill. Triggered when users request "analyze a function/file/component/module/feature and generate documentation", and also used in workflow stages that require "analyzing directory structure", "understanding module relationships", "generating directory documentation", or "documentation sync". Executes "implementation analysis + full-repo reference search + special usage extraction + example-driven documentation", then outputs or updates a maintainable Markdown reference guide in the target directory for subsequent AI reuse.
---

# Code Analysis Doc

Follow the process below and deliver the documentation directly.

## 0) When to Trigger

- This skill should be triggered in the following scenarios:
  - The user explicitly requests code analysis and documentation generation.
  - The user requests supplementation, revision, or sync of a module's documentation.
  - After AI completes code development or code changes, during the delivery wrap-up phase.
- In "post-development/post-change wrap-up" scenarios, a documentation sync determination must be executed:
  - If the target directory already has corresponding documentation, perform an incremental update.
  - If the target directory does not have corresponding documentation, create a new document and write the full description.

## 1) Identify the Analysis Target and Output Path

- Identify the analysis target: function, file, component, page, service, module, or directory.
- If the user has provided a specific path, prioritize outputting the document to that path.
- Default document name: `README.md`; if the directory already has a document of the same type, update the existing document rather than creating multiple versions.
- If triggered by "post-development/post-change wrap-up", first determine the target document path based on the scope of changes:
  - Component/module-level changes: prioritize the corresponding directory `README.md`
  - Cross-directory changes: update the corresponding document for each main changed module separately

## 2) Code Investigation (Implementation + References)

- First read the target implementation and extract:
  - Core purpose
  - Inputs and outputs (parameters/return values/props/return structure)
  - Internal dependencies (hooks, service, store, configuration)
  - Key flows (data flow, render flow, interaction flow)
- Then search the full repository for usage patterns, and must cover:
  - Typical integration patterns (most common usage)
  - Variant patterns (parameter differences, context differences, lifecycle differences)
  - Special/boundary usage (fallback logic, conditional branches, compatibility approaches)
  - Common constraints and implicit contracts
- Reference investigation output requirements:
  - Provide 2~4 "representative reference points" (do not enumerate all files)
  - For each reference point, explain "why it represents a pattern"
  - Include at least 1 special or boundary usage reference
  - Each reference point must include a "key code snippet" (10~40 lines, retaining core parameters and invocation context)
  - Below each code snippet, only annotate "source scenario name / pattern name" — do not write filenames, paths, or line numbers

## 3) Extract Stable Rules and Reference Conclusions

- Only retain "long-term stable" knowledge:
  - Purpose and boundaries
  - Applicable/non-applicable scenarios
  - Interface contracts and required fields
  - Notes and common errors
- Merge "implementation logic" and "reference behavior" into rules:
  - Which parameters/preconditions are universally depended upon by callers
  - Which approaches only apply in specific scenarios
  - Which special usages are reusable, and which should only be referenced with caution
- Avoid consolidating highly volatile information:
  - Do not write a full list of all calling files
  - Do not write easily outdated statistics
  - Do not write temporary branch information

## 4) Document Structure Template

Organize document content in the following order:

1. Purpose and function
2. Applicable scenarios
3. External contracts (parameters, return values, dependencies)
4. In-project reference analysis (representative references + pattern descriptions)
5. Usage rules (organized by pattern)
6. Usage examples (2~3, at least 1 special usage example)
7. Notes (stable and actionable)

## 5) Writing Standards

- Use concise English; keep technical terms as their original code names.
- Present examples as copyable code blocks, prioritizing minimal working examples.
- Examples must "originate from real reference patterns" — purely invented examples are prohibited.
- Reference analysis must include real code snippets — path, filename, and line number links are prohibited.
- If positioning information needs to be supplemented, only use "scenario label + key parameter/key call" descriptions.
- Conclusions must be actionable — avoid vague descriptions.
- If uncertain behavior exists, annotate "depends on caller constraints" and explain the impact.

## 6) Delivery Checklist

- Document has been written to the user-specified directory.
- Content covers "purpose, scenarios, reference analysis, examples, notes".
- At least 1 special/boundary usage description and example is included.
- Each representative reference in "in-project reference analysis" includes a code snippet and scenario description.
- Document does not contain easily-changed positioning information like paths, filenames, or line number links.
- No highly volatile list information.
- Consistent with the current code implementation.
- If the current task includes code development or code changes, the "update if exists, create if not" documentation sync action has been completed.
