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
| **Project Scan** | Check or generate project skill | - | Output summary + **append prompt**, proceed to Node C |
| **Node C** | Validate project scan output is correct | **Yes: reply "continue"** | Proceed to Scope Analysis |
| | | **No: supplement/correct** | Return to Project Scan |
| **Scope Analysis** | Analyze requirements and scope | - | Output conclusion + **append prompt**, proceed to Node E |
| **Node E** | Validate scope analysis is correct | **Yes: reply "continue"** | Proceed to Node F |
| | | **No: supplement/correct** | Return to Scope Analysis |
| **Node F** | Is Execution Plan needed? | **Yes** | Proceed to Execution Plan |
| | | **No** | Skip Execution Plan, directly proceed to Material Supply |
| **Execution Plan** | Establish execution plan | - | After completion proceed to Material Supply |
| **Material Supply** | Supplement materials before execution | - | Proceed to Node I |
| **Node I** | Material status judgment | **Awaiting user response** | Stay in Material Supply (waiting) |
| | | **Provided / Skipped / Not provided / N/A** | Proceed to Implementation |
| **Implementation** | Execute code modifications | - | **Auto-proceed to Verification** (no user confirmation wait) |
| **Verification** | Verify modification validity (lint/type/build/functional) | - | **Auto-proceed to Documentation Sync** (no user confirmation wait) |
| **Documentation Sync** | Update directory-level documentation | - | **Auto-proceed to Delivery** (no user confirmation wait) |
| **Delivery** | Output delivery results | - | Output results + **append confirmation prompt**, proceed to Node O (wait for user confirmation) |
| **Node O** | User feedback judgment | **"Confirm" / "OK"** | Task complete, wrap up |
| | | **Bug / implementation issue** | Return to Implementation → auto execute 6→7→8 → wait again |
| | | **Requirements issue** | Return to Scope Analysis |
| | | **User explicitly specifies step** | Switch to specified step |

## Explicit Confirmation Point Standard Prompt

After outputting conclusion at each explicit confirmation point, **must append the following prompt**:

> "If you have other modifications needed, please tell me; of course if no other modifications, you can directly reply 'continue', I will enter next step."

**Usage Scenarios**:
- Project Scan confirmation: After outputting project skill summary → append prompt
- Scope Analysis confirmation: After outputting analysis conclusion → append prompt
- Delivery confirmation: After outputting delivery results → append confirmation prompt (including smart fallback options)

**Prohibited Actions**:
- Prohibited from only outputting "please confirm" or "reply continue"
- Prohibited from omitting "If you have other modifications needed, please tell me" part
- Prohibited from appending prompt after final step (Delivery completed)

## Node F Skip Decision

Node F (whether Execution Plan is needed) is the key skip decision point in the master process.

### Conditions to Enter Execution Plan

Enter Execution Plan when any of the following conditions is met:
- Task is multi-step (estimated steps ≥ 3)
- Task spans multiple directories
- Task spans multiple sub-projects
- Task requires multiple rounds of verification
- Estimated to not be completable in a single round

### Conditions to Skip Execution Plan

Skip Execution Plan and directly proceed to Material Supply when all of the following conditions are met:
- Task is single-step or simple steps (estimated steps < 3)
- Task involves a single directory
- Task does not span sub-projects
- Task does not require multiple rounds of verification
- Estimated to be completable in a single round

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

## Usage Notes

- Prohibited from outputting Stage numbers; must use phase names
- Detailed definitions for each phase are in corresponding definition files
- Master protocol `SKILL.md` defines core gate rules
