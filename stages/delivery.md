# Stage 8: Delivery

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain delivery confirmation content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "After fix, xxx" | Prohibited from promising results before fix |
| "New task plan" | Prohibited from creating new task lists |

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output: `[Delivery] Task ID: task_xxxxxxxx`
- State file update must carry Task ID
- When user proposes modifications, update status must carry Task ID

### 3. Must Wait for User Confirmation

**After delivery results output**:
- Output delivery summary
- Output confirmation prompt
- End current reply
- Wait for user to reply "confirm" or propose modifications

### 4. When User Proposes Modifications, Must First Update Status

**After receiving user modifications**:
1. Use edit tool to update status to stage5
2. Execute fix loop
3. Prohibited from directly modifying code without updating status

---

## Goal

- **User Confirmation's Sole Node**: After entire development flow (stage5 → stage6 → stage7) ends, output delivery results waiting for user confirmation.
- If user proposes modifications, **immediately return to stage5** → execute fix → stage6 → stage7 → stage8 → loop.
- Support user explicitly specifying return to any step.

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Decide Execution Path) |
| --- | --- | --- |
| Delivery results output | Code modification (return to stage5) |
| User confirmation collection | Documentation update (return to stage7) |
| Task completed, resume switch | Scope re-analysis (return to stage2) |

**User can provide any content, this phase decides execution path based on content**:

```
Example content user may provide:
- "continue" / "confirm" → Task complete, task closed
- "Login page still has issue, validation logic needs change" → Return to stage5 to fix
- "API doc needs supplement" → Return to stage4 to supplement materials
- "New requirement: Add order management module" → Return to stage2 to re-analyze
- "Enter step 6" → Switch to stage5

Handling method:
- Based on user content judge intent → Decide execution path
- Don't reject user content, switch to corresponding phase by intent
```

**Content Extraction Rules**:

| User Reply Pattern | Intent Type | Execution Path |
| --- | --- | --- |
| "continue" / "confirm" / "no problem" | **Confirm Intent** | Task complete, task closed |
| Functional issue / bug description / modification content | **Fix Intent** | Return to stage5 |
| Material supplement / API doc etc. | **Supplement Intent** | Return to stage4 |
| New requirement / new feature description | **New Requirement Intent** | Return to stage2 |
| "Enter step X" | **Switch Intent** | Switch to specified step |

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit When Entering This Phase

**Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
- Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use edit tool to replace that status block content with:

```
**Currently Executing**: Delivery
**Phase**: stage8
**Status**: in_progress
**Next Step**: Output delivery results, wait for user confirmation
**User Proposed Modifications**: Immediately switch to stage5 → execute fix → stage6 → stage7 → stage8 → loop
**Loop Path**: stage5 → stage6 → stage7 → stage8 → stage5 → loop (until user confirms no modification)
```

### Edit Again After Outputting Delivery Results

When waiting for user confirmation, use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Delivery
**Phase**: stage8
**Status**: waiting_user
**Next Step**: Wait for user to confirm delivery results, if modifications return to stage5
**User Proposed Modifications**: Immediately switch to stage5 → loop
**Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
```

### Edit Again When User Proposes Modifications

**Loop path when user proposes modifications**:

1. **Immediately switch to stage5**:
   ```
   **Currently Executing**: Implementation
   **Phase**: stage5
   **Status**: in_progress
   **Next Step**: Execute fix based on user feedback
   **User Proposed Modifications**: None (currently fixing)
   **Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
   ```

2. **Execute fix action**: Invoke `stages/implementation.md`, modify code based on user feedback

3. **After fix complete automatically execute**: stage6 → stage7 → stage8

4. **Re-enter stage8 waiting for confirmation**:
   ```
   **Currently Executing**: Delivery
   **Phase**: stage8
   **Status**: waiting_user
   **Next Step**: Wait for user to confirm updated delivery results
   **User Proposed Modifications**: Immediately switch to stage5 → loop
   **Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
   ```

5. **Loop until user confirms no modification**

### Edit Again When User Confirms No Modification

Use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Task Complete
**Phase**: completed
**Status**: completed
**Next Step**: Wait for user to supplement new requirements or exit skill
**User Proposed Modifications**: Return to user-specified any step (or default stage5)
**Loop Path**: None
```

### Edit Again When User Specifies Return to Some Step

Based on user-specified step, replace status content with corresponding phase status:

| User Specified Step | Status Content |
| --- | --- |
| "Enter project scan" / "Step 2" | `**Currently Executing**: Project Scan<br>**Phase**: stage1<br>**Status**: in_progress<br>**Next Step**: Execute stages/project-scan.md` |
| "Enter scope analysis" / "Step 3" | `**Currently Executing**: Scope Analysis<br>**Phase**: stage2<br>**Status**: in_progress<br>**Next Step**: Execute stages/scope-analysis.md` |
| "Enter implementation" / "Step 6" / "Development" | `**Currently Executing**: Implementation<br>**Phase**: stage5<br>**Status**: in_progress<br>**Next Step**: Execute stages/implementation.md` |

### Prohibited Actions

- Prohibited from guessing paths without reading config file
- **Prohibited from not switching to stage5 after user proposes modifications** (must execute stage5 → stage6 → stage7 → stage8 loop)

---

## Development Loop Flow (Core Mechanism)

```
After user confirms scope analysis:
├─ Enter stage5 (Implementation)
├─ Automatically enter stage6 (Verification) ← No pause
├─ Automatically enter stage7 (Documentation Sync) ← No pause
├─ Enter stage8 (Delivery)
├─ Output delivery results, wait for user confirmation
│
├─ User proposes modifications:
│   ├─ Immediately switch to stage5
│   ├─ Execute fix → stage6 → stage7 → stage8
│   ├─ Re-output delivery results → wait for confirmation
│   ├─ Loop until user confirms no modification
│
├─ User explicitly specifies return to some step:
│   ├─ Switch to user-specified step
│   ├─ From that step continue executing downward
│
├─ User confirms no modification:
│   └─ Task complete
```

---

## Execution Actions

1. **Aggregate Delivery Results**:
   - Modification content summary
   - Verification results summary
   - Known risks
   - Follow-up suggestions

2. **Output Delivery Results**, containing the following info:
   - What was changed
   - How verified
   - Remaining risks

3. **Append Confirmation Prompt** (Must output):
   ```
   Above is this task's delivery results.
   
   Please confirm if modifications needed:
   - If have modification requirements, please tell me specific content directly, I will return to implementation phase to fix
   - If no other modifications, reply "confirm" to complete this task
   
   You can also explicitly specify return to some step:
   - "Enter step 6" / "Enter implementation": Re-start code modification
   - "Enter step 2" / "Enter scope analysis": Re-analyze requirements
   ```

4. **Wait for user reply**, decide execution path based on user input:

### ⚠️ After Receiving User Modifications, Must First Update Status File

**When user proposes modifications, must execute in the following order**:

1. **Step 1: Use edit tool to update status file**
   ```
   **Currently Executing**: Implementation
   **Phase**: stage5
   **Status**: in_progress
   **Next Step**: Execute fix based on user feedback
   ```
   
2. **Step 2: Execute fix action**
   - Invoke `stages/implementation.md`
   - Modify code based on user feedback

3. **Step 3: After fix complete automatically loop**
   - stage6 (Verification) → stage7 (Documentation Sync) → stage8 (Delivery confirmation)
   - Re-wait for user confirmation

**Prohibited Actions**:
- Prohibited from directly modifying code without updating status file
- Prohibited from skipping stage5 → stage6 → stage7 → stage8 loop
- Prohibited from directly executing fix in stage8 status

---

## Output

- Concise delivery conclusion
- Confirmation prompt (includes modification loop and step switch options)

---

## Fallback Conditions

- User proposes modifications → **Default return to stage5** (loop)
- User explicitly specifies step → Switch to specified step
- User confirms no modification → Task complete