# paperzod

`paperzod` is a working prototype toolkit for authoring Paperclip doctrine as
structured source, validating the doctrine graph, and compiling it into plain
markdown that Paperclip agents can read directly.

This repo is still a prototype workspace rather than a polished release. The
package is currently `private`, but the core compiler path now exists:

- structured source authoring via `defineSetup(...)`
- source validation and normalization
- graph linking and semantic checks
- compile planning and markdown rendering
- one-way emission
- CLI commands for `validate`, `compile`, and `doctor`

## What `paperzod` is for

Paperclip setups often end up with their real contract spread across many
markdown files:

- role-local `AGENTS.md`
- shared workflow docs
- packet or artifact docs
- standards
- critic criteria
- helper and reference docs

That can work, but it is expensive to keep honest as workflows change.
The real contract is a graph across files, not one file.

`paperzod` is meant to solve that problem by letting you:

1. define one structured source of truth for a setup
2. validate the graph of roles, workflow steps, artifacts, standards, and
   gates
3. compile the runtime output back into ordinary markdown

The markdown output remains the runtime read surface.
The structured source exists so you stop maintaining the graph by hand.

## Scope

This is not a Lessons-only project.

Lessons is the forcing case that made the problem obvious, but the target is
broader:

- Lessons
- Core Dev
- copy or content pods
- project-specific Paperclip setups
- any future Paperclip runtime that needs role contracts and shared workflow
  compiled into markdown

## Current model coverage

The current prototype can represent:

- setups
- roles and agent identities
- workflow steps and handoff order
- turn contracts
- packet and artifact contracts
- shared doctrine
- standards and critic gates
- optional support material
- generated markdown targets
- cross-file links and ownership

## Quick example

Write a setup in structured source:

```ts
import { defineSetup } from "paperzod";

export default defineSetup({
  id: "demo_lessons",
  name: "Demo Lessons",
  roles: [
    {
      id: "section_dossier_engineer",
      name: "Section Dossier Engineer",
      purpose: "Discovers what the learner should learn next.",
    },
    {
      id: "acceptance_critic",
      name: "Lessons Acceptance Critic",
      purpose: "Checks packets before the next lane can trust them.",
    },
  ],
  artifacts: [
    {
      id: "section_dossier",
      name: "SECTION_DOSSIER.md",
      artifactClass: "required",
      runtimePath: "paperclip_home/project_homes/lessons/_authoring/SECTION_DOSSIER.md",
    },
  ],
  workflowSteps: [
    {
      id: "build_section_dossier",
      roleId: "section_dossier_engineer",
      purpose: "Build the section dossier from the learner baseline and research.",
      requiredInputIds: [],
      requiredOutputIds: ["section_dossier"],
      stopLine: "Stop after the dossier is complete and ready for critic review.",
      nextGateId: "critic_review",
    },
  ],
  reviewGates: [
    {
      id: "critic_review",
      name: "Critic Review",
      purpose: "Checks whether the packet is ready for the next lane.",
      checkIds: ["section_dossier"],
    },
  ],
  surfaces: [
    {
      id: "lessons_workflow_doc",
      surfaceClass: "workflow_owner",
      runtimePath: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
    },
  ],
  surfaceSections: [
    {
      id: "default_order",
      surfaceId: "lessons_workflow_doc",
      stableSlug: "default-order",
      title: "Default Order",
    },
  ],
  links: [
    {
      id: "workflow_section_documents_step",
      kind: "documents",
      from: "default_order",
      to: "build_section_dossier",
    },
  ],
  generatedTargets: [
    {
      id: "lessons_workflow_target",
      path: "project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
      sourceIds: ["build_section_dossier"],
      sectionId: "default_order",
    },
  ],
});
```

Validate it in a published or linked install:

```sh
paperzod validate ./setup.mjs
```

Compile it:

```sh
paperzod compile ./setup.mjs --repo-root . --output-root generated
```

Get plain markdown output:

```md
# Workflow Owner

This workflow owner document describes the operational turn order and stop lines.

<a id="default-order"></a>
## Default Order

Build the section dossier from the learner baseline and research.

- Role: section_dossier_engineer
- Reads: none
- Required inputs: none
- Support inputs: none
- Interim artifacts: none
- Required outputs: section_dossier
- Stop line: Stop after the dossier is complete and ready for critic review.
- Next gate: critic_review
```

Inspect graph and rule failures with:

```sh
paperzod doctor ./setup.mjs
```

## Getting started

This section reflects the current prototype workflow.

### 1. Install and build

```sh
npm install
npm run build
```

For repo-local development, invoke the CLI as `node dist/cli/index.js ...`.
The bare `paperzod ...` commands shown elsewhere in this README assume a
published or linked install.

### 2. Create a setup file

Create `setup.mjs`:

```ts
import { defineSetup } from "paperzod";

export default defineSetup({
  id: "demo_lessons",
  name: "Demo Lessons",
  description: "A tiny contrived setup used to prove the compiler pipeline.",
  roles: [
    {
      id: "section_dossier_engineer",
      name: "Section Dossier Engineer",
      purpose: "Discovers what the learner should learn next.",
      boundaries: [
        "Do not write final learner copy.",
        "Do not take over critic or downstream packet work.",
      ],
    },
    {
      id: "acceptance_critic",
      name: "Lessons Acceptance Critic",
      purpose: "Checks whether the current packet is acceptable.",
    },
  ],
  artifacts: [
    {
      id: "section_dossier",
      name: "SECTION_DOSSIER.md",
      artifactClass: "required",
      runtimePath: "paperclip_home/project_homes/lessons/_authoring/SECTION_DOSSIER.md",
    },
    {
      id: "section_dossier_comments",
      name: "dossier research notes",
      artifactClass: "support",
    },
  ],
  reviewGates: [
    {
      id: "critic_review",
      name: "Critic Review",
      purpose: "Checks whether the dossier packet is acceptable.",
      checkIds: ["section_dossier"],
    },
  ],
  workflowSteps: [
    {
      id: "build_section_dossier",
      roleId: "section_dossier_engineer",
      purpose: "Build the section dossier from the learner baseline and research.",
      requiredInputIds: [],
      supportInputIds: ["section_dossier_comments"],
      requiredOutputIds: ["section_dossier"],
      stopLine: "Stop after the dossier is complete and ready for critic review.",
      nextGateId: "critic_review",
    },
  ],
  surfaces: [
    {
      id: "workflow_doc_surface",
      surfaceClass: "workflow_owner",
      runtimePath: "project_homes/demo_lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
    },
  ],
  surfaceSections: [
    {
      id: "default_order",
      surfaceId: "workflow_doc_surface",
      stableSlug: "default-order",
      title: "Default Order",
    },
  ],
  links: [
    {
      id: "step_reads_support_notes",
      kind: "supports",
      from: "build_section_dossier",
      to: "section_dossier_comments",
    },
    {
      id: "step_produces_dossier",
      kind: "produces",
      from: "build_section_dossier",
      to: "section_dossier",
    },
    {
      id: "workflow_section_documents_step",
      kind: "documents",
      from: "default_order",
      to: "build_section_dossier",
    },
  ],
  generatedTargets: [
    {
      id: "workflow_doc",
      path: "project_homes/demo_lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
      sourceIds: ["build_section_dossier"],
      sectionId: "default_order",
    },
  ],
});
```

### 3. Validate the setup

```sh
node ./dist/cli/index.js validate ./setup.mjs
```

Example output:

```text
VALID demo_lessons
documents=1 sections=1
```

### 4. Compile markdown

```sh
node ./dist/cli/index.js compile ./setup.mjs --repo-root . --output-root generated
```

Example output:

```text
COMPILED demo_lessons
mode=dry-run
create workflow_doc_surface /abs/path/generated/project_homes/demo_lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md
```

### 5. Review the generated output

Example generated workflow doc:

```md
# Workflow Owner

This workflow owner document describes the operational turn order and stop lines.

<a id="default-order"></a>
## Default Order

Build the section dossier from the learner baseline and research.

- Role: section_dossier_engineer
- Reads: none
- Required inputs: none
- Support inputs: section_dossier_comments
- Interim artifacts: none
- Required outputs: section_dossier
- Stop line: Stop after the dossier is complete and ready for critic review.
- Next gate: critic_review
```

## One possible project layout

This is one reasonable shape for a real project using `paperzod`:

```text
.
├── paperzod.config.ts
├── paperzod/
│   ├── setups/
│   │   ├── demo-lessons.ts
│   │   └── core-dev.ts
│   ├── shared/
│   │   ├── standards.ts
│   │   └── renderers.ts
│   └── references/
│       └── packet-shapes.ts
├── generated/
│   ├── demo-lessons/
│   └── core-dev/
└── docs/
```

## Current CLI

### `paperzod validate`

Validate source shapes, graph integrity, semantics, and compile planning
without writing files.

```sh
node ./dist/cli/index.js validate ./setup.mjs
```

### `paperzod compile`

Validate and compile markdown output.

```sh
node ./dist/cli/index.js compile ./setup.mjs --repo-root . --output-root generated
node ./dist/cli/index.js compile ./setup.mjs --repo-root . --output-root generated --write
node ./dist/cli/index.js compile ./setup.mjs --repo-root . --output-root paperclip_agents --target paperclip
```

### `paperzod doctor`

Explain graph drift and broken links in a more human-readable way.

```sh
node ./dist/cli/index.js doctor ./setup.mjs
```

Example output:

```text
Doctor report for demo_lessons

No diagnostics.
```

## Current API surface

The current library surface is still intentionally small.

```ts
import {
  defineSetup,
  validateSetup,
  buildGraph,
  renderSetup,
  compileSetup,
  compileAndEmitSetup,
  createTargetAdapter,
  createPaperclipMarkdownTarget,
} from "paperzod";
```

The split should stay clear:

- Zod validates node shapes
- custom graph logic validates cross-node workflow semantics
- renderers turn validated source into markdown
- `buildGraph(...)` consumes normalized data, usually the `data` returned by
  `validateSetup(...)`
- `compileSetup(...)` stays pure and returns the checked render plus target
  manifest
- `compileAndEmitSetup(...)` runs the same compile path and then emits or
  dry-runs file writes

## Contributor workflow

The current prototype loop is:

```sh
npm install
npm run typecheck
npm run test:types
npm test
npm run build
```

If you are extending the proving cases, keep the fixture-first flow:

- add or expand a source fixture under `test/fixtures/source/`
- write the failing suite in the nearest layer-specific test directory
- only then change implementation code
- update `docs/implementation_plan.md` when a phase or release-gate claim changes

## Why Zod

Zod is a good base for this project because it gives us:

- strong shape validation
- type inference
- recursive schema support
- metadata registries
- JSON Schema export when we want machine-readable views

But Zod is only the foundation.
The main product value is still the Paperclip-specific graph model and the
markdown compiler on top of it.

## Document map

- [docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md)
  - product requirements and design boundaries
- [docs/schema.md](/Users/aelaguiz/workspace/paperzod/docs/schema.md)
  - the language and domain model this repo should use
- [docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md)
  - the compiler shape, module boundaries, and validation flow
- [docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md)
  - the end-to-end test plan and release gate for proving the product works
- [docs/example_lessons.md](/Users/aelaguiz/workspace/paperzod/docs/example_lessons.md)
  - the concrete Lessons proving case and where the current prototype still
    simplifies the live `paperclip_agents` tree
- [docs/implementation_plan.md](/Users/aelaguiz/workspace/paperzod/docs/implementation_plan.md)
  - the phased, test-driven implementation plan for building the system
- [docs/ref](/Users/aelaguiz/workspace/paperzod/docs/ref)
  - grounding material copied from the current `paperclip_agents` reference
  - this folder is reference input, not repo-owned draft output

## Current status

What this repo has today:

- a working prototype compiler pipeline
- a buildable package with subpath exports
- a CLI for `validate`, `compile`, and `doctor`
- an automated release gate currently green at `40` test files and `132`
  tests
- end-to-end proving fixtures for:
  - `demo_minimal`
  - `shared_overrides`
  - `lessons_vertical_slice`
  - `lessons_full`
  - `second_setup`
- release-gate style tests for mutations, determinism, and performance
- a vendored Zod checkout for architecture grounding

What it does not have yet:

- polished packaging and release hygiene
- a finalized public authoring UX
- broad real-world fixture coverage beyond the proving cases in this repo
- exact live `paperclip_home/agents/...` role-home parity in the `paperclip`
  target adapter
