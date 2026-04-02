# Lessons Workflow

This is the top-level workflow for Lessons.

This is the only live file that owns:

- the normal Lessons lane order
- the rule for who gets the same issue next
- the rule that the critic sits between normal work lanes

It says:

- who the normal owners are
- what order work moves in
- how the same issue moves from one owner to the next
- what every Lessons issue comment must say

Use the injected `paperclip` skill for generic coordination.
Use `lessons_content_standards/LESSONS_PACKET_SHAPES.md` to choose the right packet shape.
Use each owner's packet workflow file for the actual work in that step.

## Core Rules

- Keep normal Lessons work inside the Lessons project.
- Keep normal serial work on one issue. Reassign that same issue as ownership changes.
- Each owner works from the current issue plus the packet left by the previous step.
- Each owner does only the work their step owns.
- Each owner leaves one clear comment, reassigns the issue, and ends their turn.
- After any normal work lane finishes its packet, the next owner is `Lessons Acceptance Critic`.
- The critic either sends the same issue forward to the next normal lane, sends it back to the earliest owner who should fix it, or sends it to `Lessons Project Lead` when the right owner is unclear.
- Routine classification, review, and followthrough do not go to `CEO`.
- If no current specialist fits, keep the issue on `Lessons Project Lead`.

## Owner Map

- `Lessons Project Lead`
  - routing, issue shaping, template upkeep, exceptions, and owner gaps
- `Section Dossier Engineer`
  - section research and dossier packets
  - `proof_packets/SECTION_DOSSIER_ENGINEER_WORKFLOW.md`
- `Section Concepts and Terms Curator`
  - concept, term, and glossary lock
  - `proof_packets/SECTION_CONCEPTS_TERMS_CURATOR_WORKFLOW.md`
- `Lessons Section Architect`
  - section architecture, lesson count, template choice, and `ARCHITECTURE_LOCK.md`
  - `proof_packets/LESSONS_SECTION_ARCHITECT_WORKFLOW.md`
- `Lessons Playable Strategist`
  - playable choice and downstream constraints
  - `proof_packets/LESSONS_PLAYABLE_STRATEGIST_WORKFLOW.md`
- `Lessons Lesson Architect`
  - one lesson's job, burden, and step arc
  - `proof_packets/LESSONS_LESSON_ARCHITECT_WORKFLOW.md`
- `Lessons Situation Synthesizer`
  - concrete reps, candidate-set proof, and repetition control
  - `proof_packets/LESSONS_SITUATION_SYNTHESIZER_WORKFLOW.md`
- `Lessons Playable Materializer`
  - `lesson_root/lesson_manifest.json`, step-route choice, and validation receipts
  - `proof_packets/LESSONS_PLAYABLE_MATERIALIZER_WORKFLOW.md`
- `Lessons Copywriter`
  - learner copy, feedback alignment, poker-native wording, and anti-leak review
  - `proof_packets/LESSONS_COPYWRITER_WORKFLOW.md`
- `Lessons Acceptance Critic`
  - explicit `accept` or `changes requested`
  - `proof_packets/LESSONS_ACCEPTANCE_CRITIC_WORKFLOW.md`
  - `lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md`

## Comment Shape

Every Lessons handoff, verdict, or blocker comment should say:

- what this turn did: built a packet, accepted a packet, requested changes, or stopped before full review
- the main decisions this turn locked, in plain English, and why those choices were made
- what packet or files the next owner or reviewer should trust now
- the exact missing fact, stale proof, or failing gate when the work is blocked or not accepted
- the next owner when ownership is changing now
- any difficulties, confusing instruction or bugs you found along the way. this helps us improve our process going forward. It is a meta commentary that is not for usage by the agents (consumed by the board/CEO)

When this turn locked real decisions, make that part of the comment easy to
scan. A short list is better than one dense sentence.

Simple format:

- `Decisions locked:`
- `Concepts:` We locked fold equity and showdown value as core concepts because
  later lesson planning depends on both.
- `Lesson count:` We set this section to 6 lessons because 4 would rush the
  teaching burden.
- `Lesson length:` We kept the lessons short because this section needs more
  reps, not longer explanations.

Keep the comment short enough that the next owner can read it in one pass.

## Specialist Turn Shape

1. Read the active issue and the current packet you are working from.
2. Read the packet, lock, or proof from the previous step that your work depends on.
3. Do only the work owned by your step's packet workflow.
4. Update the packet and any supporting files that now matter.
5. If this turn changed files, commit that work before handoff. If it did not,
   say that plainly in your comment.
6. Leave one clear comment that follows `Comment Shape`.
7. Reassign the same issue to `Lessons Acceptance Critic` and stop.

Use assignment for handoff. Do not rely on `@mentions` or comment-only routing.
If the next step is not honest yet, say why and mark the issue blocked instead of handing off weak work.

## Run Gate Bundles

Run gate bundles are packet support, not loose operator logs.

For new Lessons work, keep them under the closest owning authoring root as
`<owner_root>/_authoring/_run_gate_logs/<runId>/`.

- track work uses the track root
- section work uses the section root
- lesson work uses the lesson root

Check the bundle in and commit it with the work it justifies.

Do not create new run gate bundles under `docs/lessons/writer/**`.
The old `docs/lessons/writer/run_gate_logs/**` and
`docs/lessons/writer/gates/**` trees are legacy compatibility paths only.

## Older Lesson-Writing Files

You may encounter older or stale lesson-writing files in the area you are
changing, including legacy material under paths such as
`<owner_root>/_authoring/_legacy/`,
but not only there.

Do not leave those files behind as parallel truth.

If they contain useful material that still holds up against the current
accepted packet, current locks, and current catalog truth, move that useful
material into the live surfaces you are producing. Then update or delete the
stale files that conflict with the live packet you are handing off.

If a stale file in the area no longer matches the packet you are leaving, clear
it before handoff. Do not label it reference material, non-blocking drift, or
later-lane cleanup just because your packet moved first.

The critic uses `proof_packets/LESSONS_ACCEPTANCE_CRITIC_WORKFLOW.md` for its read order and critic-specific review steps. That file does not own the normal lane order or the same-issue handoff law.

## Default Order For New Content

1. `Lessons Project Lead` opens, shapes, and routes the issue
2. `Section Dossier Engineer`
3. `Lessons Acceptance Critic`
4. `Section Concepts and Terms Curator`
5. `Lessons Acceptance Critic`
6. `Lessons Section Architect`
7. `Lessons Acceptance Critic`
8. `Lessons Playable Strategist`
9. `Lessons Acceptance Critic`
10. `Lessons Lesson Architect`
11. `Lessons Acceptance Critic`
12. `Lessons Situation Synthesizer`
13. `Lessons Acceptance Critic`
14. `Lessons Playable Materializer`
15. `Lessons Acceptance Critic`
16. `Lessons Copywriter`
17. `Lessons Acceptance Critic`
18. `Lessons Project Lead` for publish and followthrough

## Critique And Remediation

- The critic is the gate between normal work lanes.
- Do not treat a packet as ready for the next specialist until the critic leaves an explicit verdict.
- On `accept`, the critic sends the same issue to the next normal lane named in this file.
- On `changes requested`, the critic sends the same issue to the earliest owner who can fix it, or to `Lessons Project Lead` if the right owner is unclear.
- Do not send work back downstream by habit.

## Publish And Followthrough

- After the last specialist lane and critic accept, reassign the same issue to
  `Lessons Project Lead`.
- `Lessons Project Lead` owns PR, QR, and followthrough by default.
- The lead may reassign a bounded followthrough slice inside Lessons when a
  new problem clearly belongs to a specific lane, but the lead stays
  responsible for keeping one clear owner, one current plan, and one current
  stop line on the issue.
- Use `proof_packets/LESSONS_PUBLISH_AND_FOLLOWTHROUGH_WORKFLOW.md`.
- Publish, PR, QR, and followthrough stay inside Lessons until that file says the work is done.

## Existing Lesson Maintenance

- Use `proof_packets/LESSONS_EXISTING_LESSON_MAINTENANCE_WORKFLOW.md`.
- Keep maintenance work bounded.
- If the issue turns into redesign, stop and re-plan on the same issue.
