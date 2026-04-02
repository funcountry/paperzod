# Schema Language

## Goal

This document defines the source language `paperzod` should use.

It is still a standalone product schema, not a Lessons-only schema.
But it is now grounded by the concrete Lessons example in
[docs/example_lessons.md](/Users/aelaguiz/workspace/paperzod/docs/example_lessons.md).

If the schema language cannot express that example cleanly, it is not ready.

Status as of 2026-04-01:

- the current prototype implements this schema family closely
- where the shipped authoring DSL is narrower than the full schema, plain
  object authoring is used for the remaining node families

## Design rule

The schema should be simple, but not shallow.

For `paperzod`, the elegant minimum is to separate three layers clearly:

1. semantic nodes
2. runtime surfaces
3. addressable surface sections

Then everything else should build on top of that.

This is simpler than treating every runtime concern as a separate top-level
thing, and it is more powerful than pretending files alone are enough.

## The three-layer model

### Layer 1: semantic nodes

These are the setup concepts that matter even if you rewrote every doc:

- `setup`
- `role`
- `workflow_step`
- `review_gate`
- `packet_contract`
- `artifact`

### Layer 2: runtime surfaces

These are the file-level runtime doctrine surfaces:

- role-home docs
- shared entrypoint docs
- workflow owner docs
- packet workflow docs
- standard docs
- gate docs
- technical references
- how-to guides
- coordination docs

In the schema, these are `surface` nodes.

### Layer 3: addressable sections

These are the exact runtime sections that roles and workflow steps depend on.

Examples from the live Lessons setup:

- `Read First`
- `Role Contract`
- `Comment Shape`
- `Specialist Turn Shape`
- `What This Lane Must Do`
- `What the critic judges`

In the schema, these are `surface_section` nodes.

This is the missing layer the earlier schema draft did not model clearly
enough.

## Core terms

### Setup

A `setup` is one Paperclip doctrine runtime with its own roles, workflow,
gates, packet contracts, runtime surfaces, and output paths.

### Role

A `role` is an actor-level contract inside a setup.

It is not the markdown file.
It is the thing the markdown file documents.

### Workflow step

A `workflow_step` is one turn in a setup's normal flow.

It binds:

- a role
- a purpose
- required inputs
- optional support inputs
- required outputs
- a stop line
- a next gate or next step

### Review gate

A `review_gate` is a review or acceptance stage that checks outputs and decides
the next honest route.

This is kept separate from `workflow_step` because gates often have different
logic and relationships than normal production steps.

### Packet contract

A `packet_contract` is the contract later lanes are allowed to trust.

It exists so we can represent packet meaning separately from the exact runtime
bundle of files.

This is essential for setups like Lessons where the cleaner conceptual packet
chain is not yet identical to the current on-disk file bundle.

### Artifact

An `artifact` is a concrete or conceptual output that later work can rely on.

Examples:

- `SECTION_DOSSIER.md`
- `LESSON_PLAN.md`
- `lesson_manifest.json`
- `PRIOR_KNOWLEDGE_MAP.md`
- a run-gate bundle
- a candidate set file

### Surface

A `surface` is a file-level runtime doctrine surface.

Examples:

- a role-home `AGENTS.md`
- a shared `README.md`
- a workflow owner doc
- a packet workflow doc
- a standard doc
- a gate doc
- a technical reference
- a how-to guide

### Surface section

A `surface_section` is a stable addressable section inside a runtime surface.

This is the unit that lets the model say:

- a role reads this exact section
- a workflow step is documented by that exact section
- a gate checks the rule defined in that exact section

### Reference

A `reference` is support or grounding material that the setup wants to keep in
the model even when it is not itself a generated runtime contract surface.

Examples:

- imported reference docs
- external grounding docs
- support references that shape a setup

### Generated target

A `generated_target` is a file or section that the compiler emits.

Generated targets matter because source truth and runtime truth are different
layers:

- source truth is structured
- runtime truth is markdown

## Required node families

The minimum useful node families are now:

- `setup`
- `role`
- `workflow_step`
- `review_gate`
- `packet_contract`
- `artifact`
- `surface`
- `surface_section`
- `reference`
- `generated_target`

This is smaller and more coherent than the previous draft.

## Required surface classes

`surface` should support at least these classes:

- `role_home`
- `shared_entrypoint`
- `workflow_owner`
- `packet_workflow`
- `standard`
- `gate`
- `technical_reference`
- `how_to`
- `coordination`

This comes directly from the live Lessons setup.

## Required reference classes

`reference` should support at least these classes:

- `runtime_reference`
- `support_reference`
- `grounding_reference`
- `imported_reference`
- `external_reference`

That gives us enough room to model:

- technical references in the live setup
- how-to docs
- imported reference docs in [`docs/ref`](/Users/aelaguiz/workspace/paperzod/docs/ref)
- external grounding sources when needed

## Required artifact classes

`artifact` should support at least these classes:

- `required`
- `conditional`
- `support`
- `reference`
- `legacy`

And it should be able to mark whether an artifact is:

- conceptual only
- concrete runtime file
- compatibility-only runtime residue

## Required link families

The minimum useful link families are:

- `owns`
- `reads`
- `produces`
- `consumes`
- `supports`
- `checks`
- `routes_to`
- `documents`
- `grounds`
- `references`
- `maps_to_runtime`
- `generated_from`

### Why these links exist

- `owns`
  - one canonical owner for a unit
- `reads`
  - role or step read order
- `produces`
  - a step produces a packet contract or artifact
- `consumes`
  - a downstream step depends on a packet contract or artifact
- `supports`
  - optional support input instead of required contract input
- `checks`
  - a review gate checks a unit
- `routes_to`
  - the declared next gate or next step
- `documents`
  - a runtime surface or section documents a semantic node
- `grounds`
  - a role, packet contract, or surface depends on grounding material
- `references`
  - looser support/reference relationship
- `maps_to_runtime`
  - a conceptual packet or artifact maps to current runtime files
- `generated_from`
  - a generated target is derived from source units

This set is simpler than the previous draft and still covers the reference
case.

## Identity rules

Every important source unit needs a stable id.

That id should:

- be machine-stable
- survive wording rewrites
- be unique within a setup unless intentionally shared
- be usable in links and generation

Human headings can change.
Stable ids should not.

## Suggested source shapes

This is now the minimum useful direction for the schema:

```ts
type Setup = {
  id: string;
  name: string;
  description?: string;
};

type Role = {
  kind: "role";
  id: string;
  setupId: string;
  name: string;
  purpose: string;
  boundaries?: string[];
};

type WorkflowStep = {
  kind: "workflow_step";
  id: string;
  setupId: string;
  roleId: string;
  purpose: string;
  requiredInputIds: string[];
  supportInputIds?: string[];
  interimArtifactIds?: string[];
  requiredOutputIds: string[];
  stopLine: string;
  nextStepId?: string;
  nextGateId?: string;
};

type ReviewGate = {
  kind: "review_gate";
  id: string;
  setupId: string;
  name: string;
  purpose: string;
  checkIds: string[];
};

type PacketContract = {
  kind: "packet_contract";
  id: string;
  setupId: string;
  name: string;
  conceptualArtifactIds: string[];
  runtimeArtifactIds?: string[];
};

type Artifact = {
  kind: "artifact";
  id: string;
  setupId: string;
  name: string;
  artifactClass: "required" | "conditional" | "support" | "reference" | "legacy";
  runtimePath?: string;
  conceptualOnly?: boolean;
  compatibilityOnly?: boolean;
};

type Surface = {
  kind: "surface";
  id: string;
  setupId: string;
  surfaceClass:
    | "role_home"
    | "shared_entrypoint"
    | "workflow_owner"
    | "packet_workflow"
    | "standard"
    | "gate"
    | "technical_reference"
    | "how_to"
    | "coordination";
  runtimePath: string;
};

type SurfaceSection = {
  kind: "surface_section";
  id: string;
  setupId: string;
  surfaceId: string;
  stableSlug: string;
  title: string;
};

type Reference = {
  kind: "reference";
  id: string;
  setupId: string;
  referenceClass:
    | "runtime_reference"
    | "support_reference"
    | "grounding_reference"
    | "imported_reference"
    | "external_reference";
  name: string;
  sourcePath?: string;
  url?: string;
};

type GeneratedTarget = {
  kind: "generated_target";
  id: string;
  setupId: string;
  path: string;
  sourceIds: string[];
  sectionId?: string;
};

type DoctrineLink = {
  id: string;
  setupId: string;
  kind:
    | "owns"
    | "reads"
    | "produces"
    | "consumes"
    | "supports"
    | "checks"
    | "routes_to"
    | "documents"
    | "grounds"
    | "references"
    | "maps_to_runtime"
    | "generated_from";
  from: string;
  to: string;
};
```

This is not the final implementation schema.
It is the simplest schema that still looks honest against the Lessons example.

## Zod responsibility split

Zod should own node-level validation and type inference.

Examples:

- valid role shape
- valid workflow step shape
- valid review gate shape
- valid surface class
- valid artifact class
- valid reference class
- valid link shape

The graph checker should own cross-node rules.

Examples:

- every `reads` target exists
- every `documents` target exists
- every required output is produced by some workflow step
- every review gate checks real units
- generated targets map back to real source units
- conceptual packet contracts and runtime compatibility mappings stay aligned
- no two units claim the same single-owner surface when that is forbidden

## Generated markdown model

The schema must explicitly support generation.

That means it should be able to say:

- which source units generate which runtime file
- which source units generate which section inside that file
- when section backing is declared directly on the generated target versus via
  explicit `generated_from` links
- which source units are runtime-only references and should not be regenerated
- which imported references are kept for grounding only

This is why both `surface` and `surface_section` need to exist.

## Invariants

The first useful checker should enforce at least these invariants:

- every node belongs to one setup
- every link resolves
- every workflow step has one owning role
- every surface section belongs to a real surface
- every packet contract has at least one conceptual artifact
- every generated target maps back to real source units
- every review gate checks real units
- every `maps_to_runtime` target points to a real runtime artifact or runtime
  surface
- no duplicate stable ids inside a setup
- no duplicate canonical owners for the same unit when single ownership is
  expected

## Lessons-driven modeling rule

The most important rule the Lessons example forces on the schema is this:

Do not force conceptual contracts and current runtime files to be the same
thing.

Sometimes they are the same.
Sometimes they are not yet the same.

The schema must be able to model both honestly, or `paperzod` will either:

- lie about the clean conceptual workflow
- or stay trapped in the mess of the current file bundle

And do not force whole files and exact doctrine sections to be the same thing
either.

The schema needs both:

- file-level runtime surfaces
- section-level addressable units inside those surfaces

That is the simplest model that still satisfies the reference case.
