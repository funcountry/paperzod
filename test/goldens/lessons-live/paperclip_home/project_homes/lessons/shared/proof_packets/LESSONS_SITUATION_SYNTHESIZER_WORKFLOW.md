# Lessons Situation Synthesizer Workflow

This file defines the shared workflow for the Lessons Situation Synthesizer
lane.

It does not define handoff mechanics, the shared packet file rules, or
critic verdicts.

## What This Lane Must Do

- restate the lesson step jobs before choosing reps
- write the exact spot spec before final keep or block decisions when exact
  action is in scope
- use the candidate-search method that matches the lesson shape
- build a real deterministic candidate set before choosing kept reps
- keep proof that the examples are not accidental repeats, plus a record of
  what you rejected and why
- if a kept concrete rep loses exact action authority, replace it

## Files That Count As The Packet

Name the situation packet exactly:

- `lesson_root/_authoring/SITUATION_SYNTHESIS.md`
- `lesson_root/_authoring/ACTION_AUTHORITY.md` when exact shown to the learner
  action recommendations are in scope
- any candidate set, rejection, repetition, or claim type file the packet cites
  as live proof
- the current run gate bundle and named files when a run gate bundle
  applies
