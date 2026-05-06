# Capability Matrix Template

## 1. Current Task

- Task name:
- Task type:
- Owning project:
- How to ask when user needs to supplement information: `text_reply | choice_ui | not_applicable`

## 2. Capability Determination Rules

Before filling in the capability checklist, first determine whether the capability truly exists, whether it can be invoked, and whether it belongs to the critical path of the current task; if this capability does not exist or is not needed for this task, mark it as `not_applicable` — do not add fictitious capabilities for the sake of completeness.

| Determination Item | Question | Filling Requirements |
| --- | --- | --- |
| Is it relevant? | Does the current task truly require this capability domain? | Mark `not_applicable` when not needed |
| Is it available? | Does the [Work Directory] or environment already have a directly usable capability? | Record the actual source, not guesses |
| Can it be encapsulated? | Not readily available now, but can it be integrated directly through a skill? | Only fill in when there is a clear integration path |
| Is it missing? | Is a critical capability for the current task missing? | If missing and blocking, enter the install list |
| Is it blocking? | If missing, does it affect the main flow's progression? | Must explicitly mark whether it is blocking |

## 3. Capability Checklist

| Capability Domain | Relevant | Target Capability | Current Status | Source | Trigger Skill | Missing Handling |
| --- | --- | --- | --- | --- | --- |
| Documentation | `yes | no` |  | `available | encapsulatable | missing | not_applicable` | `repo skill | MCP | external skill | other` |  |  |
| Browser | `yes | no` |  | `available | encapsulatable | missing | not_applicable` |  |  |  |
| Design | `yes | no` |  | `available | encapsulatable | missing | not_applicable` |  |  |  |
| Code analysis | `yes | no` |  | `available | encapsulatable | missing | not_applicable` |  |  |  |
| Testing & validation | `yes | no` |  | `available | encapsulatable | missing | not_applicable` |  |  |  |
| Online issues | `yes | no` |  | `available | encapsulatable | missing | not_applicable` |  |  |  |

## 4. Required Capability Determination

| Capability | Is It Critical Path? | Does Missing Block? | Notes |
| --- | --- | --- | --- |
|  | `yes | no` | `yes | no` |  |

## 5. Install List

| Name | Type | Purpose | Installation Method | Required? |
| --- | --- | --- | --- | --- |
|  | `skill | MCP | other` |  |  | `yes | no` |

## 6. Execution Strategy

- Capability combinations that can be executed directly:
- Capabilities the user needs to install first:
- Capabilities that can be downgraded/replaced:
- Main skill route:
- Next step recommendations:

## 7. User Question Rules

- When capability determination depends on user supplementation of documentation, skills, paths, design descriptions, interface descriptions, or environment constraints, default to using plain text replies to guide the user — do not implement as selectors.
- When capability integration has finite solution branches, numbered/lettered/short-labeled items may be used, but should clearly tell the user: they can reply with the corresponding mark, or directly input their own ideas or plan.
- If the user has already provided a UI library name, default to continuing with that name first; treat missing versions as latest version — only if installation, import, or build fails, ask for the source or path.
