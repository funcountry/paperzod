# Lessons Playable Materializer Workflow

This file defines the shared workflow for the Lessons Playable Materializer
lane.

It does not define handoff mechanics, the shared packet file rules, or
critic verdicts.

## What This Lane Must Do

- choose the step route from the live checkout, not memory
- build the manifest from the current situation packet without freewriting final
  learner copy
- validate specialized steps and the lesson manifest against the live checkout
- preserve or refresh action authority parity when exact action is in scope
- preserve the visible action button contract from the copy standards
- use `technical_references/LESSON_STEP_ROUTE_GUIDE.md` for route choice and validator proof
- leave placeholder copy status explicit

## Files That Count As The Packet

Name the materialization packet exactly:

- `lesson_root/lesson_manifest.json`
- build and validation receipt files cited as live proof
- any explicit placeholder copy status file the packet depends on
- the current `lesson_root/GUIDED_WALKTHROUGH_LENGTH_REPORT.md` when
  `guided_walkthrough` is in scope
- the current run gate bundle and named files when a run gate bundle
  applies

## Authoring Manifest Validation Before Sync

Use this fallback when the packet only changes the authoring
`lesson_root/lesson_manifest.json` and no sync or build step has produced
`packages/game_content/assets/lessons/**` yet.

Rules:

- use the shared helper scripts and current repo models to validate the exact
  authoring manifest on disk
- do not treat `make lessons-validate-one` as an authoring-manifest validator
  in that state; it validates shipped lesson assets
- record the exact command and output you used for the fallback validation in
  the run gate bundle or the named validation receipt files
- for `single_select_with_parallax_table`, check `copy`, `feedback`,
  `context.hero`, and `context.parallaxTable` explicitly
- if validation only passes after shortening copy or coach text, say that in
  the receipt so the copy lane sees the constraint
