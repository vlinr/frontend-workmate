# Phase Definition Index

This directory contains independent definition files for each phase of the frontend development orchestration workflow.

## Phase Mapping Table (ID ↔ Name)

| Internal ID | Phase Name | Definition File |
| --- | --- | --- |
| `stage0` | Initialization | `init.md` |
| `stage1` | Project Scan | `project-scan.md` |
| `stage2` | Scope Analysis | `scope-analysis.md` |
| `stage3` | Execution Plan | `plan.md` |
| `stage4` | Material Supply | `supply.md` |
| `stage5` | Implementation | `implementation.md` |
| `stage6` | Verification | `verification.md` |
| `stage7` | Documentation Sync | `docs.md` |
| `stage8` | Delivery | `delivery.md` |

**Usage Rules**:
- **Internal State Maintenance**: Use IDs (e.g., `current_stage = stage0`)
- **User Output**: Use names (e.g., `[Initialization] Completed`)
- **Prohibited**: Outputting IDs or Stage numbers to users

## Master Process Table (Mandatory Execution Logic)

| Phase/Node | Description | Decision/Condition | Next Step/Branch Direction |
| :--- | :--- | :--- | :--- |
| **Initialization** | Complete environment initialization | - | Proceed to Project Scan |
| **Project Scan** | Check or generate project skill | - | Output summary + **append prompt**, proceed to node C |
| **Node C** | Verify project scan artifact correctness | **Yes: reply "continue"** | Proceed to Scope Analysis |
| | | **No: supplement/correct** | Return to Project Scan |
| **Scope Analysis** | Analyze requirements and scope | - | Output conclusion + **append prompt**, proceed to node E |
| **Node E** | Verify scope analysis correctness | **Yes: reply "continue"** | Proceed to node F |
| | | **No: supplement/correct** | Return to Scope Analysis |
| **Node F** | Need execution plan? | **Yes** | Proceed to Execution Plan |
| | | **No** | Skip Execution Plan, proceed to Material Supply |
| **Execution Plan** | Build execution plan | - | After execution, proceed to Material Supply |
| **Material Supply** | Supply materials before execution | - | Proceed to node I |
| **Node I** | Material status judgment | **Awaiting user response** | Stay in Material Supply (waiting) |
| | | **Provided / Skipped / Not Provided / None** | Proceed to Implementation |
| **Implementation** | Execute code modifications | - | **Automatically proceed to Verification** (no user confirmation wait) |
| **Verification** | Verify modification validity (execute lint/type/build/functional verification) | - | **Automatically proceed to Documentation Sync** (no user confirmation wait) |
| **Documentation Sync** | Update directory-level documentation | - | **Automatically proceed to Delivery** (no user confirmation wait) |
| **Delivery** | Output delivery results | - | Output results + **append confirmation prompt**, proceed to node O (await user confirmation) |
| **Node O** | User feedback judgment | **"Confirm" / "No problem"** | Task complete, task closed |
| | | **bug / implementation issue** | Return to Implementation → auto execute 6→7→8 → await confirmation again |
| | | **requirement issue** | Return to Scope Analysis |
| | | **User explicitly specifies step** | Switch to specified step |

## Standard Prompt for Explicit Confirmation Points

After outputting conclusion at each explicit confirmation point, **must append the following prompt**:

> "If you have other modifications needed, please let me know; if everything looks correct, you can simply reply 'continue' and I'll proceed to the next step."

**Usage Scenarios**:
- Project Scan confirmation: After outputting project skill summary → append prompt
- Scope Analysis confirmation: After outputting analysis conclusion → append prompt
- Delivery confirmation: After outputting delivery results → append confirmation prompt (including smart fallback options)

**Prohibited Actions**:
- Prohibited from only outputting "please confirm" or "reply continue"
- Prohibited from omitting "If you have other modifications needed, please let me know" part
- Prohibited from appending prompt after final step (Delivery completed)

## Node F Skip Decision

Node F (Need execution plan?) is a key skip point in the master process.

### Conditions to Enter Execution Plan

Enter Execution Plan when any of the following conditions are met:
- Task is multi-step (estimated steps ≥ 3)
- Task spans multiple directories
- Task spans multiple sub-projects
- Task requires multiple rounds of verification
- Estimated that single round cannot complete

### Conditions to Skip Execution Plan

Skip Execution Plan and proceed directly to Material Supply when all of the following conditions are met:
- Task is single-step or simple (estimated steps < 3)
- Task involves single directory
- Task does not span sub-projects
- Task does not require multiple rounds of verification
- Estimated that single round can complete

## Phase Definition Files

| Order | Phase Name | Definition File |
| --- | --- | --- |
| 1 | Initialization | `init.md` |
| 2 | Project Scan | `project-scan.md` |
| 3 | Scope Analysis | `scope-analysis.md` |
| 4 | Execution Plan | `plan.md` |
| 5 | Material Supply | `supply.md` |
| 6 | Implementation | `implementation.md` |
| 7 | Verification | `verification.md` |
| 8 | Documentation Sync | `docs.md` |
| 9 | Delivery | `delivery.md` |

## Fallback Paths

| Scenario | Fallback Target |
| --- | --- |
| Project skill missing or invalid | Project Scan |
| Scope analysis conclusion unstable | Scope Analysis |
| Verification fails | Implementation |
| User supplements new requirements after delivery | Scope Analysis |

## Usage Instructions

- Prohibited from outputting Stage numbers, must use phase names
- Detailed definitions for each phase are in corresponding definition files
- Main protocol `SKILL.md` defines core gate rules