# Stage 4: Material Supply

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain material supply content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "Implementation plan" | Prohibited: implementation-stage content |

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output: `[Material Supply] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID

### 3. Decide Whether to Wait for User Reply Based on Material Status ⚠️ Mandatory Rule

**⚠️ Important: If core materials are missing, must wait for user reply**

Two execution paths:

| Material Status | Execution Path |
| --- | --- |
| Core materials complete | Auto-skip, enter stage5 |
| Core materials missing | **Must wait for user reply** |

**Prohibited**:
- ❌ Prohibited: skipping the user inquiry when core materials are missing
- ❌ Prohibited: continuing execution without outputting a prompt

---

## Objective

- **Intelligently determine** whether necessary prerequisite materials need to be supplemented before formal development
- **Core logic**: check existing materials first, and only prompt the user for missing core materials

---

## Execution Flow

**After entering this stage, execute in the following order**:

---

### Step 1: Update the State File

**First, update the state file**:

Find the state block corresponding to the current Task ID:
- Search for content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use the edit tool to replace the state block content with:

```
**Task ID**: {current task ID}
**Currently Executing**: Material Supply
**Stage**: stage4
**Status**: in_progress
**Next Step**: Check existing materials, determine whether supplements are needed
```

---

### Step 2: Check Existing Materials

**Based on the task type, check the material checklist**:

#### 2.1 Bug Type Material Checklist

| Material Item | Determination Condition |
| --- | --- |
| Bug screenshot | Check whether Stage 0 has a screenshot attachment |
| Reproduction steps | Check whether the user description includes reproduction steps |
| Error message | Check whether the user description includes error information |

#### 2.2 Feature Type Material Checklist

| Material Item | Determination Condition |
| --- | --- |
| Design mockup | Check whether Stage 0 has a design mockup attachment |
| Interface documentation | **Output a prompt asking the user whether an interface is involved — cannot self-determine** |

#### 2.3 Refactor Type Material Checklist

| Material Item | Determination Condition |
| --- | --- |
| Third-party library documentation | Only needed when introducing new external dependencies |

#### 2.4 Optimize Type Material Checklist

**Always skip** (optimization type does not require material supply)

---

### Step 3: Determine Whether to Prompt User to Supplement Materials

**Based on the task type and material status, determine the next action**:

#### 3.1 Bug Type Determination Logic

| Core Material Status | Next Action |
| --- | --- |
| Screenshot + Reproduction steps + Error message ALL provided | Skip directly → Output auto-transition prompt to next stage |
| 2+ core materials provided | Optional prompt (only prompt for missing items) |
| 2+ core materials missing | Output prompt for missing core materials |

**Non-core material determination**:

| Non-core Material | Determination Condition | Handling |
| --- | --- | --- |
| Interface documentation | User has not explicitly stated whether an interface is involved | Output prompt: "Does this bug involve interface calls?" |
| Interface documentation | User confirmed "involves interface" + interface documentation missing | Output prompt for interface documentation |
| Environment information | User confirmed "involves environment issue" + environment information missing | Output prompt for environment information |

#### 3.2 Feature Type Determination Logic

| Material Status | Next Action |
| --- | --- |
| No UI involved (pure logic feature) + user confirms no interface | Skip directly → Output auto-transition prompt to next stage |
| Design mockup available + user confirms no interface | Skip directly → Output auto-transition prompt to next stage |
| Design mockup available + user confirms interface involved + interface docs available | Skip directly → Output auto-transition prompt to next stage |
| UI involved + no design mockup | Output prompt for design mockup |
| Design mockup available + user has not confirmed whether interface is involved | Output prompt asking whether an interface is involved |
| User confirms interface involved + interface documentation missing | Output prompt for interface documentation |

**⚠️ Prompt rules for frontend UI development**:
- Frontend UI (pages, components) development usually involves data interaction
- Cannot self-determine "no interface involved"
- Output prompt: "Does this page involve interface calls (data fetching, form submission, etc.)?"

#### 3.3 Refactor Type Determination Logic

| Material Status | Next Action |
| --- | --- |
| No new external dependencies | Skip directly → Output auto-transition prompt to next stage |
| New dependencies + no documentation | Output prompt for third-party library documentation |

#### 3.4 Optimize Type Determination Logic

**Always skip** (output auto-transition prompt to next stage directly)

---

### Step 4: Output Prompt (If Needed) ⚠️ Must Wait for User Reply If Prompt is Output

**⚠️ Important: If determined that the user needs to supplement materials, must first output the prompt, then wait for user reply**

If it is determined that the user needs to supplement materials, execute the following actions:

#### 4.1 Output Material Checklist

```
[Material Supply] Upon review, the following materials are missing and recommended to supplement:

1. [Material item name]: [explanation of why it is needed]
2. [Material item name]: [explanation]

Please reply with any of the following:
- Provide the material content directly
- Reply "don't provide", "none", or "skip"
```

**End the current reply after outputting the prompt and wait for user reply**

**⚠️ Prohibited**:
- ❌ Prohibited: continuing to execute other operations after outputting the prompt
- ❌ Prohibited: skipping the user inquiry step

#### 4.2 Prompt Template for Frontend UI Development

**If frontend UI development is involved, output the following prompt**:

```
[Material Supply] Design mockup detected.
Please confirm the following:
1. Does this page involve interface calls? (e.g., data fetching, form submission, status queries, etc.)
   - Reply "involves interface" → I will prompt for interface documentation
   - Reply "no interface" → proceed directly to development
2. Does this page involve permission control?
   - Reply "involves permissions" → I will prompt for permission description
   - Reply "no permissions" → skip this item
```

---

### Step 5: Handle User Reply

**After the user replies, execute the following actions**:

| User Reply | Handling |
| --- | --- |
| Provides materials | Record `provided`, merge material content into task context |
| "Don't provide" / "none" / "skip" | Record `not_provided` or `skipped` |
| "Continue" | Treat as agreeing to skip all material supplementation |

---

### Step 6: Output Auto-Transition Prompt and Auto-Transition to the Next Stage

**After material supply is complete (or skipped), output the auto-transition prompt**:

```
[Material Supply] Task ID: {current task ID}
Material supply complete.

Material status:
- Existing materials: [list of existing material items]
- User-supplied: [list of materials provided by the user this time]
- Material status: [complete / partial / no additional materials]

Proceeding to the next stage: [Implementation].
```

---

### Step 7: Update the State File to the Next Stage

**After outputting the auto-transition prompt, update the state file**:

```
**Task ID**: {current task ID}
**Currently Executing**: Implementation
**Stage**: stage5
**Status**: in_progress
**Next Step**: Execute implementation.md
```

---

### Step 5 - Waiting: When User Reply Is Required ⚠️ Must Wait for User Reply

**⚠️ Important: If user reply is required, must first output the prompt, then end the current reply**

If user reply is required, execute the following actions:

1. Output the missing material prompt (already output in Step 4.1)
2. Update the state file to waiting_user:
   ```
   **Currently Executing**: Material Supply
   **Stage**: stage4
   **Status**: waiting_user
   **Next Step**: Wait for user reply
   ```
3. **End the current reply and wait for user reply**

**⚠️ Prohibited**:
- ❌ Prohibited: continuing to execute other operations after outputting the prompt
- ❌ Prohibited: skipping the user inquiry step

---

## Rollback Conditions

- If insufficient materials cause the development stage to be unable to continue, roll back to this stage to output a prompt and supplement materials
