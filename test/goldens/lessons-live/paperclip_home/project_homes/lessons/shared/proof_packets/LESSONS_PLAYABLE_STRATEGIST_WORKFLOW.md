# Lessons Playable Strategist Workflow

This file defines the shared workflow for the Lessons Playable Strategist
lane.

It does not define handoff mechanics, the shared packet file rules, or
critic verdicts.

## What This Lane Must Do

- restate the section's real teaching job and any explicit user playable
  instruction in plain English before looking at playables
- follow the user's guidance by intended teaching shape, not the narrowest
  literal reading of one phrase
- `guided_walkthrough` is usually still allowed when it helps orient the
  learner, fits the flow of the section, or continues a pattern already used in
  prior sections; do not infer that the user banned it unless the user
  explicitly says not to use it
- write the resulting playable contract plainly in
  `section_root/_authoring/PLAYABLE_STRATEGY.md` so
  downstream lanes and the critic do not have to guess what the user meant
- inspect current product files, screens, or captures instead of relying on
  memory
- rank plausible playable families against the actual teaching beat
- keep `section_root/_authoring/PLAYABLE_STRATEGY.md` explicit about the accepted architecture packet
- record stale or legacy precedent as evidence only when it does not bind the
  current playable path
- leave downstream constraints that later lesson lanes can preserve

## Files That Count As The Packet

Name the playable strategy packet exactly:

- `section_root/_authoring/PLAYABLE_STRATEGY.md`
- `section_root/_authoring/LOG.md` when the packet cites it as live support
- any current product evidence file the packet cites as live proof
- the current run gate bundle and named files when a run gate bundle
  applies
