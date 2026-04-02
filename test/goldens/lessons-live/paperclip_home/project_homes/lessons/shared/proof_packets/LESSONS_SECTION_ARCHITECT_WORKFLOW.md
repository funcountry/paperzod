# Lessons Section Architect Workflow

This file defines the shared workflow for the Lessons Section Architect lane.

It does not define handoff mechanics, the shared packet file rules, or
critic verdicts.

## What This Lane Must Do

- derive lesson count from learning jobs, not symmetry or comfort
- build `section_root/_authoring/SECTION_FLOW_AUDIT.md` before locking lesson count
- in that audit, list the previous two sections in the track and their lesson
  counts
- use that audit to keep the learner's experience steady from section to
  section
- when you set the count, check the real teaching burden in this section
- when you set the count, also check the recent section-length pattern the
  learner has just been moving through
- do not let the section suddenly collapse in size compared with the previous
  two sections
- if the count comes out much smaller than the previous two sections, treat
  that as a sign the architecture is underbuilt and fix it before handoff
- lock concept, term, and vocabulary decisions before architecture depends on
  them
- choose template family from repeated learner behavior, not aesthetics
- make canonical lesson identity and repo root mapping explicit in
  `section_root/ARCHITECTURE_LOCK.md`
- make `section_root/_authoring/SECTION_ARCHITECTURE.md` say which previous
  two sections were audited
- make `section_root/_authoring/SECTION_ARCHITECTURE.md` say what their lesson
  counts were
- make `section_root/_authoring/SECTION_ARCHITECTURE.md` say what this section is building on from
  them
- make `section_root/_authoring/SECTION_ARCHITECTURE.md` say what this section
  is not reteaching
- make `section_root/_authoring/SECTION_ARCHITECTURE.md` say why this lesson
  count is not too small
  for the learner's run through the track
- use `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md` only for bounded concept split or
  sequencing questions

## Files That Count As The Packet

Name the section architecture packet exactly:

- `section_root/_authoring/LEARNING_JOBS.md`
- `section_root/_authoring/SECTION_FLOW_AUDIT.md`
- `section_root/_authoring/STRAWMAN_LESSON_CONTAINERS.md`
- `section_root/_authoring/TEMPLATE_DECISION.md`
- `section_root/_authoring/TEMPLATE.md`
- `section_root/_authoring/SECTION_ARCHITECTURE.md`
- the current `section_root/ARCHITECTURE_LOCK.md`
- `section_root/_authoring/LOG.md` when the packet cites it as live support
- the current run gate bundle and named files when a run gate bundle
  applies


# Missing workflow

INPUT FROM SECTION CONCEPTS TERM CURATOR WORKFLOW

- Map the concepts -> lessons
- Then build lessons and tag lesson steps from that locked concept map.`