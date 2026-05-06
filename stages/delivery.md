# Stage 8: Delivery

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain delivery confirmation content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "After fixing, xxx will happen" | Prohibited: promising results before fixing |
| "New task plan" | Prohibited: self-creating new task lists |

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output: `[Delivery] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID

### 3. Must Wait for User Confirmation ⚠️ Mandatory Rule

**⚠️ Important: After delivery results are output, must wait for user confirmation**

After delivery results are output:
- Output the delivery summary
- Output the confirmation prompt
- **End the current reply**
- **Wait for the user to reply "confirm" or request changes**

**Prohibited**:
- ❌ Prohibited: ending the task immediately after outputting the summary
- ❌ Prohibited: skipping the user confirmation step

---

## Objective

- **The sole user confirmation checkpoint**: After the entire development flow ends, output delivery results and wait for user confirmation
- If the user requests changes, **immediately return to stage5** → execute fixes → stage6 → stage7 → stage8 → loop

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
**Currently Executing**: Delivery
**Stage**: stage8
**Status**: in_progress
**Next Step**: Output delivery results, wait for user confirmation
```

---

### Step 2: Summarize Delivery Results

**Summarize the following information**:
- Summary of changes
- Summary of validation results
- Known risks
- Follow-up recommendations

---

### Step 3: Output Delivery Results and Append Confirmation Prompt ⚠️ Must Wait for User Confirmation

**⚠️ Important: After outputting delivery results, must wait for user confirmation**

Output the delivery results:

```
The above is the delivery result for this task.

Changes:
- {list of changed files}
- {brief description of changes}

Validation results:
- lint: passed
- type: passed
- build: passed
- Functional validation: passed

Please confirm whether there are any changes needed:
- If you have change requests, please describe them directly and I will return to the Implementation stage to fix
- If no further changes are needed, reply "confirm" to complete this task

You may also explicitly specify a stage to return to:
- "Go to Implementation" / "Go to code changes": restart code changes
- "Go to Scope Analysis" / "Go to requirements analysis": re-analyze requirements
```

---

### Step 4: Update the State File to Waiting for User

**After outputting, update the state file**:

```
**Task ID**: {current task ID}
**Currently Executing**: Delivery
**Stage**: stage8
**Status**: waiting_user
**Next Step**: Wait for user confirmation of delivery results
```

**⚠️ Important: After asking, must end the current reply and wait for user confirmation**

**⚠️ Prohibited**:
- ❌ Prohibited: continuing to execute other operations after asking
- ❌ Prohibited: skipping the user confirmation step

---

### Step 5: User Confirmation Loop Mechanism

**After the user replies, execute the corresponding action based on intent**:

| User Reply | Intent Type | Handling Action |
| --- | --- | --- |
| "continue" / "confirm" / "looks good" | Confirmation intent | Output completion prompt, task complete |
| Functional issue / bug description / change content | Fix intent | Return to stage5 to execute the fix loop |
| Material supplement / interface docs, etc. | Supplement intent | Return to stage4 to supplement materials |
| New requirement / new feature description | New requirement intent | Return to stage2 to re-analyze |
| "Go to Implementation" / "Go to code changes" | Switch intent | Switch to stage5 |
| "Go to Scope Analysis" | Switch intent | Switch to stage2 |

#### 5.1 Flow When User Requests Changes

**When the user requests changes, execute in the following order**:

##### 5.1.1 Update the State File to stage5

```
**Currently Executing**: Implementation
**Stage**: stage5
**Status**: in_progress
**Next Step**: Execute fix based on user feedback
```

##### 5.1.2 Execute Fix Actions

- Invoke `./implementation.md`
- Modify code based on user feedback

##### 5.1.3 Auto-Loop After Fix Is Complete

- stage6 (Verification) → stage7 (Documentation Sync) → stage8 (Delivery confirmation)
- Wait for user confirmation again

---

### Step 6: Complete the Task After User Confirmation

**After the user confirms no changes, update the state file**:

```
**Task ID**: {current task ID}
**Currently Executing**: Task Complete
**Stage**: completed
**Status**: completed
**Next Step**: Wait for user to add new requirements or exit the skill
```

**Output the completion prompt**:
```
[Delivery] Task ID: {current task ID}
This task is now complete.
```

---

## Prohibited Actions

- Prohibited: not switching to stage5 after the user requests changes
- Prohibited: executing fixes directly while in stage8 (must first update status to stage5)

---

## Rollback Conditions

- User requests changes → **Default return to stage5** (loop)
- User explicitly specifies a step → Switch to the specified step
- User confirms no changes → Task complete
