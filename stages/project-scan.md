# Stage 1: Repository and Project Scan

## ⚠️ Mandatory Rules (Must Follow)

### 1. Single-Stage Output Principle

**This stage output must only contain project scan content — do not anticipate future stages**:

| Prohibited Content | Explanation |
| --- | --- |
| "Page implementation plan" | Prohibited: implementation-stage content |
| "Next we will develop xxx" | Prohibited: future-stage plans |
| Task breakdown lists | Prohibited: self-created task lists |
| "Verification and optimization" | Prohibited: verification-stage content |

**Correct output**:
```
[Project Scan] Task ID: task_xxxxxxxx
Scanning project...
[Project Scan] Project skill fw-project-develop generated.
Please confirm whether we can proceed to the next stage: [Scope Analysis].
```

### 2. Task ID Carrying Principle

**This stage must carry the Task ID**:
- First line of output must include the Task ID: `[Project Scan] Task ID: task_xxxxxxxx`
- State file updates must carry the Task ID
- Prohibited: performing operations outside the task context

### 3. Must Wait for User Confirmation ⚠️ Mandatory Rule

**⚠️ Important: After generating the project skill, must wait for user confirmation before proceeding to the next stage**

After generating the project skill:
- Output the project skill summary
- Output the confirmation prompt
- **End the current reply**
- **Wait for the user to reply "continue" or request changes**

**Prohibited**:
- ❌ Prohibited: proceeding to the next stage immediately after outputting the summary
- ❌ Prohibited: skipping the user confirmation step

---

## Objective

- Use the fixed project skill name `fw-project-develop` as the primary output of this stage
- **Project skill location**: stored in the [Skills Directory]
- If a project skill already exists, first check if it can still be reused or needs to be refreshed
- If no project skill exists, scan the project and generate the first version of `fw-project-develop`

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
**Currently Executing**: Project Scan
**Stage**: stage1
**Status**: in_progress
**Next Step**: Check if project skill exists
```

---

### Step 2: Check Whether the Project Skill Exists

**Perform the following checks first, then decide on the subsequent branch**:

1. **Check whether the fixed project skill name** `fw-project-develop` already exists in the [Skills Directory]
2. **Check whether there are any historical project skill candidates in the [Skills Directory]**

---

### Step 3: Flow When Project Skill Already Exists

**When a project skill already exists, execute the following flow**:

#### 2.1 Verify Whether the Skill Is Stale

- Check whether the frontend project root directory under the [Work Directory] still exists (consistent with the skill record)
- Check whether core entry files exist (e.g., `package.json`, `src/main.*`, `src/index.*`)
- Check whether the technology stack identifier has changed (read the key fields of `dependencies`/`devDependencies` in `package.json`)

**Decision**:
- If all of the above anchors are unchanged → skill is reusable → output summary → output auto-transition prompt to enter the next stage
- If any anchor has changed → skill needs to be refreshed → perform incremental scan → refresh the skill → output auto-transition prompt to enter the next stage

---

### Step 3: Flow When Project Skill Does Not Exist

**⚠️ Important: When the project skill does not exist, the following flow must be executed — do not skip any decision point**

---

#### 3.1 Scan and Identify the Number of Frontend Projects

**Execute the following actions**:

1. Scan the [Work Directory] for frontend projects (detect `package.json`, `src/`, build configuration files, etc.)
2. **Record the number and paths of identified frontend projects**
3. **⚠️ After scanning, immediately enter the decision branch — do not continue with other operations**

---

#### 3.2 Enter the Corresponding Branch Based on Scan Results ⚠️ Decision Branch Point

**⚠️ Important: After scanning, based on the number of identified projects, must enter one of the following branches**

| Identified Result | Branch | Key Action |
| --- | --- | --- |
| 1 frontend project identified | → **Branch A (below)** | Lock project → Output prompt → **Wait for user reply** |
| No frontend project identified | → **Branch B (below)** | Output prompt → **Wait for user reply** |
| Multiple frontend projects identified | → **Branch C (below)** | List projects → Output prompt → **Wait for user reply** |

**⚠️ Prohibited**:
- ❌ Prohibited: reading project files directly after scanning
- ❌ Prohibited: generating the project skill directly after scanning
- ❌ Prohibited: skipping the decision branch and executing subsequent steps directly

---

##### Branch A: Only One Frontend Project Identified ⚠️ Must Wait for User Reply

**⚠️ Important: This branch must ask the user first — do not scan the project content directly**

When the only frontend project is identified, execute the following actions:

1. Lock the project path
2. **Immediately output the following prompt**:
   ```
   Frontend project locked: [project path].

   You may directly reply with project skills, project documentation, or other project constraints,
   and I will prioritize your materials when generating the project skill.
   If you do not provide anything, I will analyze and generate based on the [Work Directory] content.
   ```
3. **End the current reply and wait for the user's response**

**⚠️ Prohibited**:
- ❌ Prohibited: continuing to analyze the project structure after outputting the prompt
- ❌ Prohibited: scanning the project directly after outputting the prompt
- ❌ Prohibited: generating the project skill after outputting the prompt
- ❌ Prohibited: skipping the user inquiry step

---

###### Execute Project Scan After User Reply (Only Execute After User Replies)

**⚠️ This step is only executed after the user replies — it is not a continuation of Step 3**

After the user replies, handle as follows:

| User Reply | Action |
| --- | --- |
| Provides project skills/docs/constraints | Prioritize reading user materials → Generate `fw-project-develop` |
| Explicitly says "don't provide" / "skip" / "none" | Execute project scan flow → Generate `fw-project-develop` |
| Empty reply or "continue" | Treat as "don't provide", execute project scan flow |

**Project scan flow** (only execute after user replies):

**⚠️ Important: The following steps must be executed in order — do not skip**

1. **Read core project files**
   - Read `package.json` for dependencies and scripts
   - Read entry files (`src/main.tsx`, `src/index.tsx`, `src/App.tsx`, etc.)

2. **Analyze project structure and technology stack**
   - Load skill `fw-code-analysis-doc` to analyze the directory structure and get guidance
   - Analyze the project directory structure based on skill guidance
   - Extract technology stack information (framework, language, UI library, etc.)
   - Analyze module relationships and dependencies

3. **Generate the fw-project-develop skill file**
   - Write the analysis results into `fw-project-develop/SKILL.md`
   - Record key information: project structure, technology stack, entry files, etc.

**After execution, proceed to Step 4**

---

##### Branch B: No Frontend Project Identified ⚠️ Must Wait for User Reply

**⚠️ Important: This branch must ask the user about their intent first**

When no frontend project is identified, execute the following actions:

1. **Immediately output the following prompt**:
   ```
   [Project Scan] No frontend project identified in the [Work Directory].

   Please reply with your intent:

   1. If you want to create a new project, provide the technology stack:
      - Framework: React / Vue / Angular / Svelte
      - Language: TypeScript / JavaScript
      - UI Library: Ant Design / Element Plus / Tailwind CSS, etc.
      
      Example: "Create project: React + TypeScript + Ant Design"

   2. If you do not want to create a project, reply "don't create" or "skip"

   3. If you have an existing project, provide the path: "path is: xxx"
   ```
2. **End the current reply and wait for the user's response**

**⚠️ Prohibited**:
- ❌ Prohibited: continuing to execute other operations after outputting the prompt
- ❌ Prohibited: skipping the user inquiry step

---

###### Extract Content After User Reply (Only Execute After User Replies)

**⚠️ This step is only executed after the user replies**

**Extract two categories of information from the user's reply**:

| Information Type | Extraction Rule | Handling |
| --- | --- | --- |
| **Initialization info** | Technology stack, framework, language, UI library, etc. | Handle in the current stage (stage1) immediately |
| **Development requirement info** | Feature requirements, page descriptions, etc. | Record to task context, process in stage2 |

**Execute based on user intent**:

| User Reply | Action |
| --- | --- |
| Technology stack extracted | Execute project initialization → Execute project scan → Generate project skill → Output auto-transition prompt to the next stage |
| Replies "exit" or "end" | Terminate the flow |
| Replies "skip" or empty reply | Use default setup (React + TypeScript + Ant Design) → Execute initialization |
| Provides an existing project path | Switch path and re-scan |
| Only development requirement, no technology stack | Output prompt to supplement the technology stack |

---

##### Branch C: Multiple Frontend Projects Identified ⚠️ Must Wait for User Selection

**⚠️ Important: This branch must ask the user to select a project — do not auto-select**

When multiple frontend projects are identified, execute the following actions:

1. List all identified frontend project paths
2. **Immediately output the following prompt**:
   ```
   Multiple frontend projects identified:
   1. [project path 1]
   2. [project path 2]
   ...

   Please reply with which project to continue with (reply with the project path or number).
   ```
3. **End the current reply and wait for the user's response**

**⚠️ Prohibited**:
- ❌ Prohibited: auto-selecting a project after outputting the prompt
- ❌ Prohibited: skipping the user inquiry step

**After the user replies**: Lock the user-selected project → Enter Branch A's flow (output prompt asking if the user wants to provide materials)

---

### Step 4: Output Project Skill Summary and Wait for User Confirmation ⚠️ Must Wait for User Confirmation

**⚠️ Important: After generating the project skill, must wait for user confirmation before proceeding to the next stage**

**⚠️ This step is only executed after the project skill is generated — it is not a continuation of Step 3**

After generating the project skill, execute the following actions:

#### 4.1 Update the State File to Waiting for User

```
**Task ID**: {current task ID}
**Currently Executing**: Project Scan
**Stage**: stage1
**Status**: waiting_user
**Next Step**: Wait for user confirmation that the project skill is correct
```

#### 4.2 Output Summary and Append Confirmation Prompt

```
The above is the conclusion of this stage: project skill fw-project-develop has been generated.

Please confirm whether we can proceed to the next stage: [Scope Analysis].
- If there are discrepancies or additions, please let me know directly.
- If no changes are needed, reply "continue".
```

**End the current reply after outputting the prompt and wait for user confirmation**

**⚠️ Prohibited**:
- ❌ Prohibited: proceeding to the next stage immediately after outputting the summary
- ❌ Prohibited: skipping the user confirmation step

**End the current reply after outputting the prompt and wait for user confirmation**

---

### Step 5: User Confirmation Loop Mechanism

**After the user replies, handle as follows**:

| User Reply | Handling Action |
| --- | --- |
| Replies "continue" | Output auto-transition prompt to the next stage |
| Raises changes or questions | Merge user feedback → Update fw-project-develop → Output summary again |

#### 5.1 Flow When User Raises Changes

1. Update status to in_progress
2. Execute merge update: read user feedback → merge into `fw-project-develop`
3. Output the summary again
4. Enter the waiting state again
5. Loop until the user replies "continue"

---

### Step 6: Output Auto-Transition Prompt to the Next Stage

**After the user replies "continue"**:

#### 6.1 Update the State File

```
**Task ID**: {current task ID}
**Currently Executing**: Scope Analysis
**Stage**: stage2
**Status**: in_progress
**Next Step**: Execute ./scope-analysis.md
```

#### 6.2 Output Auto-Transition Prompt

```
[Project Scan] Execution complete. Proceeding to the next stage: [Scope Analysis].
```

---

## General Scan Rules (All Branches Follow)

**When executing a project scan, follow these rules**:

1. **Read directory documentation first**:
   - Before scanning any directory, check whether documentation files exist (e.g., `README.md`, `AGENTS.md`)
   - If documentation exists → Read it first to understand the directory

2. **Invoke the code analysis skill**:
   - When analyzing directory structures, extracting the technology stack, or understanding module relationships, invoke skill `fw-code-analysis-doc` to analyze the directory and generate documentation
   - Purpose: improve analysis accuracy and reduce omissions

---

## Project Skill Invalidation Criteria

The following situations indicate that the project skill needs to be refreshed:

- The frontend project root directory, core directory structure, or entry files under the [Work Directory] have changed significantly
- The technology stack, build approach, routing strategy, permission model, or state management approach has changed
- The UI framework type, framework version, component entry point, or custom framework directory has changed
- The existing project skill is missing key directory routes or development constraints required for the current task
- The user has provided new project skills, project documentation, UI framework documentation, or UI framework skills
- The user explicitly indicates that the project skill content is inaccurate or outdated

---

## General Rules (All Branches)

1. In this stage, only "stable project knowledge" may be written into `fw-project-develop` — do not write temporary implementation approaches or implementation preferences for the current task

2. The completion condition for Stage 1 is: `fw-project-develop` has been confirmed to exist, is reusable, has been refreshed, or has been newly generated, and has been confirmed by the user

3. If the skill has not been generated/refreshed or the user has not confirmed, do not proceed to Stage 2

4. If a UI library or custom component system is detected, determine whether it is a general library or a custom framework:
   - General library: record the name and version
   - Custom framework: determine whether to output a prompt asking the user for documentation/skills

5. If the user has not yet answered the UI framework materials question (`pending`), stay in this stage

6. If the user corrects the project understanding or discovers the skill is stale, re-execute this stage and refresh the skill

7. Use the following templates as analysis scaffolding:
   - `../templates/project/project-skill-template.md`
   - `../templates/project/project-ui-skill-template.md`

---

## Output

- Primary output: `fw-project-develop`
- Project-level UI framework skill generated or refreshed as needed

---

## Rollback Conditions

- If the implementation stage discovers a mismatch between the project skill and the actual structure, roll back to this stage to re-scan and refresh the project skill
- If the initialization selection, project skill source, or UI framework conclusion is found to be inaccurate later, roll back to this stage to re-scan and refresh the corresponding skill
- If the user input that this stage depends on is missing, changed, or withdrawn, return to this stage and re-output the prompt
