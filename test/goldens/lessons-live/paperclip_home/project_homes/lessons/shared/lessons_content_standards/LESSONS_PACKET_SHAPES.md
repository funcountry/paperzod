# Lessons Packet Shapes

This file owns the packet families used to start Lessons work.

Use it to answer one question: what packet shape should I create for this job?
Do not use it for workflow timing, receipt policy, or verdict routing. Those
belong in the workflow, receipt, and critic docs.

## What this file covers

- track packets
- section packets
- lesson packets
- the smallest useful packet set for each authoring job

## Track packet

Use a track packet when the work is about the shape of a track or the main
advancement it creates.

Canonical track packet shape:

- `track.meta.json`
- `PRIOR_KNOWLEDGE_MAP.md`
- `ADVANCEMENT_DELTA.md`
- `BRIEF.md`
- `CONCEPTS.md`
- a section-by-section map inside the brief

The track packet should answer:

- what advancement the track creates
- what baseline it assumes
- what it refuses to repeat
- why the section order is what it is
- which concepts or claims need grounding

## Section packet

Use a section packet when the work is about one section inside a track.

Canonical section packet shape:

- `section_root/_authoring/PRIOR_KNOWLEDGE_MAP.md`
- `section_root/_authoring/ADVANCEMENT_DELTA.md`
- `section_root/_authoring/BRIEF.md`
- `section_root/_authoring/CONCEPTS.md`
- `section_root/_authoring/LOG.md`
- `section_root/_authoring/PROBLEMS.md` when the packet needs a visible problem list
- `section_root/_authoring/HAND_USAGE_LEDGER.md` when rep variety or adjacent-lesson repetition matters
- `section_root/_authoring/VOCAB.md` after the language packet is locked
- `section_root/_authoring/TERM_DECISIONS.md` after the language packet is locked
- `section_root/_authoring/LEARNING_JOBS.md` after the section work is clear
- `section_root/_authoring/SECTION_FLOW_AUDIT.md` when section lesson count is being checked against the
  previous two sections
- `section_root/_authoring/STRAWMAN_LESSON_CONTAINERS.md` when the section needs possible lesson shells
- `section_root/_authoring/TEMPLATE_DECISION.md` when the section is choosing a template family
- `section_root/_authoring/TEMPLATE.md` when the section has a fixed template
- `section_root/_authoring/SECTION_ARCHITECTURE.md` when the section layout is being locked
- `section_root/_authoring/PLAYABLE_STRATEGY.md` when the section needs playable choice guidance

The section packet should answer:

- why this section exists now
- what the learner already knows
- what is genuinely new
- what is deferred
- which packet owns the next step

## Lesson packet

Use a lesson packet when the work is about one lesson, one lesson slot, or one
exact step arc.

Canonical lesson packet shape:

- `lesson_root/_authoring/LESSON_ARCHITECTURE.md`
- `lesson_root/_authoring/SITUATION_SYNTHESIS.md`
- `lesson_root/_authoring/ACTION_AUTHORITY.md` when exact action claims shown to the learner are in scope
- `lesson_root/lesson_manifest.json`
- `lesson_root/COPY_RECEIPTS.md`
- `lesson_root/ANTI_LEAK_AUDIT.md`

The lesson packet should answer:

- what one lesson owns
- what it defers
- what recent lesson-size run the learner has been moving through across the
  previous few sections
- what real comparable lessons were checked before lesson size was locked
- what exact spot or step it teaches
- what shape the learner will actually see
- which receipts prove the shape is honest

## Choosing the right packet

- start with a track packet when the job is about a whole track
- use a section packet when the job is about one section
- use a lesson packet when the job is about one lesson or one step arc
- use the smallest packet that can still prove the claim honestly
- do not create packet files that are not needed for the job
