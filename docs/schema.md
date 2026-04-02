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
- explicit links such as `documents`, `reads`, `owns`, `grounds`, and
  `references`

## Stability Rules

- Stable ids belong to source truth, not to generated headings.
- Generated anchors are derived from explicit section identity.
- Helper sugar must preserve those stable ids.
- Keyed overrides must replace by stable identity, not by array position.

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
