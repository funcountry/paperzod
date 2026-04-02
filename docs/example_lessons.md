# Example Lessons

## Goal

This document shows how the live Lessons setup in `../paperclip_agents` could
be represented with `paperzod` if the project were built correctly.

This is an example, not the product requirements.
The point is to prove that the standalone `paperzod` model can satisfy the
Lessons reference case without flattening the real pod shape.

Status as of 2026-04-01:

- the canonical Lessons proving setup now lives in `setups/lessons/index.ts`
- `test/fixtures/source/lessons-full.ts` is a thin test-facing re-export of
  that canonical setup
- `test/fixtures/source/lessons-vertical-slice.ts` remains a narrower Lessons
  slice for focused proof

## The modeling rule this example forces

The live Lessons setup has three different things happening at once:

1. semantic workflow structure
2. runtime doctrine surfaces
3. exact doctrine sections inside those surfaces

If `paperzod` cannot model all three, it is not ready.

## What this example must preserve

The live Lessons setup already has a meaningful structure.
If `paperzod` is useful, it must be able to represent that structure instead
of flattening everything into one generic workflow file.

At minimum, it needs to preserve these surface families:

- role-local `AGENTS.md` files under `paperclip_home/agents/`
- shared setup entrypoint under
  `paperclip_home/project_homes/lessons/shared/README.md`
- top-level shared workflow owner under
  `paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md`
- per-lane workflow docs under `proof_packets/`
- shared standards under `lessons_content_standards/`
- gate docs such as `LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md`
- technical references under `technical_references/`
- how-to guides under `how_to_guides/`
- coordination docs under `agent_coordination/`

It also needs to preserve the fact that some of these are:

- live runtime doctrine
- support docs
- references
- imported grounding material

## Source package shape

The first-cut canonical Lessons package in this repo now uses the simplest
reviewable shape:

```text
paperzod/
  setups/
    lessons/
      index.ts
```

That source package defines one setup graph with enough information to
generate the runtime markdown surfaces for the Lessons pod.

## Lessons setup model

At the highest level, the Lessons setup needs these source units:

- one `setup`
- many `roles`
- many `workflow_steps`
- one or more `review_gates`
- many `packet_contracts`
- many `artifacts`
- many runtime `surfaces`
- many addressable `surface_sections`
- many `references`
- many `generated_targets`

## Roles and role-home surfaces

The live Lessons role set currently includes at least:

- `Lessons Project Lead`
- `Section Dossier Engineer`
- `Section Concepts and Terms Curator`
- `Lessons Section Architect`
- `Lessons Playable Strategist`
- `Lessons Lesson Architect`
- `Lessons Situation Synthesizer`
- `Lessons Playable Materializer`
- `Lessons Copywriter`
- `Lessons Acceptance Critic`

In `paperzod`, each of these would be a `role` node.
Each role would also have one role-home `surface` for its generated
`AGENTS.md`.

That distinction matters:

- the `role` node represents the actor-level contract
- the role-home `surface` represents the runtime markdown file
- the role-home `surface_sections` represent exact addressable sections such as
  `Read First`, `How To Take A Turn`, and `Role Contract`

## Shared surfaces

The shared Lessons setup also needs first-class runtime `surface` nodes for
things like:

- `README.md`
- `AUTHORITATIVE_LESSONS_WORKFLOW.md`
- `proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md`
- `proof_packets/LESSONS_SECTION_ARCHITECT_WORKFLOW.md`
- `lessons_content_standards/LESSONS_PACKET_SHAPES.md`
- `lessons_content_standards/LESSONS_QUALITY_BAR.md`
- `lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md`
- `technical_references/POKER_KB.md`
- `how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md`
- `agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md`

These should not all be treated as the same kind of thing.

`paperzod` should let us classify them at least as:

- shared entrypoint surface
- workflow owner surface
- packet workflow surface
- standard surface
- gate surface
- technical reference surface
- how-to surface
- coordination surface

## Surface sections

The live Lessons setup relies on exact sections inside docs, not just whole
files.

Examples:

- `README.md` -> `Read Order`
- `README.md` -> `Find The Owner`
- `AUTHORITATIVE_LESSONS_WORKFLOW.md` -> `Owner Map`
- `AUTHORITATIVE_LESSONS_WORKFLOW.md` -> `Comment Shape`
- `AUTHORITATIVE_LESSONS_WORKFLOW.md` -> `Specialist Turn Shape`
- role-home `AGENTS.md` -> `Read First`
- role-home `AGENTS.md` -> `Role Contract`
- `LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md` -> `What the critic judges`
- `SECTION_DOSSIER_ENGINEER_WORKFLOW.md` -> `What This Lane Must Do`

These should be explicit `surface_section` nodes with stable ids.

That way the source model can say:

- a role reads this exact section
- a workflow step is documented by that exact section
- a gate checks the rule defined in that exact section

## References and grounding inputs

Lessons also depends on reference material that is not itself the live runtime
surface.

For this repo, that includes:

- [`docs/ref/LESSONS_WORKFLOW_SIMPLE_CLEAR.md`](/Users/aelaguiz/workspace/paperzod/docs/ref/LESSONS_WORKFLOW_SIMPLE_CLEAR.md)
- [`docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md`](/Users/aelaguiz/workspace/paperzod/docs/ref/LESSONS_STRUCTURED_DOCTRINE_REQUIREMENTS_2026-04-01.md)

These should be modelable as imported grounding references.

That means the system should be able to say:

- these docs shaped the setup design
- these docs are important references
- these docs are not the live runtime doctrine output

## Conceptual contracts versus current runtime files

This is the hardest part of the Lessons example.

The reference docs describe a cleaner conceptual chain:

- `SECTION_DOSSIER.md`
- `SECTION_CONCEPTS_AND_TERMS.md`
- `SECTION_LESSON_MAP.md`
- `SECTION_PLAYABLE_STRATEGY.md`
- `LESSON_PLAN.md`
- `LESSON_SITUATIONS.md`
- `ACTION_AUTHORITY.md`
- `lesson_manifest.json`
- `MANIFEST_VALIDATION.md`
- `COPY_GROUNDING.md`

But the live runtime still uses larger current packet bundles.

For example, the current section dossier lane is really represented by a
runtime packet bundle like:

- `PRIOR_KNOWLEDGE_MAP.md`
- `ADVANCEMENT_DELTA.md`
- `BRIEF.md`
- `CONCEPTS.md`
- optional support files such as `LOG.md`, `PROBLEMS.md`, and
  `HAND_USAGE_LEDGER.md`

If `paperzod` is correct, it must be able to represent both:

- the conceptual contract we want later lanes to think in
- the current runtime files the live Lessons setup still uses

## One concrete packet example

In `paperzod`, a good representation of the dossier lane would separate:

1. the conceptual packet contract
2. the current runtime packet members
3. the runtime surfaces and sections that describe the lane

For example:

```ts
const sectionDossierContract = {
  id: "section_dossier_contract",
  kind: "packet_contract",
  setupId: "lessons",
  name: "Section Dossier",
  conceptualArtifactIds: [
    "learner_baseline",
    "advancement_delta",
    "section_brief",
    "candidate_concepts",
  ],
  runtimeArtifactIds: [
    "prior_knowledge_map_md",
    "advancement_delta_md",
    "brief_md",
    "concepts_md",
    "log_md",
    "problems_md",
    "hand_usage_ledger_md",
  ],
};
```

That keeps the source honest:

- the conceptual contract stays visible
- the current runtime compatibility bundle stays visible
- the mapping is explicit instead of buried in prose

## One concrete lane example

The `Section Dossier Engineer` lane could be represented by:

```ts
const sectionDossierEngineerRole = {
  id: "section_dossier_engineer",
  kind: "role",
  setupId: "lessons",
  name: "Section Dossier Engineer",
  purpose: "Build first-principles section dossiers before language or architecture work.",
};

const sectionDossierStep = {
  id: "section_dossier_step",
  kind: "workflow_step",
  setupId: "lessons",
  roleId: "section_dossier_engineer",
  purpose: "Build the section dossier packet from learner baseline, continuity, and PokerKB grounding.",
  requiredInputIds: ["section_context", "adjacent_curriculum_context"],
  supportInputIds: ["poker_kb_reference"],
  requiredOutputIds: ["section_dossier_contract"],
  stopLine: "Stop before terminology lock, section architecture, playable choice, or copy work.",
  nextGateId: "lessons_acceptance_critic_gate",
};
```

Then the role, step, packet contract, runtime sections, and references can all
be linked explicitly instead of only inferred from markdown prose.

## One concrete section example

The shared workflow surface could look like:

```ts
const workflowSurface = {
  id: "lessons_workflow_surface",
  kind: "surface",
  setupId: "lessons",
  surfaceClass: "workflow_owner",
  runtimePath: "paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md",
};

const ownerMapSection = {
  id: "lessons_workflow.owner_map",
  kind: "surface_section",
  setupId: "lessons",
  surfaceId: "lessons_workflow_surface",
  stableSlug: "owner-map",
  title: "Owner Map",
};

const commentShapeSection = {
  id: "lessons_workflow.comment_shape",
  kind: "surface_section",
  setupId: "lessons",
  surfaceId: "lessons_workflow_surface",
  stableSlug: "comment-shape",
  title: "Comment Shape",
};
```

That is the level of structure the reference docs are asking for.

## Generated runtime targets

If this setup were compiled correctly, the target list would likely include:

Important current-reality note:

- the live Lessons tree currently keeps role homes under
  `paperclip_home/agents/.../AGENTS.md`
- the current `paperzod` proving fixtures instead place `role_home` outputs
  under `project_homes/lessons/roles/.../AGENTS.md`
- shared, standards, gate, reference, how-to, and coordination paths already
  line up much more closely with the live tree

### Role-home outputs

- `paperclip_home/agents/lessons_project_lead/AGENTS.md`
- `paperclip_home/agents/section_dossier_engineer/AGENTS.md`
- `paperclip_home/agents/section_concepts_terms_curator/AGENTS.md`
- `paperclip_home/agents/lessons_section_architect/AGENTS.md`
- `paperclip_home/agents/lessons_playable_strategist/AGENTS.md`
- `paperclip_home/agents/lessons_lesson_architect/AGENTS.md`
- `paperclip_home/agents/lessons_situation_synthesizer/AGENTS.md`
- `paperclip_home/agents/lessons_playable_materializer/AGENTS.md`
- `paperclip_home/agents/lessons_copywriter/AGENTS.md`
- `paperclip_home/agents/lessons_acceptance_critic/AGENTS.md`

### Shared setup outputs

- `paperclip_home/project_homes/lessons/shared/README.md`
- `paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md`

### Per-lane workflow outputs

- `proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md`
- `proof_packets/SECTION_CONCEPTS_TERMS_CURATOR_WORKFLOW.md`
- `proof_packets/LESSONS_SECTION_ARCHITECT_WORKFLOW.md`
- `proof_packets/LESSONS_PLAYABLE_STRATEGIST_WORKFLOW.md`
- `proof_packets/LESSONS_LESSON_ARCHITECT_WORKFLOW.md`
- `proof_packets/LESSONS_SITUATION_SYNTHESIZER_WORKFLOW.md`
- `proof_packets/LESSONS_PLAYABLE_MATERIALIZER_WORKFLOW.md`
- `proof_packets/LESSONS_COPYWRITER_WORKFLOW.md`
- `proof_packets/LESSONS_ACCEPTANCE_CRITIC_WORKFLOW.md`
- `proof_packets/LESSONS_PUBLISH_AND_FOLLOWTHROUGH_WORKFLOW.md`

### Standards and gate outputs

- `lessons_content_standards/LESSONS_PACKET_SHAPES.md`
- `lessons_content_standards/LESSONS_QUALITY_BAR.md`
- `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md`
- `lessons_content_standards/LESSON_COPY_STANDARDS.md`
- `lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md`
- `lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md`

### Reference and support outputs

- `technical_references/LESSONS_DOCTRINE_OWNERSHIP_MAP.md`
- `technical_references/LESSON_STEP_ROUTE_GUIDE.md`
- `technical_references/LESSONS_TOOL_REFERENCE.md`
- `technical_references/POKER_KB.md`
- `how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md`
- `how_to_guides/LESSONS_STAGING_QR_PROTOCOL.md`
- `agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md`

Not every one of these needs to be authored the same way.
But `paperzod` should be able to classify and target all of them.

## Suggested source graph shape

For Lessons, the most useful node families are:

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

And the most useful link families are:

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

This is the example that should drive the schema language.

## Why this example matters

If `paperzod` can model this Lessons shape honestly, it can probably model
other Paperclip setups too.

If it cannot, the product is still too abstract.

That is why the schema should be driven by this example rather than left as a
generic graph sketch with no proof that it can satisfy the real pod.
