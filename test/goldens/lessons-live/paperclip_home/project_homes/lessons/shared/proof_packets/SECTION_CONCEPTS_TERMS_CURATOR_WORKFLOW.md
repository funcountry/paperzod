# Section Concepts and Terms Curator Workflow

This file defines the shared workflow for the Section Concepts and Terms
Curator lane.

It does not define handoff mechanics, the shared packet file rules, or
critic verdicts.

## What This Lane Must Do

- restate the section teaching job in plain English before touching ids
- route each candidate item explicitly as `concept`, `defined term`, `both`,
  `writer vocabulary`, or `reject`
- handle concept work semantically first, then handle term work
  deterministically
- keep concept work and glossary surfacing separate
- use `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` for disputed meaning or real poker
  wording

## Files That Count As The Packet

Name the section language packet exactly:

- `section_root/_authoring/CONCEPTS.md`
- `section_root/_authoring/VOCAB.md`
- `section_root/_authoring/TERM_DECISIONS.md`
- `section_root/_authoring/LOG.md` when the packet cites it as live support
- any glossary support file the packet cites as live proof
- the current run gate bundle and named files when a run gate bundle
  applies





# Missing workflow:

INPUT FROM  SECTION DOSSIER ENGINER
  - First decide the section’s teaching burden.
  - Then decide what is a concept versus a term.
  - Then map concepts to real IDs and create missing ones.
  - Then decide all terms that should be taught in these sections/lessons
  - Then create or fix glossary terms when needed.
  - Then order the concepts into a teaching path. -> THe order they get taught in
  - Save them all out to our packet -> Specific place
