# paperzod

`paperzod` is a doctrine compiler for Paperclip systems.

It lets you define one structured source of truth for roles, workflow steps,
packet contracts, standards, gates, references, and runtime doctrine surfaces,
then compile the markdown that agents actually read.

The point is simple: if a setup has ten role guides, a shared workflow owner,
packet workflow docs, critic standards, gate rules, and a few technical
references, you should not hand-maintain all of those files separately.

With `paperzod`, you:

- define the semantic graph once
- define reusable document shapes once
- keep long prose in normal markdown fragments where humans should own the words
- compile repo-owned markdown output for runtime use

Structured source is the only semantic truth.
Generated markdown is runtime output.

## What You Get

- reusable document shapes for role homes, workflow owners, packet workflows,
  standards, gates, references, how-to guides, and coordination docs
- setup-local roles, workflow steps, packet contracts, artifacts, read order,
  handoff rules, stop lines, and output paths
- authored markdown fragments for the sections where humans should write the
  prose directly
- graph validation for ownership, reads, routes, trust rules, gate checks, and
  generation provenance
- deterministic compile plans and plain markdown emission
- target adapters for both generic output trees and real Paperclip
  `paperclip_home/**` layouts

## The Core Idea

Take a small workflow with three roles:

- `Writer`
- `Critic`
- `Publisher`

The human problem is not storing three nodes and a few edges.
The real problem is keeping all of these runtime docs honest at the same time:

- a role guide for `Writer`
- a role guide for `Critic`
- a role guide for `Publisher`
- one shared workflow doc that shows the step order
- one standards doc that tells the critic what to check

In `paperzod`, you do not hand-write all of those surfaces separately.

You define:

- the reusable shape for a role home
- the reusable shape for a workflow owner doc
- the reusable shape for a standard
- the actual workflow facts for this setup
- the authored prose fragments that should stay in markdown

Then `paperzod` compiles the runtime docs for you.

That same pattern scales up to larger and more demanding systems without
changing the product boundary.

## What A Setup Author Does

The authoring flow has four parts:

1. Define reusable document shapes.
2. Fill those shapes with setup-local roles, workflow steps, standards, and
   paths.
3. Load authored markdown fragments for the prose humans should own directly.
4. Compile the runtime markdown that agents will read.

That means a setup author does not hand-maintain ten slightly different
`AGENTS.md` files.
They define one role-home shape, fill it with real facts for each role, and
let the compiler keep the generated output aligned.

## Small Example

The example below shows the product surface: reusable templates, setup-local
facts, authored fragments, and repo-local `.ts` compilation.

```ts
import {
  defineSetup,
  defineTemplate,
  loadFragments,
} from "paperzod";

const roleHome = defineTemplate({
  id: "role_home",
  surfaceClass: "role_home",
  sections: ["read_first", "your_job", "inputs", "outputs", "stop_line"],
});

const workflowOwner = defineTemplate({
  id: "workflow_owner",
  surfaceClass: "workflow_owner",
  sections: ["goal", "step_order", "handoff_rules", "send_back_rules"],
});

const draftQuality = defineTemplate({
  id: "draft_quality_standard",
  surfaceClass: "standard",
  sections: ["what_good_looks_like", "send_back_when", "examples"],
});

const workflowText = loadFragments("./fragments/workflow", {
  goal: "goal.md",
  handoffRules: "handoff_rules.md",
  sendBackRules: "send_back_rules.md",
});

export default defineSetup({
  id: "editorial",
  name: "Editorial",
  templates: [roleHome, workflowOwner, draftQuality],
  roles: [
    {
      id: "writer",
      name: "Writer",
      template: "role_home",
      reads: ["shared.workflow", "standards.draft_quality", "packets.brief"],
      writes: ["packets.draft"],
      stopLine: "Stop when the draft is ready for critic review.",
      nextRoleId: "critic",
    },
    {
      id: "critic",
      name: "Critic",
      template: "role_home",
      reads: ["shared.workflow", "standards.draft_quality", "packets.draft"],
      writes: ["packets.review"],
      stopLine: "Stop when the draft either passes or goes back with clear notes.",
      nextRoleId: "publisher",
    },
  ],
  workflows: [
    {
      id: "main",
      template: "workflow_owner",
      steps: ["writer", "critic", "publisher"],
      sections: {
        goal: workflowText.goal,
        handoff_rules: workflowText.handoffRules,
        send_back_rules: workflowText.sendBackRules,
      },
      rules: [
        "Critic review must happen before publish.",
        "Publisher cannot skip critic review.",
      ],
    },
  ],
  standards: [
    {
      id: "draft_quality",
      name: "Draft Quality Standard",
      template: "draft_quality_standard",
    },
  ],
});
```

The long prose still lives in plain markdown files such as:

- `fragments/workflow/goal.md`
- `fragments/workflow/handoff_rules.md`
- `fragments/workflow/send_back_rules.md`

TypeScript owns the graph, ids, paths, routing, and validation.
Markdown owns the prose humans should write directly.

## What You Compile

For a generic setup:

```sh
paperzod doctor setups/editorial/index.ts
paperzod compile setups/editorial/index.ts --repo-root . --output-root generated --write
```

For a Paperclip runtime tree:

```sh
paperzod doctor setups/product_docs/index.ts
paperzod compile setups/product_docs/index.ts --target paperclip --repo-root . --output-root . --write
```

The compiler accepts repo-local authored `.ts`, `.mts`, and `.cts` setup files directly.
That path is intentionally narrow:

- use Node `>=24.12.0`
- keep setup modules to erasable TypeScript
- use explicit local file extensions when you import another repo-local `.ts` file
- do not rely on `tsconfig`-only runtime features such as path aliases

## What Comes Back

`paperzod` emits plain markdown.

That output can include:

- role homes under `paperclip_home/agents/<role>/AGENTS.md`
- the project-home root `README.md`
- shared entrypoint docs
- authoritative workflow owner docs
- per-lane packet workflow docs
- standards
- gate docs
- technical references
- how-to guides
- coordination docs

The markdown remains the runtime read surface.
The structured source exists so the graph does not have to be maintained by
hand.

## Proving The Generic System

This repo is a generic open source compiler.
It is not a Lessons-specific product.

The repo proves the generic system against multiple setup shapes, including one
high-fidelity Lessons-shaped fixture because that is a demanding real-world
case. That fixture is a proving target, not the public product boundary, and
the open source project does not depend on proprietary Lessons source code.

What the proving cases are meant to show is generic:

- the compiler can own role homes, shared workflow docs, standards, gates, and
  references for a real setup
- the model can represent conceptual contracts separately from the current
  runtime file bundle
- section-level ownership, reads, gates, and generation provenance hold up
  under pressure
- the same compiler path works for more than one setup family

## One-Way By Design

`paperzod` is a one-way compiler.

- authored source is the semantic truth
- generated markdown is runtime output
- generated markdown is not parsed back into source

That keeps the ownership line clear.

## Package Surface

Public exports:

- `paperzod`
  - ergonomic authoring helpers and top-level compile entrypoints
- `paperzod/core`
  - stable low-level doctrine types, diagnostics, graph contracts, and compile
    plan contracts
- `paperzod/markdown`
  - markdown rendering and surface emitters
- `paperzod/testing`
  - fixture and proving helpers

Typical library usage:

```ts
import {
  defineSetup,
  validateSetup,
  renderSetup,
  compileSetup,
  compileAndEmitSetup,
  createTargetAdapter,
  createPaperclipMarkdownTarget,
} from "paperzod";
```

## Typical Repo Shape

One reasonable repo layout looks like this:

```text
.
├── setups/
│   ├── editorial/
│   │   └── index.ts
│   └── support_docs/
│       └── index.ts
├── fragments/
│   ├── editorial/
│   └── support_docs/
├── generated/
└── paperclip_home/
```

## Contributor Workflow

```sh
npm install
npm run typecheck
npm run test:types
npm test
npm run build
```

When you are extending the system:

- put canonical repo-local setup truth under `setups/**`
- use `test/fixtures/source/**` for synthetic fixtures, mutations, or thin re-exports of canonical setups
- add or tighten the nearest layer-specific test first
- change implementation second
- keep rendered output changes deliberate and reviewable

## Docs Map

- [docs/ref/GENERIC_DOCTRINE_SYSTEM_PLAIN_EXAMPLE.md](/Users/aelaguiz/workspace/paperzod/docs/ref/GENERIC_DOCTRINE_SYSTEM_PLAIN_EXAMPLE.md)
  - the shortest plain-English explanation of the finished product shape
- [docs/requirements.md](/Users/aelaguiz/workspace/paperzod/docs/requirements.md)
  - product contract and boundaries
- [docs/schema.md](/Users/aelaguiz/workspace/paperzod/docs/schema.md)
  - source language and node model
- [docs/architecture.md](/Users/aelaguiz/workspace/paperzod/docs/architecture.md)
  - compiler layers and pipeline shape
- [docs/testing.md](/Users/aelaguiz/workspace/paperzod/docs/testing.md)
  - proving standard and release gate
- [docs/impl2.md](/Users/aelaguiz/workspace/paperzod/docs/impl2.md)
  - one high-fidelity proving plan, not the product boundary
- [docs/ref](/Users/aelaguiz/workspace/paperzod/docs/ref)
  - grounding material and reference inputs
