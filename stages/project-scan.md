# Stage 1: Scan Repository and Project

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single Phase Output Principle

**This phase output must only contain project scan content, prohibited from imagining future phases**:

| Prohibited Content | Description |
| --- | --- |
| "Page implementation plan" | Prohibited from outputting implementation phase content |
| "Will develop xxx next" | Prohibited from outputting future phase plans |
| Task breakdown list | Prohibited from creating task lists |
| "Verification and optimization" | Prohibited from outputting verification phase content |

**Correct Output**:
```
[Project Scan] Task ID: task_xxxxxxxx
Scanning project...
[Project Scan] Generated project skill fw-project-develop.
Please confirm if we can proceed to next phase: [Scope Analysis].
```

### 2. Task ID Carrying Principle

**This phase must carry Task ID**:
- First line output must contain Task ID: `[Project Scan] Task ID: task_xxxxxxxx`
- State file update must carry Task ID
- Prohibited from executing operations outside task context

### 3. Must Wait for User Confirmation

**After project skill generation**:
- Output project skill summary
- Output confirmation prompt
- End current reply
- Wait for user to reply "continue" or propose modifications

---

## Goal

- Use fixed project skill name `fw-project-develop` as this phase's main artifact.
- **Project Skill Location**: Stored in Skill Directory.
- If project skills already exist, first check if still reusable, if needs refresh.
- If no project skills yet, scan project and generate initial `fw-project-develop`.
- If user supplements project skills, project documentation or project constraints, must first determine if they belong to "project long-term rules" or "current task constraints"; only project long-term rules are merged into project skill artifact, then decide if refresh needed.

## Step 1: Update State File

**After entering this phase, must immediately execute the following edit operations**:

### Edit When Entering This Phase

**Find corresponding status block based on current Task ID (get `current_task_id` from context)**:
- Find content between `<!-- TASK_{TASK_ID_UPPERCASE}_START -->` and `<!-- TASK_{TASK_ID_UPPERCASE}_END -->`
- Use edit tool to replace that status block content with:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Project Scan
**Phase**: stage1
**Status**: in_progress
**Next Step**: Execute project scan, output project skill summary
**User Proposed Modifications**: Status stays stage1 → merge user feedback → update fw-project-develop → re-output summary
**Loop Path**: stage1 → stage1 → loop until user replies "continue"
```

### Edit Again After Outputting Summary

When waiting for user confirmation, use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Project Scan
**Phase**: stage1
**Status**: waiting_user
**Next Step**: Wait for user to confirm if project skill is correct
**User Proposed Modifications**: Status stays stage1 → execute merge update → re-output summary → wait for confirmation
**Loop Path**: stage1 → stage1 → loop until user replies "continue"
```

### Edit Again When User Proposes Modifications

**Loop path when user proposes modifications/issues**:

1. **Status stays stage1**:
   ```
   **Currently Executing**: Project Scan
   **Phase**: stage1
   **Status**: in_progress
   **Next Step**: Merge user feedback, update fw-project-develop
   **User Proposed Modifications**: Status stays stage1 → merge update → re-output summary
   **Loop Path**: stage1 → stage1 → loop until user replies "continue"
   ```

2. **Execute Merge Update**: Read user feedback → merge into fw-project-develop

3. **Re-output Summary**: Output updated project skill summary

4. **Re-enter Wait State**:
   ```
   **Currently Executing**: Project Scan
   **Phase**: stage1
   **Status**: waiting_user
   **Next Step**: Wait for user to confirm updated project skill
   **User Proposed Modifications**: Status stays stage1 → merge update → re-output summary
   **Loop Path**: stage1 → stage1 → loop until user replies "continue"
   ```

5. **Loop until user replies "continue"**, then proceed to next phase

### Edit Again After User Confirmation

Before proceeding to next phase, use edit tool again to update that Task ID's status block to:

```
**Task ID**: {Current Task ID}
**Currently Executing**: Scope Analysis
**Phase**: stage2
**Status**: in_progress
**Next Step**: Execute stages/scope-analysis.md
**User Proposed Modifications**: Status stays stage2 → merge user feedback → update analysis conclusion → re-output
**Loop Path**: stage2 → stage2 → loop until user replies "continue"
```

### Prohibited Actions

- Prohibited from guessing paths without reading config file
- Prohibited from not updating status to waiting_user when waiting for user

See "Directory Concept Mapping" in `SKILL.md`.

## Input

- Working Directory
- Existing project skill candidates in Skill Directory, including historical project skill candidates and generated project skill artifacts
- Existing directory documentation, entry files, build files, script configurations
- User-supplemented project skills, project documentation, UI framework documentation, UI framework skills

## Project Skill Invalidity Determination

- Frontend project root directory, core directory structure or entry files in Working Directory have significantly changed.
- Tech stack, build method, routing scheme, permission model, state management solution changed.
- UI framework type, version, component main entry or self-developed framework directory changed.
- Existing project skill lacks critical directory routing or development constraints required for this task.
- User provided new project skills, project documentation, UI framework documentation or UI framework skills, and have overridden old sources.
- User explicitly stated project skill content is inaccurate or expired.
- Working Directory added new frontend sub-project, but project skill hasn't covered it yet.

## Execution Actions

### General Scan Rules (All Branches Must Follow)

**Before executing any project scan action, must follow these rules**:

1. **Prioritize Reading Directory Documentation**:
   - Before scanning any directory, first check if directory documentation exists (like `README.md`, `AGENTS.md`)
   - If documentation exists → **Prioritize reading documentation to get directory info**, reduce code analysis workload
   - Documentation info priority: higher than code analysis results
   - **Prohibited**: Skip documentation and directly analyze code

2. **Must Invoke Code Analysis Skill**:
   - Project scan **must invoke** `fw-code-analysis-doc` skill for auxiliary analysis
   - Invocation method: **First read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md`
   - Invocation timing: When need to analyze directory structure, extract tech stack, understand module relationships
   - Invocation purpose: Improve analysis accuracy, reduce omissions
   - **Prohibited**: Skip skill invocation and directly analyze code

### First Priority: Check if Project Skill Already Exists

**Must execute the following actions first, then decide if need to scan project**:

1. **Check if fixed project skill name `fw-project-develop` already exists in Skill Directory**
2. **Check if historical project skill candidates already exist in Skill Directory** (like project-specific skills in old skill directories)

### Branch A: Project Skill Already Exists

**If reusable project skill exists, process in the following order**:

3. **First quick verify if skill is expired** (don't scan whole project, only check key anchors):
   - Check if frontend project root directory exists in Working Directory (consistent with skill record)
   - Check if core entry files exist (like `package.json`, `src/main.*`, `src/index.*`)
   - Check if tech stack identifiers changed (read `package.json` dependencies/devDependencies key fields)
   - If all anchors unchanged → **Skill reusable, skip project scan**
   - If any anchor changed → **Skill needs refresh, enter incremental scan**

4. If skill reusable:
   - Output: `Detected existing project skill [fw-project-develop], after quick verification skill content is consistent with project current state, no update needed. Please confirm if project skill is correct.`
   - Wait for user confirmation
   - After user confirmation → Skill as Stage 1 main artifact, proceed to Stage 2

5. If skill needs refresh:
   - Output: `Detected existing project skill [fw-project-develop], but project key anchors have changed (specific change points), need to update skill. I will execute incremental scan and refresh skill.`
   - **Execute incremental scan flow**:
     - 1) Prioritize reading documentation in changed directories
     - 2) **Must first read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` analyze changed parts
     - 3) Merge old and new info, refresh skill
   - After refreshing skill, output summary, wait for user confirmation
   - **User confirmation loop mechanism**: If user proposes modifications or issues → Understand and merge user feedback → Update skill → Re-output summary wait for confirmation → Until user replies "continue"

### Branch B: Project Skill Does Not Exist

**If no reusable project skill exists, process in the following order**:

6. **Identify frontend project count** (three scenarios):
   - No frontend project identified → Enter "whether to initialize frontend project" inquiry branch
   - Single frontend project identified → Directly lock that project, continue execution
   - Multiple frontend projects identified → Ask user which project to continue based on

7. Only when multiple projects or no project, ask user branch selection question in first round; if already locked single frontend project, first round no extra inquiry.

8. If user hasn't clearly answered "multiple project selection" or "whether to initialize" (pending), stay in this phase waiting, don't continue scanning.

---

### Branch B-0: No Frontend Project Identified (Critical Branch)

**Flow Description**:

When no frontend project identified, execute in the following order:

#### Step 1: Ask User Intent

**Must first ask user intent, clarify subsequent flow**:

**Recommendation: Inquiry prompt should be main content of this round reply, avoid outputting other analysis content simultaneously, ensure user can clearly understand current question to answer.**

Output the following inquiry prompt:

```
[Project Scan] No frontend project identified in Working Directory.

Please reply your intent:

1. If want to create new project, please provide tech stack:
   - Framework: React / Vue / Angular / Svelte
   - Language: TypeScript / JavaScript
   - UI Library: Ant Design / Element Plus / Tailwind CSS etc.
   
   Example: "Create project: React + TypeScript + Ant Design"

2. If don't want to create project, reply "no create" or "skip"

3. If have existing project, please provide path: "Path is: xxx"

You can also provide feature requirements, page descriptions etc., I will first complete project initialization, then process development requirements later.
```

**After asking must end current reply, wait for user response**

---

#### Step 2: Content Extraction After User Response (Must Execute)

**After receiving user response, must first extract content, then decide execution path**:

### Content Extraction Rules

**Extract two types of info from user response**:

| Info Type | Extraction Rule | Handling Method |
| --- | --- | --- |
| **Initialization Info** | Tech stack, framework, language, UI library etc. | Current phase (stage1) immediately process |
| **Development Requirement Info** | Feature requirements, page descriptions, bug descriptions etc. | Record to task context, wait for stage2 to process |

### Extraction Example

```
User response: "Create project: React + TypeScript + Ant Design, need login page, user management, permission control"

Extraction result:
- Initialization info: React + TypeScript + Ant Design
- Development requirement info: Login page, user management, permission control

Handling method:
1. Current phase: Use initialization info to execute project initialization
2. Record development requirement info to task context (for stage2 use)
3. After project initialization completes, proceed to stage2 to process development requirements
```

---

#### Step 3: Intent Judgment

**Based on extracted initialization info, judge intent type**:

| Extraction Result | Intent Type | Execution Path |
| --- | --- | --- |
| Extracted tech stack (like React/Vue/Angular) | **Initialization Intent** | Enter project initialization flow |
| User replied "exit" or "end" | **Terminate Intent** | Terminate flow |
| Empty reply or "skip" | **Default Plan Intent** | Use default tech stack initialization (React + TypeScript + Ant Design) |
| User provided existing project path | **Path Switch Intent** | Switch path and re-scan |
| Only extracted development requirements, no tech stack info | **Need Supplement Tech Stack** | Ask for supplement |

---

#### Step 4: Record Development Requirement Info

**If user provided development requirement info (like feature requirements, page descriptions), must record to task context**:

```
[Project Scan] Recorded your development requirements:
- Login page
- User management
- Permission control

These requirements will be processed in [Scope Analysis] phase after project initialization completes.
```

**Record Location**: Task context variable `pending_requirements`

---

#### Step 5: When Need to Supplement Tech Stack

**If user only provided development requirements, didn't provide tech stack, must ask for supplement**:

**Recommendation: Inquiry prompt should be main content of this round reply, avoid outputting detailed analysis of development requirements simultaneously.**

```
[Project Scan] I understand you have development requirements, but currently need to create frontend project first.

Please supplement tech stack info:
- Framework: React / Vue / Angular / Svelte
- Language: TypeScript / JavaScript  
- UI Library: Ant Design / Element Plus / Tailwind CSS etc.

Example: "React + TypeScript + Ant Design"

After supplementing I will first complete project initialization, then process your development requirements.
```

**After asking must end current reply, wait for user supplement**

---

#### Step 6: Execute Project Initialization

**After user supplements complete tech stack, execute initialization**:

1. **Output initialization prompt**:
   ```
   [Project Scan] Initializing project: [Framework] + [Language] + [UI Library]...
   [Project Scan] Recorded development requirements: [Development requirements summary], will process in subsequent phases
   ```

2. **Execute initialization command**

3. **After initialization success** → Execute project scan → Generate project skill → Wait for user confirmation

4. **After user confirmation** → Proceed to stage2 (process development requirements)

---

### Branch B-1: Locked Single Frontend Project, No Skill Exists

**Flow Description**:

When locked single frontend project and no project skill exists, execute in the following order:

1. **Ask user if willing to provide project materials** (mid-way inquiry prompt)
   - Prompt: `You can directly reply to provide project skills, project documentation or other project constraints, I will prioritize using your materials to generate project skill. If you don't provide, I will analyze based on Working Directory content and generate.`
   - **After asking must end current reply, wait for user response**
   - **Prohibited**: After asking continue analyzing, designing, implementing

2. **After user response, must continue current phase (Project Scan), cannot jump to other phases**
    - User provides materials → **Prioritize reading user materials**
    - **First read config file** `{project_ide_dir}/.fw-session-config.json`, get three core directories, **dynamically concatenate path** `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` supplement analysis → Generate `fw-project-develop` based on materials and analysis results
   - User explicitly says "not provide"/"skip" → **Execute project scan flow**:
     - 1) Prioritize reading each directory's documentation
     - 2) **First read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` and execute project structure analysis
      - 3) Generate `fw-project-develop`
   - **Prohibited**: After user response jump to scope analysis, implementation etc. phases

3. **After generating project skill, output summary, wait for user confirmation**
   - **Recommendation: Summary and confirmation prompt should be main content of this round reply**
   - Output project skill summary
   - Append prompt:
     ```
     Above is this phase conclusion: Generated project skill fw-project-develop.
     
     Please confirm if we can proceed to next phase: [Scope Analysis].
     - If have deviation or supplement, please tell me directly.
     - If no other modifications, reply "continue" is fine.
     ```
   - **After asking must end current reply, wait for user confirmation**

4. **User Confirmation Loop Mechanism (Must Execute)**
   - User replies "continue" → Output `[Project Scan] Completed. Proceeding to next phase: [Scope Analysis].` → Proceed to Stage 2
   - User proposes modifications or issues → **Understand and merge user feedback** → Update `fw-project-develop` → Re-output summary wait for confirmation
   - **Loop until user replies "continue"**
   - **Prohibited**: Proceed to next phase before user explicitly replies "continue"

---

### Branch B-2: User Chooses to Initialize New Project

**Flow Description**:

When user explicitly chooses to initialize new frontend project, execute in the following order:

#### Step 1: Parse User Initialization Intent

**Parse initialization parameters from user response**:

```
User response examples:
- "Create project: React + TypeScript + Ant Design"
- "Initialize a Vue3 project"
- "New Angular project, use Tailwind CSS"

Parse rules:
- Underlying framework: React / Vue / Angular / Svelte etc.
- Language: TypeScript / JavaScript
- UI Library: Ant Design / Element UI / Tailwind CSS etc.

If user response incomplete (only says "create project" but didn't specify framework):
→ Output inquiry prompt to supplement info, cannot infer by yourself
```

**Recommendation: Inquiry prompt should be main content of this round reply.**

**If info incomplete, output inquiry prompt**:

```
[Project Scan] Please supplement initialization parameters:

Please reply complete format:
- "Create project: React/Vue/Angular + TypeScript/JavaScript + [UI Library]"

Examples:
- "Create project: React + TypeScript + Ant Design"
- "Create project: Vue3 + TypeScript + Element Plus"
```

**After asking must end current reply, wait for user supplement**

---

#### Step 2: Execute Project Initialization

**After user supplements complete, execute initialization**:

1. **Output initialization prompt**:
   ```
   [Project Scan] Initializing project: [Framework] + [Language] + [UI Library]...
   ```

2. **Execute initialization command** (choose corresponding command based on framework):
   - React: `npm create vite@latest` or `npx create-react-app`
   - Vue: `npm create vue@latest`
   - Angular: `ng new`
   - Other frameworks: Corresponding official initialization command

3. **Initialization result handling**:
   - Success → Output `[Project Scan] Project initialization complete.` → Continue
   - Failure → Output error info, wait for user handling

---

#### Step 3: Scan New Project Structure

**After initialization success, must execute project scan** (cannot skip):

1. **Output scan prompt**:
   ```
   [Project Scan] Scanning new project structure...
   ```

2. **Scan flow**:
    - 1) Prioritize reading documentation under each directory
    - 2) **First read config file** `{project_ide_dir}/.fw-session-config.json`, dynamically concatenate `{static_config_dir}/skills/fw-code-analysis-doc/SKILL.md` and execute project structure analysis
    - 3) Extract: Directory structure, entry files, build commands, tech stack, UI library, coupling constraints

3. **After scan completes**, generate project skill

---

#### Step 4: Generate Project Skill

**After scan completes, must generate project skill**:

1. **Generate initial project skill `fw-project-develop` based on scan results**
2. **Cannot skip skill generation**

---

#### Step 5: Output Project Skill Summary and Wait for User Confirmation

After outputting summary, append prompt:

```
Above is this phase conclusion: Initialized project and generated project skill fw-project-develop.

Project info:
- Framework: [Parsed framework]
- Language: [Parsed language]
- UI Library: [Parsed UI library]
- Directory structure: [Summary]

Please confirm if we can proceed to next phase: [Scope Analysis].
- If have deviation or supplement, please tell me directly.
- If no other modifications, reply "continue" is fine.
```

**After asking end current reply, wait for user confirmation**

---

#### Step 6: User Confirmation Loop Mechanism

- User replies "continue" → Output `[Project Scan] Completed. Proceeding to next phase: [Scope Analysis].` → Proceed to Stage 2
- User proposes modifications or issues → Understand and merge user feedback → Update `fw-project-develop` → Re-output summary wait for confirmation
- **Loop until user replies "continue"**

**Note**:
- Cannot treat "project created" or "dependencies installed" as Stage 1 complete
- Must complete scan → generate skill → user confirmation, that counts as Stage 1 complete

---

### Branch B-3: User Exits Skill

- If user replies "exit" or "end" → **Terminate flow**, don't enter Stage 2 and subsequent phases
- Output: `Recorded your exit from this skill. Task terminated.`

### Branch B-4: User Skip/Empty Reply (Use Default Plan)

- If user replies "skip" or empty reply → **Use default plan** (React + TypeScript + Ant Design)
- Execute default tech stack project initialization flow
- Output: `Using default plan: React + TypeScript + Ant Design. Initializing project...`

### General Rules (All Branches)

11. This phase only allows writing "stable project knowledge" to `fw-project-develop` (directory structure, tech stack, build method, routing mode, UI framework, long-term constraints), cannot write current task's temporary implementation methods or preferences.

12. Stage 1 completion condition is: `fw-project-develop` confirmed to exist, reusable, refreshed or newly generated, and already user confirmed.

13. If skill hasn't generated/refreshed or hasn't waited for user confirmation, cannot enter Stage 2.

14. If identified UI library or self-developed component system, determine if common library or self-developed framework:
    - Common library: Record name and version
    - Self-developed framework: Determine if need to ask user for documentation/skills

15. If user hasn't answered UI framework materials question (pending), stay in this phase, cannot jump to development implementation.

16. Use the following templates as analysis scaffolding:
    - `templates/project/project-skill-template.md`
    - `templates/project/project-ui-skill-template.md`

17. If user corrects project understanding or discovers skill expired, re-execute this phase and refresh skill.

## Output

- Main artifact: `fw-project-develop`
- Generated or refreshed project-level UI framework skill as needed
- If user supplemented project skills / project documentation / project constraints, these contents have been merged into main artifact, or explicitly marked as pending source

**User Confirmation Prompt** (Phase end confirmation):

After outputting project skill summary, must append the following prompt:

```
Above is this phase conclusion: Generated project skill fw-project-develop.

Please confirm if we can proceed to next phase: [Scope Analysis].
- If have deviation or supplement, please tell me directly.
- If no other modifications, reply "continue" is fine.
```

## Fallback Conditions

- If implementation phase discovers project skill inconsistent with actual structure, fallback to this phase to re-scan and refresh project skill.
- If later discovers initialization selection, project skill source or UI framework conclusion distorted, fallback to this phase to re-scan and refresh corresponding skill.
- If this phase's dependent user input is missing, changed or withdrawn, return to this phase to re-ask and override old conclusion.