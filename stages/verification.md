# Stage 6: Verification

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain verification content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "Documentation update plan" | Prohibited from outputting documentation phase content |
| "After delivery user feedback" | Prohibited from imagining user feedback |
| "Proceeding to documentation sync next" | Prohibited from outputting subsequent phase plans |

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output: `[Verification] Task ID: task_xxxxxxxx`
- State file update must carry Task ID

### 3. After Completion, Automatically Proceed to Next Phase

**After verification completes**:
- Don't output confirmation prompt
- Don't wait for user confirmation
- Automatically proceed to stage7 (Documentation Sync)

---

## Goal

- Verify modifications truly effective before delivery.
- **After completion automatically proceed to stage7, no pause waiting for user confirmation** (user confirmation handled uniformly in stage8).

## Content Handling Rules (Important)

**This Phase Responsibility Boundary**:

| Belongs to This Phase | Does Not Belong to This Phase (Record to Context) |
| --- | --- | --- |
| Functional verification, lint/type/build/test | Code modification (return to stage5) |
| Verification result recording | Documentation update (stage7) |
| Verification failure judgment | User confirmation (stage8) |

**This phase is automatic execution phase, doesn't receive user input**:

```
User cannot provide content in this phase, because:
- This phase doesn't pause waiting for user
- Automatically executes verification flow
- After completion automatically proceeds to stage7

User proposes verification issues in stage8, will return to stage5 → stage6 to re-verify
```

**Note**:
- This phase doesn't receive user content, automatically executes verification
- When verification fails return to stage5, doesn't process user feedback

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit When Entering This Phase

**Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
- Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use edit tool to replace that status block content with:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Verification
**Phase**: stage6
**Status**: in_progress
**Next Step**: Execute functional verification, lint/type/build/test, after completion automatically proceed to stage7
**User Proposed Modifications**: None (don't pause in this phase, handle uniformly in stage8)
**Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
```

### Edit Again After Verification Completion

**After verification completes, directly update status to stage7** (no pause waiting for user confirmation):

```
**Currently Executing**: Documentation Sync
**Phase**: stage7
**Status**: in_progress
**Next Step**: Judge if update project skill + Generate directory documentation
**User Proposed Modifications**: Handle uniformly in stage8
**Loop Path**: stage5 → stage6 → stage7 → stage8 → loop
```

### Prohibited Actions

- Prohibited from guessing paths without reading config file
- **Prohibited from pausing in stage6 waiting for user confirmation** (directly execute to stage8)

## Execution Actions

1. Refer to `rules/frontend-verification.md` to execute verification flow.
2. **Stage 5 completion automatically enters this phase, no user confirmation needed before starting verification**.
3. **Before starting verification, must first invoke skills**:
   - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories
   - **Project skill reference**: `{project_ide_dir}/skills/fw-project-develop/SKILL.md` get verification constraints
   - Use constraints as verification reference, avoid violating project rules
4. Minimum coverage:
   - Functional correctness
   - lint / type / build basic validation
   - Key interactions and regression paths
5. **Based on modification type, must invoke corresponding skills** (dynamic read):
- **Project skill exists** → **First read config file**, dynamically concatenate `{project_ide_dir}/skills/fw-project-develop/SKILL.md`
- **Modifications involve pages, components, forms, keyboard interactions** → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-accessibility/SKILL.md`
- **Modifications involve layout, styles, UI consistency** → **First read config file**, dynamically concatenate `{static_config_dir}/skills/fw-web-design-guidelines/SKILL.md`
6. Only fill `templates/verification/verification-report.md` when need to leave trace, enter long task record or verification process complex.
7. Only when functional verification, key regression and executable lint/type/build/test validation all reach "pass" or "have clear reasonable not_applicable conclusion", can treat as internal verification pass.
8. If validation failure root cause is code issue, return to Stage 5 to fix → **automatically enter Stage 6 → Stage 7 → Stage 8**.
9. If validation failure root cause is environment issue, Node version issue, dependency missing, command not runnable or host condition not satisfied, output clear environment fix suggestions, stay in Stage 5/Stage 6 waiting for fix.
10. **After verification completes, directly enter Stage 7, don't output user confirmation prompt** (user confirmation handled uniformly in Stage 8).

## Output

- Verification results (internal record, don't output for user confirmation):
   - Modified file list
   - Passed verification items (lint/type/build/test/functional)
   - Remaining risks
- After completion automatically enter Stage 7

## Fallback Conditions

- If any key verification fails, return to Stage 5, after fix automatically execute Stage 6 → Stage 7 → Stage 8.
- If failure reason belongs to environment blocker, output environment fix suggestions, stay in Stage 5/Stage 6 waiting for fix.