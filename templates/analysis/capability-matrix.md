# Capability Matrix Template

## 1. Current Task

- Task Name:
- Task Type:
- Belonging Project:
- Inquiry Method When Need User Supplement Info: `text_reply | choice_ui | not_applicable`

## 2. Capability Judgment Rules

Before filling capability list, first judge whether capability truly exists, whether callable, whether belongs to current task critical path; if no such capability or this task doesn't need, mark as `not_applicable`, don't fabricate capability for completeness.

| Judgment Item | Judgment Question | Fill Requirement |
| --- | --- | --- |
| Is Relevant | Does current task really need this capability domain | Mark `not_applicable` when not needed |
| Already Possessed | Does Working Directory or environment already have directly usable capability | Record actual source, don't write guesses |
| Can Encapsulate | Though not currently possessed, can directly access via skill | Only fill when has clear access path |
| Is Missing | Is current task critical capability missing | If missing and blocking, enter to-install list |
| Is Blocking | Does missing affect main flow progression | Must explicitly mark blocking or not |

## 3. Capability List

| Capability Domain | Is Relevant | Target Capability | Current Status | Source | Trigger Skill | Missing Handling |
| --- | --- | --- | --- | --- | --- | --- |
| Documentation | `yes | no` |  | `Already Possessed | Can Encapsulate | Missing | not_applicable` | `Repository skill | MCP | External skill | Other` |  |  |
| Browser | `yes | no` |  | `Already Possessed | Can Encapsulate | Missing | not_applicable` |  |  |  |
| Design | `yes | no` |  | `Already Possessed | Can Encapsulate | Missing | not_applicable` |  |  |  |
| Code Analysis | `yes | no` |  | `Already Possessed | Can Encapsulate | Missing | not_applicable` |  |  |  |
| Test Verification | `yes | no` |  | `Already Possessed | Can Encapsulate | Missing | not_applicable` |  |  |  |
| Production Issues | `yes | no` |  | `Already Possessed | Can Encapsulate | Missing | not_applicable` |  |  |  |

## 4. Required Capability Judgment

| Capability | Is Critical Path | Missing Is Blocking | Description |
| --- | --- | --- | --- |
|  | `Yes | No` | `Yes | No` |  |

## 5. To-Install List

| Name | Type | Purpose | Install Method | Is Required |
| --- | --- | --- | --- | --- |
|  | `skill | MCP | Other` |  |  | `Yes | No` |

## 6. Execution Strategy

- Directly executable capability combination:
- Capabilities needing user to first install:
- Capabilities can downgrade substitute:
- Main skill route:
- Next step suggestion:

## 7. User Inquiry Rules

- When capability judgment depends on user supplementing documentation, skills, paths, design descriptions, interface descriptions or environment constraints, default use plain text reply guide, don't make as selector.
- When capability access has limited plan branches, can use numbers, letters or short tags list items, but still should explicitly tell user: can reply corresponding tag, can also directly input own thoughts or plan.
- If user already gave UI library name, default can first continue by that name; if no version given can temporarily record as latest version, only go back to ask source or path when installation, import or build fails.