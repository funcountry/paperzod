# Schema Language

## Goal

This document defines the public source language for `paperzod`.

The design rule is simple:

- keep semantic truth plain
- keep ergonomics additive
- keep normalized node kinds small and stable

The schema must model the canonical `editorial` and `release_ops` setups
without special branches.

## Public Authoring Contract

The low-level authoring contract is plain `SetupInput`.

The public ergonomic layer is additive:

- `defineSetup(...)`
- `defineSetupModule({ setup, checks, outputOwnership })`
- `composeSetup(baseSetup, ...parts)`
- document-shape helpers such as `defineRoleHomeTemplate(...)`
- `projectDocumentSections(...)`
- `applyKeyedOverrides(...)`
- `loadFragments(new URL("./fragments/.../", import.meta.url), spec)`

Those helpers lower back into plain setup arrays and links before
normalization. They do not add new normalized node kinds.

The public typed runtime-law layer is still intentionally small. It now
includes:

- `setup.registries[]` for sanctioned vocab
- `setup.catalogs[]` for sanctioned operational refs, currently `command` and
  `env_var`
- `artifact.evidence` for required support artifacts and required claims
- typed inline refs inside TypeScript-authored doctrine blocks
- `surface.requiredSectionSlugs` for required canonical section families

## Core Node Families

The minimum useful semantic families are:

- `setup`
- `role`
- `workflow_step`
- `review_gate`
- `packet_contract`
- `artifact`

The runtime-document families are:

- `surface`
- `surface_section`
- `reference`
- `generated_target`
- `link`

## Three-Layer Model

`paperzod` keeps three layers explicit.

### 1. Semantic nodes

These are the workflow facts that matter even if every file path changes:

- roles
- workflow steps
- review gates
- packet contracts
- artifacts

### 2. Runtime surfaces

These are the file-level doctrine surfaces agents actually read:

- role homes
- shared entrypoints
- workflow owners
- packet workflow docs
- standards
- gates
- technical references
- how-to guides
- coordination docs

### 3. Addressable sections

These are the stable sections inside those runtime files.

They matter because roles, steps, and gates often depend on one section inside
one shared file, not on the whole file.

## Required Source Fields

A useful setup must be able to express:

- stable ids
- human-readable names
- runtime paths
- surface classes and reference classes
- required inputs and outputs
- support inputs
- stop lines
- next-step and next-gate routing
- compatibility-only runtime artifacts where needed
- setup-level constrained vocab registries
- setup-level sanctioned operational catalogs
- artifact-level evidence contracts
- typed refs inside authored TypeScript doctrine blocks
- required section contracts on surfaces
- explicit links such as `documents`, `reads`, `owns`, `grounds`, and
  `references`

## Typed Runtime-Law Rules

The framework still keeps typed runtime law narrow and explicit.

### Registries

`setup.registries[]` models one setup-level catalog of sanctioned values.

Each registry has:

- `id`
- `name`
- optional `description`
- `entries[]`

Each entry has:

- `id`
- `label`
- optional `description`

Registries are lookup truth for checks and renderers. They are not routed graph
nodes and they do not create a second link family.

### Operational Catalogs

`setup.catalogs[]` models sanctioned operational truth that should be
referenced structurally instead of restated as raw prose.

The first shipped catalog family is `command`.

Each catalog has:

- `kind`
- `entries[]`

Each entry has:

- `id`
- `display`
- optional `description`

The public rule is:

- use one small catalog-backed ref seam
- prove it with one or two boring operational families first
- add more families later only if the same shape stays clean

### Artifact Evidence

`artifact.evidence` attaches proof-law to one artifact.

It may declare:

- `requiredArtifactIds[]`
- `requiredClaims[]`

Each required claim has:

- `id`
- `label`
- optional `description`
- optional `allowedValue: { registryId, entryId }`

That is enough to say:

- which support artifacts must exist before this artifact is trustworthy
- which claims must be present
- which claim values come from canonical setup-level vocab

### Typed Doctrine Refs

Typed refs are allowed in TypeScript-authored doctrine blocks where drift would
matter.

The supported v1 ref helpers are:

- `artifactRef(id)`
- `surfaceRef(id)`
- `sectionRef({ surfaceId, stableSlug })`
- `roleRef(id)`
- `reviewGateRef(id)`
- `packetContractRef(id)`
- `referenceRef(id)`
- `commandRef(id)`
- `envVarRef(id)`

The supported v1 authored text fields are:

- paragraph text
- list item text
- definition-list terms and definitions

The important boundary is:

- existence checks happen before render
- display text comes from canonical truth
- generated markdown stays plain
- authored fragments stay plain and do not parse refs in v1

### Required Surface Composition

`surface.requiredSectionSlugs[]` is the compiler-owned contract for canonical
section families that a realized surface must include.

Template helpers may expose ergonomic `requiredSections` sugar keyed by local
template section keys, but that sugar lowers to slug-based surface truth before
normalization completes.

### Explicit Non-Goals

This slice does not add:

- arbitrary markdown ref parsing
- path or endpoint catalogs in this cut
- packet-level evidence aggregation
- a general markdown interpolation language

## Stability Rules

- Stable ids belong to source truth, not to generated headings.
- Generated anchors are derived from explicit section identity.
- Helper sugar must preserve those stable ids.
- Keyed overrides must replace by stable identity, not by array position:
  registries by `id`, catalogs by `kind`.

## Fragment Rules

Authored fragments are intentionally narrow.

The current supported authored block shapes are:

- paragraphs
- ordered lists
- unordered lists
- fenced code blocks
- pipe tables

The fragment loader is not a general markdown parser for arbitrary authored
documents. Section ownership still lives in TypeScript source.

If a fragment sentence is drift-sensitive, move that sentence into a
TypeScript-authored doctrine block first.

## Source Module Rules

`defineSetupModule(...)` is a source envelope around plain setup truth.

It may declare:

- `setup`
- setup-local executable `checks`
- `outputOwnership`

It may not become a second semantic language.

## Modeling Rules

The schema should prefer:

- one canonical owner over duplicated prose
- section-level links over vague file-level references
- conceptual contracts over accidental current file bundles
- typed runtime law only where the value affects trust, routing, or required
  evidence
- additive helper sugar over normalized model widening

The schema should reject:

- hidden ownership
- duplicate single-owner contracts
- setup-local semantics encoded in compiler branches
- fragment formats that try to reintroduce a second document-truth system

## Canonical Public Examples

The repo keeps two public examples in sync with this schema:

- `setups/editorial/index.ts`
- `setups/release_ops/index.ts`

`docs/example_editorial.md` is the readable walkthrough of the high-fidelity
setup shape.

The repo also keeps one small generic runtime-law walkthrough in sync with this
schema:

- `docs/example_typed_runtime_law.md`
- `test/fixtures/source/registry-evidence.ts`
- `test/fixtures/source/typed-doctrine-refs.ts`
