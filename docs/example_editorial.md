# Example Editorial

## Purpose

This document is the public readback of the canonical `editorial` setup in
`setups/editorial/**`.

It exists to show what a real setup looks like once it is split into clear
source modules, compiled through the generic pipeline, and rendered into a
Paperclip-style runtime tree.

## Why This Example Exists

The editorial setup is the high-fidelity public proving case.

It is demanding enough to prove that `paperzod` can handle:

- role homes
- a project home root
- a shared entrypoint
- an authoritative workflow owner
- lane-specific workflow docs
- standards
- a gate
- technical references
- how-to guides
- coordination docs
- imported grounding references

## Current Source Shape

The canonical package lives under `setups/editorial/`:

- `roles.ts`
- `workflow.ts`
- `artifacts.ts`
- `references.ts`
- `surfaces.ts`
- `targets.ts`
- `links.ts`
- `index.ts`

`index.ts` assembles those pieces with `defineSetupModule(...)`.

The setup id is `editorial`.
The source module also declares owned output scopes for:

- `paperclip_home/project_homes/editorial`
- `paperclip_home/agents/brief_researcher/AGENTS.md`
- `paperclip_home/agents/story_architect/AGENTS.md`

## Roles

The public editorial example currently uses two roles:

- `Brief Researcher`
- `Story Architect`

That is enough to prove the full workflow pattern:

- one lane produces a conceptual packet plus compatibility residue
- the next lane consumes the conceptual contract, not just a raw file list
- a gate checks the downstream packet and the shared quality bar

## Workflow

The editorial workflow is:

1. `brief_research_step`
2. `story_architect_step`
3. `editorial_acceptance_gate`

Conceptual packet contracts:

- `Editorial Brief`
- `Story Outline`

Compatibility artifacts:

- `PRIOR_RESEARCH_NOTES.md`
- `BRIEF_REQUEST.md`
- `SOURCE_NOTES.md`
- `STORY_OUTLINE_RUNTIME.md`

## Runtime Surfaces

The generated runtime tree includes:

- `paperclip_home/agents/brief_researcher/AGENTS.md`
- `paperclip_home/agents/story_architect/AGENTS.md`
- `paperclip_home/project_homes/editorial/README.md`
- `paperclip_home/project_homes/editorial/shared/README.md`
- `paperclip_home/project_homes/editorial/shared/AUTHORITATIVE_EDITORIAL_WORKFLOW.md`
- `paperclip_home/project_homes/editorial/shared/workflow_packets/BRIEF_RESEARCHER_WORKFLOW.md`
- `paperclip_home/project_homes/editorial/shared/workflow_packets/STORY_ARCHITECT_WORKFLOW.md`
- `paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_PACKET_SHAPES.md`
- `paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_QUALITY_BAR.md`
- `paperclip_home/project_homes/editorial/shared/editorial_standards/EDITORIAL_ACCEPTANCE_CRITERIA.md`
- `paperclip_home/project_homes/editorial/shared/technical_references/AUDIENCE_RESEARCH_KB.md`
- `paperclip_home/project_homes/editorial/shared/how_to_guides/EDITORIAL_GITHUB_PROTOCOL.md`
- `paperclip_home/project_homes/editorial/shared/agent_coordination/EDITORIAL_PUBLISH_BOOTSTRAP.md`

## Why This Is Useful

This example proves a few important things at once:

- the compiler can own a realistic shared doctrine tree
- exact section-level reads and ownership survive helper sugar
- conceptual contracts can stay distinct from compatibility-only runtime files
- output ownership and prune behavior can be declared in source
- the same framework still supports a second non-editorial setup
