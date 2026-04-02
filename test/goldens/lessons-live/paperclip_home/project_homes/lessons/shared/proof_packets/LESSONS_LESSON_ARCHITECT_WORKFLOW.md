# Lessons Lesson Architect Workflow

This file defines the shared workflow for the Lessons Lesson Architect lane.

It does not define handoff mechanics, the shared packet file rules, or
critic verdicts.

## What This Lane Must Do

- prove what this lesson owns and what it defers
- separate nearby earlier lessons from the truly comparable lessons used to
  judge lesson size
- build two lesson-flow tables inside `LESSON_ARCHITECTURE.md` before locking
  lesson size
- in the recent curriculum flow table, use the previous few sections in learn
  order
- build that table from real current lesson data in the current repo:
  use live lesson manifests when they exist and the current accepted lesson
  packet when they do not
- make the recent curriculum flow table show:
  lesson counts by section, step counts by lesson, total steps across each
  section, and the lesson-size band the learner has actually been moving
  through
- in the real comparable lessons table, list the lessons that really match
  this lesson's shape
- build that table from real current lesson data in the current repo:
  use live lesson manifests when they exist and the current accepted lesson
  packet when they do not
- make the real comparable lessons table show:
  comparable lesson names, step counts, main step kinds when that changes felt
  length, and why those lessons are actually comparable
- make the lesson's teaching load and example count logic explicit
- use both tables when you decide the lesson's step count, rep budget, and
  overall size
- record the explicit shorter, same, or longer judgment
- do not blend the recent curriculum flow table and the real comparable
  lessons table into one friendly precedent list
- do not let the lesson suddenly collapse in size compared with the lesson-size
  band the learner has just been moving through
- if the lesson comes out much shorter than that recent run, treat that as a
  sign the lesson is underbuilt and fix it before handoff
- make `LESSON_ARCHITECTURE.md` say what is genuinely new here
- make `LESSON_ARCHITECTURE.md` say what it is building on from earlier
  sections
- make `LESSON_ARCHITECTURE.md` say what it is not reteaching
- make `LESSON_ARCHITECTURE.md` say why this lesson should not be shorter
- make `LESSON_ARCHITECTURE.md` say why this lesson should not be longer
- make `LESSON_ARCHITECTURE.md` say what must stay stable
- make `LESSON_ARCHITECTURE.md` say what can vary safely
- keep guided walkthrough pacing as a guardrail, not the main proof of total
  lesson size
- when `guided_walkthrough` is in scope, make `LESSON_ARCHITECTURE.md` say
  what the walkthrough must visibly install before the first graded rep
- when `guided_walkthrough` is in scope, make `LESSON_ARCHITECTURE.md` say
  how quickly it cashes out into the first graded rep
- when `guided_walkthrough` is in scope, make `LESSON_ARCHITECTURE.md` say
  what current comparable lesson length evidence supports that pacing
- keep the visible action button contract separate from strategy language
  explanation

## Files That Count As The Packet

Name the lesson architecture packet exactly:

- `lesson_root/_authoring/LESSON_ARCHITECTURE.md`
- any local lesson planning file the packet cites as live proof
- the current run gate bundle and named files when a run gate bundle
  applies

Do not treat raw comparable source files as live packet members unless the
packet asks the critic to review those raw files directly.


# Missing workflow:

INPUT FROM section architect

For just this lesson

What are new concepts being taught
What new vocab is being introduced
What order are they being taught in