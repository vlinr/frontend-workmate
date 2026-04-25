# Stage 4: Material Supply

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain material supply content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "Implementation plan" | Prohibited from outputting implementation phase content |
| "Fix plan" | Prohibited from outputting fix plan |

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output: `[Material Supply] Task ID: task_xxxxxxxx`
- State file update must carry Task ID

### 3. Based on Material Status, Decide if Wait for User Response

**Two Execution Paths**:

#### Path A: Core Materials Complete → Automatically Skip (No User Confirmation Wait)

**If core materials complete**:
- Output: `[Material Supply] Core materials complete, no supplement needed. Proceeding to next phase: [Implementation].`
- Update status to stage5
- **Automatically proceed to stage5**, no user confirmation wait

#### Path B: Core Materials Missing → Must Wait for User Response

**If core materials missing**:
- Output inquiry prompt
- End current reply
- Wait for user response

---

## Goal

- Before formal development implementation, **smart judgment** if need to supplement necessary prerequisite materials.
- **Core Logic**: First check existing materials, only inquire about missing core materials; if core materials complete then skip this phase.

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Record to Context) |
| --- | --- | --- |
| Material missing judgment | Code modification, implementation plan |
| Material supplement inquiry | Verification execution |
| Material status recording | Documentation update |

**User can provide any content, this phase only processes content belonging to material supply**:

```
Example content user may provide:
- "API doc: POST /api/login, params: username, password"
- "Design spec link: https://figma.com/xxx"
- "Bug screenshot and reproduction steps: Click login button then error"

Handling method:
- Info belonging to material supply → This phase processes (record material status)
- Info belonging to implementation details → Record to task context, wait for stage5 to process
- Don't reject user content, only process by phase
```

**Note**:
- This phase is optional phase, if materials complete then automatically skip
- User-provided materials may contain implementation details, only record material content, don't execute implementation

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit Instructions

1. **First Read Config File**: Use read tool to read `{project_ide_dir}/.fw-session-config.json`
2. **Get Rules File Path**: Read `rules_file_path` field from config
3. **Read Rules File**: Use read tool to read file at that path
4. **Edit Rules File**: **Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
   - Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
   - Use edit tool to replace that status block content with:

```
**Currently Executing**: Material Supply
**Phase**: stage4
**Status**: in_progress
**Next Step**: Check existing materials, judge if need supplement
```

### Edit Again When Need User to Supply Materials

After outputting material list, use edit tool again to replace status content with:

```
**Currently Executing**: Material Supply
**Phase**: stage4
**Status**: waiting_user
**Next Step**: Wait for user response (provide materials/not provide/skip/none)
```

### Edit Again When No Supplement Needed or After User Response

Before proceeding to next phase, use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Implementation
**Phase**: stage5
**Status**: in_progress
**Next Step**: Execute stages/implementation.md
```

### Prohibited Actions

- Prohibited from guessing paths without reading config file
- Prohibited from not updating status to waiting_user when waiting for user
- Prohibited from entering stage5 before user responds

## Input

- Task type (`feature` / `bug` / `refactor` / `optimize`)
- Stage 0 user original input (screenshots, attachments, descriptions etc.)
- Stage 2 scope analysis conclusion (existing material list)

## Material List Definition (By Task Type)

### Bug Type Material List

**Core Materials (Required)**:

| Material Item | Description | Judgment Condition |
| --- | --- | --- |
| Bug screenshot | Screenshot or recording of problem phenomenon | Check if Stage 0 has screenshot attachment |
| Reproduction steps | Specific steps to reproduce problem | Check if user description contains reproduction steps |
| Error info | Error logs, error messages, stack trace etc. | Check if user description contains error info |

**Non-Core Materials (As Needed)**:

| Material Item | Description | Judgment Condition |
| --- | --- | --- |
| API documentation | Only needed when problem involves API calls | Scope analysis determines if involves API |
| Environment info | Only needed when problem involves environment difference | Scope analysis determines if involves environment |

**Skip Conditions**:
- ✅ All core materials available → Directly skip
- ✅ 2+ core materials available → Can skip, only prompt to supplement missing items (optional)
- ❌ 2+ core materials missing → Must inquire

### Feature Type Material List

**Core Materials (Required)**:

| Material Item | Description | Judgment Condition |
| --- | --- | --- |
| Design spec | UI design spec, prototype, interaction description | Check if Stage 0 has design spec attachment |
| API documentation | Only required when involves API calls | **Must ask user if involves API, cannot infer by self** |

**Non-Core Materials (As Needed)**:

| Material Item | Description | Judgment Condition |
| --- | --- | --- |
| Permission description | Only needed when involves permission control | **Must ask user if involves permission, cannot infer by self** |
| Integration address | Only needed when need integration | **Must ask user if need integration, cannot infer by self** |
| Third-party library doc | Only needed when using new third-party library | Scope analysis determines if involves new library |

**Skip Conditions**:
- ✅ Design spec available + User explicitly confirms "no API involved" → Directly skip
- ✅ Design spec available + User explicitly confirms "API involved" and API doc available → Directly skip
- ✅ No UI involved (pure logic feature) + User explicitly confirms "no API involved" → Directly skip
- ❌ UI involved but no design spec → Must inquire design spec
- ❌ UI involved + User hasn't confirmed if API involved → **Must ask if API involved**
- ❌ User explicitly confirms "API involved" but no API doc → Must inquire API doc

**⚠️ Frontend Interface Development Default Inquiry Rule**:
- Frontend interface (page, component) development usually involves data interaction
- Cannot self-determine "no API involved"
- Must ask user: "Does this page involve API calls (data fetch, form submit etc.)?"

### Refactor Type Material List

**Core Materials (Required)**: None

**Non-Core Materials (As Needed)**:

| Material Item | Description | Judgment Condition |
| --- | --- | --- |
| Third-party library doc | Only needed when introducing new external dependency | Scope analysis determines if introducing new dependency |

**Skip Conditions**:
- ✅ Default skip (refactor usually based on existing code, no extra materials needed)
- ❌ Only inquire when introducing new external dependency

### Optimize Type Material List

**Core Materials (Required)**: None

**Skip Conditions**:
- ✅ **Always skip** (optimize type doesn't do material supply, directly enter Stage 5)

---

## Execution Flow

### Step 1: Check Existing Materials (Must Execute)

**After entering this phase, must first execute the following check**:

1. **Extract Existing Material List**:
   - Extract from Stage 0 user original input: screenshots, attachments, description content
   - Extract from Stage 2 scope analysis conclusion: identified material items

2. **Based on Task Type, Match Material List Definition**:
   - Bug: Check screenshot, reproduction steps, error info
   - Feature: Check design spec, API doc (if involves API)
   - Refactor: Check if new external dependency
   - Optimize: Directly skip

3. **Generate Material Status Table**:
   - Mark status for each material: `provided` (available) / `missing` (missing) / `pending` (to confirm)
   - **Prohibited from self-marking `not_applicable`**: Only mark after user explicitly confirms

### ⚠️ Key Rule: Cannot Self-Infer Material Requirements

**For the following material items, must ask user, cannot self-mark `not_applicable`**:

| Material Item | Why Cannot Self-Infer | Correct Handling Method |
| --- | --- | --- |
| API documentation | Frontend interface usually involves data interaction | Ask user "Does it involve API calls" |
| Permission description | Frontend interface may involve permission control | Ask user "Does it involve permission control" |
| Integration address | Frontend development may need integration | Ask user "Does it need integration" |

**Only after user explicitly replies "not involved", can mark `not_applicable`**.

### Step 2: Judge if Need to Ask User

**Based on material status table, judge next action**:

#### Bug Type Judgment Logic

```
Check core material status:
├─ Screenshot + Reproduction steps + Error info all provided → Directly skip, enter Stage 5
├─ 2+ core materials provided → Optional inquiry (only prompt missing items, user can choose provide or skip)
├─ 2+ core materials missing → Must inquire missing core materials
└─ Check non-core materials (API doc, environment info):
   ├─ User hasn't confirmed if involves API → Must ask: "Does this Bug involve API calls?"
   ├─ User explicitly confirms "involves API" + API doc missing → Must inquire API doc
   └─ User explicitly confirms "involves environment issue" + Environment info missing → Must inquire environment info
```

#### Feature Type Judgment Logic

```
Check core material status:
├─ No UI involved (pure logic feature) → Check API requirement:
│   ├─ User hasn't confirmed if involves API → Must ask: "Does it involve API calls?"
│   ├─ User explicitly confirms "no API involved" → Directly skip
│   ├─ User explicitly confirms "involves API" + API doc provided → Directly skip
│   └─ User explicitly confirms "involves API" + API doc missing → Must inquire API doc
├─ UI involved:
│   ├─ Design spec missing → Must inquire design spec
│   │   └─ Also ask: "Does this page involve API calls (data fetch, form submit etc.)?"
│   ├─ Design spec provided → Check API requirement:
│   │   ├─ User hasn't confirmed if involves API → Must ask: "Does this page involve API calls?"
│   │   ├─ User explicitly confirms "no API involved" → Directly skip
│   │   ├─ User explicitly confirms "involves API" + API doc provided → Directly skip
│   │   └─ User explicitly confirms "involves API" + API doc missing → Must inquire API doc
│   └─ Also check permission, integration requirements (ask user to confirm)
```

**⚠️ Frontend Interface Development Default Inquiry Template**:
```
[Material Supply] Detected design spec.
Please confirm the following:
1. Does this page involve API calls? (Like: data fetch, form submit, status query etc.)
   - Reply "involves API" → I will inquire API doc
   - Reply "no API involved" → Directly enter development phase
2. Does this page involve permission control?
   - Reply "involves permission" → I will inquire permission description
   - Reply "no permission involved" → Skip this item
```

#### Refactor Type Judgment Logic

```
Check non-core material status:
├─ No new external dependency → Directly skip
└─ New external dependency and doc missing → Must inquire third-party library doc
```

#### Optimize Type Judgment Logic

```
Always directly skip, enter Stage 5
```

### Step 3: Execute Inquiry (If Needed)

**If judgment indicates need to ask user to supplement materials**:

1. **Output Material List** (Only list missing material items):
   ```
   [Material Supply] After check, the following materials are missing, suggest supplementing:
   
   1. [Material item name]: [Explain why needed, like "Bug screenshot for locating problem phenomenon"]
   2. [Material item name]: [Explanation]
   
   Please reply any of the following:
   - Directly provide material content (like paste screenshot, reproduction steps, API doc etc.)
   - Reply "not provide", "none" or "skip" (I will continue development based on existing info)
   
   After your response, I will enter implementation phase.
   ```

2. **After asking must end current reply, wait for user response**
3. **Recommendation: Inquiry prompt should be main content of this round reply**
4. **Not recommended**: After asking continue analyzing, invoking skills, modifying files, entering next phase

### Step 4: Handle After User Response

**After user response, execute the following actions**:

- User provides materials → Record `provided`, merge material content to task context
- User replies "not provide"/"none"/"skip" → Record `not_provided` or `skipped`
- User replies "continue" → Treat as agreeing to skip all material supplements

**Output and Proceed to Next Phase**:
```
[Material Supply] Completed.
- Existing materials: [List existing material items]
- User supplemented: [List materials user provided this time, empty if none]
- Material status: [Complete / Partial / No extra materials]

Proceeding to next phase: [Implementation].
```

---

## Quick Judgment Table (For AI Execution)

| Task Type | Existing Material Check | Judgment Result | Execution Action |
| --- | --- | --- | --- |
| **Optimize** | No need to check | Always skip | Directly enter Stage 5 |
| **Refactor** | No new dependency | Skip | Directly enter Stage 5 |
| **Refactor** | New dependency + No doc | Need inquiry | Inquire third-party library doc |
| **Bug** | All core materials available + User confirms no API involved | Skip | Directly enter Stage 5 |
| **Bug** | 2+ core materials missing | Need inquiry | Inquire missing core materials |
| **Bug** | User hasn't confirmed if involves API | Need inquiry | **Must ask if involves API** |
| **Bug** | User confirms involves API + No API doc | Need inquiry | Inquire API doc |
| **Feature** | No UI involved + User confirms no API involved | Skip | Directly enter Stage 5 |
| **Feature** | Design spec available + User confirms no API involved | Skip | Directly enter Stage 5 |
| **Feature** | Design spec available + User confirms involves API + API doc available | Skip | Directly enter Stage 5 |
| **Feature** | UI involved + No design spec | Need inquiry | Inquire design spec + **Also ask if involves API** |
| **Feature** | Design spec available + User hasn't confirmed if involves API | Need inquiry | **Must ask if involves API** |
| **Feature** | User confirms involves API + No API doc | Need inquiry | Inquire API doc |

**⚠️ Core Rule**: Cannot self-judge "involves API" or "no API involved", must ask user to confirm.

---

## Output

**Must at least form a minimum Stage 4 checkpoint artifact**:

- `current_stage = stage4`
- `current_stage_status`: `skipped` (skip) / `completed` (complete) / `waiting_user` (wait for user)
- `next_stage = stage5`
- **Material Status Table**: Each material's status (`provided | missing | pending | user_confirmed_not_applicable`)
  - `provided`: Existing material
  - `missing`: Missing material, need inquiry
  - `pending`: Wait for user to confirm if involved
  - `user_confirmed_not_applicable`: User explicitly confirms not involved (cannot self-mark)
- **Judgment Conclusion**: Skip reason or inquiry content

## Fallback Conditions

- If subsequent development phase discovers materials insufficient causing cannot continue, can fallback to this phase to supplement inquiry.
- If user actively supplements new materials, can re-enter this phase to merge.