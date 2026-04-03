# paperzod

`paperzod` is a doctrine compiler for Paperclip systems.

It lets you define one structured source of truth for roles, workflow steps,
packet contracts, standards, gates, references, constrained vocab registries,
artifact evidence contracts, typed doctrine refs, required section contracts,
and runtime doctrine surfaces, then compile the markdown that agents actually
read.

The point is simple: if a setup has ten role guides, a shared workflow owner,
packet workflow docs, critic standards, gate rules, and a few technical
references, you should not hand-maintain all of those files separately.

With `paperzod`, you:

- define the semantic graph once
- reuse first-cut document-shape helpers for role homes, workflow owners, and
  standards
- keep long prose in repo-local markdown fragments where humans should own the
  words
- compile repo-owned markdown output for runtime use

Structured source is the only semantic truth.
Generated markdown is runtime output.

## What You Get

- reusable document-shape helpers for role homes, workflow owners, and
  standards
- the lower-level `SetupInput` path for packet workflows, gates, references,
  how-to guides, coordination docs, and any other surface family
- setup-local roles, workflow steps, packet contracts, artifacts, read order,
  handoff rules, stop lines, and output paths
- setup-level registries for sanctioned runtime vocab
- setup-level catalogs for sanctioned operational references, starting with
  commands
- artifact-level evidence contracts for required support files and required
  claims
- typed refs inside TypeScript-authored doctrine blocks so important mentions
  stop being raw strings
- required section contracts on generated surfaces so canonical document
  families fail loudly when omitted
- sparse template-section emission with `emissionPolicy: "whenConfigured"` so
  shared optional sections only emit where a destination actually configures
  them
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

- one reusable role-home shape
- one reusable workflow-owner shape
- one reusable standard shape
- the actual workflow facts for this setup
- the authored prose fragments that should stay in markdown

Then `paperzod` compiles the runtime docs for you.

That same pattern scales up to larger and more demanding systems without
changing the product boundary.

## What A Setup Author Does

The authoring flow has five parts:

1. Define the base setup facts as plain `SetupInput`.
2. Add reusable document-shape parts with helper-backed templates.
3. Load authored markdown fragments for the prose humans should own directly.
4. Compose those parts back into one plain setup.
5. Optionally wrap that setup in `defineSetupModule(...)` when you need
   setup-local checks or declared output ownership.

That means a setup author does not hand-maintain ten slightly different
`AGENTS.md` files.
They define one role-home shape, reuse it for each role, and let the compiler
keep the generated output aligned.

When one shared role-home template has sections that are not universal, mark
those sections with `emissionPolicy: "whenConfigured"`.
`paperzod` will omit them for destinations that never configure them, and it
will auto-emit a parent wrapper section when one configured child needs that
wrapper in the final markdown.

## Small Example

The example below shows the actual helper contract that ships today:
`composeSetup`, family-specific document-shape helpers, explicit-base
`loadFragments`, and plain repo-local `.ts` compilation.

```ts
import {
  composeSetup,
  defineRoleHomeTemplate,
  defineSetup,
  defineStandardTemplate,
  defineWorkflowOwnerTemplate,
  loadFragments,
} from "paperzod";

const roleHome = defineRoleHomeTemplate({
  id: "role_home",
  sections: [
    { key: "readFirst", title: "Read First" },
    { key: "yourJob", title: "Your Job" },
    { key: "inputs", title: "Inputs" },
    { key: "outputs", title: "Outputs" },
    { key: "stopLine", title: "Stop Line" },
  ] as const,
  requiredSections: ["readFirst", "yourJob"] as const,
});

const workflowOwner = defineWorkflowOwnerTemplate({
  id: "workflow_owner",
  sections: [
    { key: "goal", title: "Goal" },
    { key: "stepOrder", title: "Step Order" },
    { key: "handoffRules", title: "Handoff Rules" },
    { key: "sendBackRules", title: "Send Back Rules" },
  ] as const,
  requiredSections: ["goal", "stepOrder", "handoffRules", "sendBackRules"] as const,
});

const draftQuality = defineStandardTemplate({
  id: "draft_quality_standard",
  sections: [
    { key: "whatGoodLooksLike", title: "What Good Looks Like" },
    { key: "sendBackWhen", title: "Send Back When" },
    { key: "examples", title: "Examples" },
  ] as const,
});

const workflowText = loadFragments(new URL("./fragments/workflow/", import.meta.url), {
  goal: "goal.md",
  handoffRules: "handoff_rules.md",
  sendBackRules: "send_back_rules.md",
});

export default composeSetup(
  defineSetup({
    id: "editorial",
    name: "Editorial",
    roles: [
      { id: "writer", name: "Writer", purpose: "Write the draft." },
      { id: "critic", name: "Critic", purpose: "Review the draft." },
      { id: "publisher", name: "Publisher", purpose: "Publish after review." },
    ],
    workflowSteps: [
      {
        id: "draft_issue",
        roleId: "writer",
        purpose: "Draft the issue from the brief.",
        requiredInputIds: ["brief_packet"],
        requiredOutputIds: ["draft_packet"],
        stopLine: "Stop when the draft is ready for critic review.",
        nextStepId: "review_draft",
      },
      {
        id: "review_draft",
        roleId: "critic",
        purpose: "Review the draft against the standard.",
        requiredInputIds: ["draft_packet"],
        requiredOutputIds: ["review_notes"],
        stopLine: "Stop when the draft passes or goes back with clear notes.",
        nextStepId: "publish_issue",
      },
      {
        id: "publish_issue",
        roleId: "publisher",
        purpose: "Publish after critic review passes.",
        requiredInputIds: ["draft_packet", "review_notes"],
        requiredOutputIds: ["published_issue"],
        stopLine: "Stop when the issue is published.",
        nextGateId: "publish_gate",
      },
    ],
    reviewGates: [
      {
        id: "publish_gate",
        name: "Publish Gate",
        purpose: "Confirm the final issue is ready to ship.",
        checkIds: ["published_issue"],
      },
    ],
    artifacts: [
      { id: "brief_packet", name: "BRIEF.md", artifactClass: "required" },
      { id: "draft_packet", name: "DRAFT.md", artifactClass: "required" },
      { id: "review_notes", name: "REVIEW_NOTES.md", artifactClass: "required" },
      { id: "published_issue", name: "PUBLISHED_ISSUE.md", artifactClass: "required" },
    ],
  }),
  roleHome.document({
    surfaceId: "writer_home",
    runtimePath: "generated/editorial/roles/writer/AGENTS.md",
    roleId: "writer",
    sections: {
      readFirst: {
        body: [{ kind: "paragraph", text: "Read the shared workflow, then the standard, then the brief." }],
      },
      yourJob: {
        body: [{ kind: "paragraph", text: "Write the draft for the current issue. Do not publish it yourself." }],
      },
    },
  }),
  workflowOwner.document({
    surfaceId: "editorial_workflow",
    runtimePath: "generated/editorial/shared/AUTHORITATIVE_WORKFLOW.md",
    workflowStepId: "draft_issue",
    title: "Authoritative Workflow",
    sections: {
      goal: { body: workflowText.goal },
      stepOrder: {
        documentsTo: ["draft_issue", "review_draft", "publish_issue"],
        body: [
          {
            kind: "ordered_list",
            items: [
              "Writer drafts the issue.",
              "Critic reviews the draft.",
              "Publisher publishes after review passes.",
            ],
          },
        ],
      },
      handoffRules: { body: workflowText.handoffRules },
      sendBackRules: { documentsTo: "review_draft", body: workflowText.sendBackRules },
    },
  }),
  draftQuality.document({
    surfaceId: "draft_quality_standard",
    runtimePath: "generated/editorial/standards/DRAFT_QUALITY.md",
    artifactId: "draft_packet",
    title: "Draft Quality Standard",
    sections: {
      whatGoodLooksLike: {
        body: [
          {
            kind: "unordered_list",
            items: ["The draft matches the brief.", "Claims are grounded.", "The wording is clear."],
          },
        ],
      },
    },
  }),
);
```

The long prose still lives in plain markdown files such as:

- `fragments/workflow/goal.md`
- `fragments/workflow/handoff_rules.md`
- `fragments/workflow/send_back_rules.md`

TypeScript owns the graph, ids, paths, routing, and validation.

## Typed Doctrine Refs

When one line inside doctrine is important enough that it should not drift as a
raw string, keep that line in a TypeScript-authored block and use typed refs.

```ts
import {
  artifactRef,
  command,
  commandRef,
  defineSetup,
  envVar,
  envVarRef,
  packetContractRef,
  referenceRef,
  reviewGateRef,
  sectionRef,
} from "paperzod";

defineSetup({
  id: "typed_runtime_law",
  name: "Typed Runtime Law",
  catalogs: [
    { kind: "command", entries: [command("paperclip_status", "./paperclip status")] },
    { kind: "env_var", entries: [envVar("paperclip_api_url", "PAPERCLIP_API_URL")] },
  ],
  reviewGates: [{ id: "publish_gate", name: "Publish Gate", purpose: "Check final publish readiness.", checkIds: ["publish_packet"] }],
  packetContracts: [{ id: "publish_packet", name: "Publish Packet", conceptualArtifactIds: ["action_authority"] }],
  references: [{ id: "runtime_reference", referenceClass: "runtime_reference", name: "Runtime Reference" }],
  surfaces: [
    {
      id: "author_home",
      surfaceClass: "role_home",
      runtimePath: "generated/author/AGENTS.md",
      preamble: [
        {
          kind: "paragraph",
          text: [
            "Read ",
            artifactRef("action_authority"),
            ", trust ",
            packetContractRef("publish_packet"),
            ", pass ",
            reviewGateRef("publish_gate"),
            ", and run ",
            commandRef("paperclip_status"),
            " with ",
            envVarRef("paperclip_api_url"),
            " using guidance from ",
            referenceRef("runtime_reference"),
            ".",
          ],
        },
        {
          kind: "paragraph",
          text: [
            "If routing is unclear, open ",
            sectionRef({ surfaceId: "workflow_surface", stableSlug: "owner-map" }),
            ".",
          ],
        },
      ],
    },
  ],
});
```

Fragments stay plain in v1.
If a fragment line is drift-sensitive, move that line into a TypeScript-authored
block first instead of expecting the fragment loader to understand semantic
refs.

See:

- `docs/example_editorial.md`
- `docs/example_typed_runtime_law.md`
Markdown owns the prose humans should write directly.

## Typed Runtime Law

Some runtime law is too important to leave as freeform prose:

- sanctioned vocab that downstream docs should not restate differently
- required evidence artifacts that a handoff artifact depends on
- required claims whose allowed values should come from one canonical registry

`paperzod` now models that law directly with:

- `setup.registries[]`
- `artifact.evidence`

Small generic example:

```ts
defineSetup({
  id: "release_ops",
  name: "Release Ops",
  registries: [
    {
      id: "publish_result",
      name: "Publish Result",
      entries: [
        { id: "approved", label: "Approved" },
        { id: "revise", label: "Revise" },
      ],
    },
  ],
  artifacts: [
    {
      id: "authority_note",
      name: "AUTHORITY_NOTE.md",
      artifactClass: "required",
      evidence: {
        requiredArtifactIds: ["review_receipt"],
        requiredClaims: [
          {
            id: "publish_decision",
            label: "Publish decision",
            allowedValue: { registryId: "publish_result", entryId: "approved" },
          },
        ],
      },
    },
    { id: "review_receipt", name: "REVIEW_RECEIPT.md", artifactClass: "support" },
  ],
});
```

That surface stays intentionally small:

- registries are setup-level lookup truth, not graph nodes
- evidence stays attached to artifacts, not packets or prose fragments
- path and endpoint catalogs are still deferred
- typed prose refs stay in TypeScript-authored blocks, not fragments

For the smallest end-to-end walkthrough of that surface, see:

- `docs/example_typed_runtime_law.md`
- `test/fixtures/source/registry-evidence.ts`

## Current Helper Layer

The shipped helper layer is still thin, but it now covers every surface family
used by the canonical proving setups:

- `composeSetup(baseSetup, ...parts)` merges helper-produced setup parts back
  into one plain `SetupInput`.
- `defineSetupModule({ setup, checks, outputOwnership })` wraps a plain setup
  when you need setup-local rules or compiler-owned prune boundaries.
- Document-shape helpers now ship for:
  `role_home`, `project_home_root`, `shared_entrypoint`, `workflow_owner`,
  `packet_workflow`, `standard`, `gate`, `technical_reference`, `how_to`, and
  `coordination`.
- `projectDocumentSections(...)` lowers one shared section catalog into many
  ordinary document parts without widening the semantic model.
- `applyKeyedOverrides(...)` gives setup authors an explicit stable-selector
  helper while keeping `composeSetup(...)` append-only:
  registries are selected by `id`, catalogs by `kind`.
- `loadFragments(new URL("./fragments/.../", import.meta.url), spec)` loads
  repo-local markdown fragments from an explicit base directory.
- The fragment loader currently supports paragraphs, nested ordered or
  unordered lists, fenced code blocks, and narrow pipe tables that lower to
  authored `table` blocks.
- Headings, blockquotes, frontmatter, HTML, images, and task lists still fail
  loudly and stay TypeScript-authored.
- `doctor`, `validate`, and `compile` all run the same merged check set when a
  setup module declares local rules.
- Dry-run compile can preview deletes inside declared ownership scopes. Write
  mode requires `--prune` before those deletes are applied.
- The canonical proving setups under `setups/editorial/**` and
  `setups/release_ops/**` are modular local packages assembled by `index.ts` and
  now use `defineSetupModule(...)` to declare owned output scopes.

## Optional Framework Additions

When a setup needs more than plain append-only composition, the framework
surface stays explicit:

```ts
export default defineSetupModule({
  setup: applyKeyedOverrides(
    composeSetup(
      baseSetup,
      ...projectDocumentSections(roleHomeTemplate, {
        sections: {
          readFirst: { sourceIds: ["shared_workflow"] },
        },
        destinations: [
          {
            surfaceId: "writer_home",
            runtimePath: "generated/writer/AGENTS.md",
            roleId: "writer",
          },
        ],
      }),
    ),
    {
      roles: [
        {
          id: "writer",
          replace: (current) => ({ ...current, purpose: "Write the draft with local workflow constraints." }),
        },
      ],
    },
  ),
  outputOwnership: [{ kind: "root", path: "paperclip_home/project_homes/editorial" }],
});
```

## What You Compile

For a generic setup:

```sh
paperzod doctor setups/editorial/index.ts
paperzod compile setups/editorial/index.ts --repo-root . --output-root generated --write
paperzod compile setups/editorial/index.ts --repo-root . --output-root generated --write --prune
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
Stable section targets are preserved with deliberate raw HTML anchors in the
emitted markdown.

## Proving The Generic System

This repo is a generic open source compiler.
It is not an editorial-specific product.

The repo proves the generic system against multiple setup shapes, including one
high-fidelity editorial fixture because that is a demanding public proving
case. That fixture is a proving target, not the product boundary.

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
npm run build
npm test
```

When you are extending the system:

- put canonical repo-local setup truth under `setups/**`
- use `test/fixtures/source/**` for synthetic fixtures, mutations, or thin re-exports of canonical setups
- add or tighten the nearest layer-specific test first
- change implementation second
- keep rendered output changes deliberate and reviewable

## Docs Map

- [docs/ref/GENERIC_DOCTRINE_SYSTEM_PLAIN_EXAMPLE.md](docs/ref/GENERIC_DOCTRINE_SYSTEM_PLAIN_EXAMPLE.md)
  - the shortest plain-English explanation of the finished product shape
- [docs/requirements.md](docs/requirements.md)
  - product contract and boundaries
- [docs/schema.md](docs/schema.md)
  - source language and node model
- [docs/architecture.md](docs/architecture.md)
  - compiler layers and pipeline shape
- [docs/testing.md](docs/testing.md)
  - proving standard and release gate
- [docs/example_editorial.md](docs/example_editorial.md)
  - the high-fidelity editorial proving example and canonical setup readback
- [docs/ref](docs/ref)
  - grounding material and reference inputs
