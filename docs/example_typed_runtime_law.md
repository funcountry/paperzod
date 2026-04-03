# Example Typed Runtime Law

## Purpose

This document is the smallest public walkthrough of the typed runtime-law
surface that now ships in `paperzod`.

It focuses on four small framework-first capabilities:

- `setup.registries[]`
- `setup.catalogs[]`, currently `command` and `env_var`
- typed refs in TypeScript-authored doctrine blocks
- required section contracts on generated surfaces

The canonical proving sources for this example are:

- `test/fixtures/source/registry-evidence.ts`
- `test/fixtures/source/typed-doctrine-refs.ts`

That split is intentional. The feature is generic, so the public example
should stand on its own instead of being hidden inside the editorial setup.

## What Problem This Solves

Some runtime law is too important to leave in prose-only strings or helper
convention:

- sanctioned decision values that should not drift
- support artifacts and claims required before another artifact is trustworthy
- doctrine mentions like "read this artifact", "trust this packet contract",
  "pass this gate", "ground this in this reference", or "run this command with
  this env var"
- canonical document families that a generated surface may not omit

Before this slice, many of those facts still lived in raw strings or template
convention. Now they can live in structured setup truth and flow through
checks and rendering.

## Small Typed-Ref Example

The typed-ref proving fixture models one role home, one workflow owner, one
artifact, one packet contract, one review gate, one grounding reference, and
two sanctioned operational refs:

```ts
defineSetup({
  id: "typed_doctrine_refs",
  name: "Typed Doctrine Refs",
  catalogs: [
    {
      kind: "command",
      entries: [{ id: "paperclip_status", display: "./paperclip status" }],
    },
    {
      kind: "env_var",
      entries: [{ id: "paperclip_api_url", display: "PAPERCLIP_API_URL" }],
    },
  ],
  roles: [{ id: "author", name: "Author", purpose: "Author the runtime doctrine honestly." }],
  reviewGates: [{ id: "publish_gate", name: "Publish Gate", purpose: "Check final publish readiness.", checkIds: ["publish_packet"] }],
  packetContracts: [{ id: "publish_packet", name: "Publish Packet", conceptualArtifactIds: ["action_authority"] }],
  artifacts: [{ id: "action_authority", name: "ACTION_AUTHORITY.md", artifactClass: "required" }],
  references: [{ id: "runtime_reference", referenceClass: "runtime_reference", name: "Runtime Reference" }],
  surfaces: [
    {
      id: "author_home",
      surfaceClass: "role_home",
      runtimePath: "paperclip_home/agents/author/AGENTS.md",
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
            ", and ask ",
            roleRef("author"),
            " to take final action with grounding from ",
            referenceRef("runtime_reference"),
            ".",
          ],
        },
        {
          kind: "rule_list",
          items: [
            ["Run ", commandRef("paperclip_status"), " with ", envVarRef("paperclip_api_url"), " before changing runtime docs."],
            {
              text: ["Then open ", sectionRef({ surfaceId: "workflow_surface", stableSlug: "owner-map" }), "."],
              children: [["If routing is still unclear, read ", surfaceRef("workflow_surface"), " end to end."]],
            },
          ],
        },
      ],
    },
  ],
});
```

The important boundary is:

- the author still writes ordinary prose
- only the drift-sensitive mentions become typed islands
- the renderer owns the final display text

## Small Required-Composition Example

Required composition is separate from prose and separate from helper-local
template keys.

The template definition can now declare the canonical section families it
requires:

```ts
const roleHome = defineRoleHomeTemplate({
  id: "role_home",
  sections: [
    { key: "readFirst", title: "Read First" },
    { key: "roleContract", title: "Role Contract" },
  ] as const,
  requiredSections: ["readFirst", "roleContract"] as const,
});
```

That helper sugar lowers to slug-based surface truth:

```ts
surface.requiredSectionSlugs = ["read-first", "role-contract"];
```

The checker then rejects any realized surface that omits one of those slugs.

## Registries And Evidence Still Fit The Same Story

The registry and evidence fixture proves the adjacent typed runtime-law slice:

```ts
defineSetup({
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
      name: "Authority Note",
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
  ],
});
```

That proves the broader product rule:

- put canonical vocab in registries
- put operational runtime refs in catalogs
- put trust-sensitive proof law on artifacts
- put drift-sensitive doctrine mentions in typed authored blocks
- put canonical section families on surfaces
- keep helper composition honest by letting shared setup parts carry catalogs and
  registries and overriding them with stable selectors

## What The Compiler Enforces

The checker now rejects:

- duplicate registry ids and duplicate registry entry ids
- duplicate catalog kinds and duplicate catalog entry ids
- unknown registry references from artifact evidence
- missing or circular artifact evidence dependencies
- typed refs to missing nodes
- typed refs to the wrong node kind
- typed refs to missing sections by `surfaceId + stableSlug`
- typed refs to missing command or env-var catalogs or catalog entries
- surfaces that omit declared required section slugs
- helper overrides that target the wrong stable selector or try to change
  collection identity

The main proof lives in:

- `test/types/authoring.test.ts`
- `test/source/nodes.test.ts`
- `test/source/normalize.test.ts`
- `test/source/compose.test.ts`
- `test/source/shared-overrides.test.ts`
- `test/graph/indexes.test.ts`
- `test/checks/registry.test.ts`
- `test/checks/typed-inline-refs.test.ts`
- `test/checks/surfaces.test.ts`

## What Rendering Gets Back

Renderers now receive canonical truth and emit plain markdown from it.

The typed-ref proving fixture renders lines like:

```md
Read ACTION_AUTHORITY.md, trust Publish Packet, pass Publish Gate, and ask Author to take final action with grounding from Runtime Reference.

- Run `./paperclip status` with `PAPERCLIP_API_URL` before changing runtime docs.
- Then open Owner Map.
  - If routing is still unclear, read Workflow Owner end to end.
```

The registry and evidence proving fixture renders lines like:

```md
- Required evidence artifacts: Review Receipt
- Required evidence claim: Publish decision. Allowed value: Publish Result -> Approved.
```

The render and end-to-end proof lives in:

- `test/render/role-home-shared.test.ts`
- `test/e2e/authored-content.test.ts`

## Why This Surface Stays Small

This is deliberately not a second writing language.

The current feature set does not add:

- arbitrary markdown ref parsing
- AI-style prose interpretation
- author-provided display overrides for refs
- a doc-AST rewrite
- path or endpoint families in this cut
- richer section-law assertions beyond required slug presence

Fragments stay plain in v1.
If one fragment sentence is drift-sensitive, move that sentence into a
TypeScript-authored doctrine block first.

## How To Read The Public Examples

Use the public examples as a pair:

- `docs/example_editorial.md` shows the high-fidelity multi-surface setup shape
- this document shows the smallest generic typed runtime-law slice

That split keeps the editorial proving case honest while still making the
framework surface easy to understand in isolation.
