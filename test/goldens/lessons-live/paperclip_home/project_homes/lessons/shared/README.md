# Lessons Shared Doctrine

This folder is the live shared doctrine home for the Lessons project.

Start here, then open the one file that owns the question you need answered.
The injected `paperclip` skill still owns generic coordination, and the
repo-root `skills/` packages still own reusable cross-project workflow rules.

## Terms

These definitions are here so readers do not have to guess what a word means.

### Paperclip Items

- `issue`
  - a Paperclip issue
  - this is the unit of work
- `comment`
  - a comment on a Paperclip issue
- `owner`
  - the current person or agent assigned to the Paperclip issue

### Lessons Workflow Items

- `handoff`
  - a clear issue comment plus reassignment of the same Paperclip issue to the next owner
- `attached checkout`
  - the product repo checkout where the lesson files actually live
- `current lesson files`
  - the lesson files plus issue context the current step is working from
- `packet`
  - the set of files and receipts this step produces and asks the next owner to trust
- `proof`
  - the files, outputs, or receipts that make a packet trustworthy
- `lock`
  - a decision later steps are allowed to rely on without reopening it
- `critic`
  - the `Lessons Acceptance Critic` role
- `accept`
  - the critic says the current packet is ready for the declared next step
- `changes requested`
  - the critic says the packet is not ready and names the earliest owner who should fix it
- `publish`
  - the stage where the current lesson work is turned into PR and QR state that others can review or test
- `followthrough`
  - the work after publish, such as PR updates, QR fixes, review fixes, and merge-readiness work

### PokerSkill Lessons Items

- `section root`
  - the folder for one section in the attached PokerSkill lessons repo
- `lesson root`
  - the folder for one lesson in the attached PokerSkill lessons repo
- `lesson slot`
  - the canonical place of a lesson in the section architecture, even if current folder names are messy
- `lesson_root/lesson_manifest.json`
  - the authoring file that declares the current lesson shape on disk
- `step`
  - one learner-visible unit inside a lesson
- `step kind`
  - the structural type of a step exposed by the current PokerSkill lessons repo
- `playable`
  - the lesson interaction shape the learner actually sees
- `guided_walkthrough`
  - a dedicated step kind for guided beats inside a walkthrough-style playable
- `scripted_hand`
  - a dedicated step kind built from a real hand history plus explicit decision points

## Read Order

After this map, read in this order:

1. `AUTHORITATIVE_LESSONS_WORKFLOW.md`
2. the one owner named by `Find The Owner` for your current question

Do not read critic, publish, packet workflow, or content standard files by
default. Open them only when `Find The Owner` points you there.

## Find The Owner

- lane map, lane order, same-issue handoff, comment shape, or packet truth:
  `AUTHORITATIVE_LESSONS_WORKFLOW.md`
- critic turn shape, read order, or critic-specific review steps:
  `proof_packets/LESSONS_ACCEPTANCE_CRITIC_WORKFLOW.md`
- what the critic needs before full review and what verdicts mean:
  `lessons_content_standards/LESSONS_ACCEPTANCE_CRITIC_CRITERIA.md`
- publish, PR, QR, or followthrough decisions:
  `proof_packets/LESSONS_PUBLISH_AND_FOLLOWTHROUGH_WORKFLOW.md`
- packet shapes:
  `lessons_content_standards/LESSONS_PACKET_SHAPES.md`
- quality bar:
  `lessons_content_standards/LESSONS_QUALITY_BAR.md`
- poker meaning, wording, and grounding rules:
  `lessons_content_standards/LESSONS_POKER_GROUNDING_RULES.md`
- learner copy standards:
  `lessons_content_standards/LESSON_COPY_STANDARDS.md`
- if the lesson tells the learner the right move in a specific hand:
  `lessons_content_standards/LESSON_RIGHT_MOVE_RULES.md`
- where a Lessons rule or file belongs, or how the doctrine layers differ:
  `technical_references/LESSONS_DOCTRINE_OWNERSHIP_MAP.md`
- route choice for lesson step materialization:
  `technical_references/LESSON_STEP_ROUTE_GUIDE.md`
- what each tool is for:
  `technical_references/LESSONS_TOOL_REFERENCE.md`
- how to use the PokerKB runner:
  `technical_references/POKER_KB.md`
- GitHub helper mechanics:
  `how_to_guides/LESSONS_GITHUB_ACCESS_PROTOCOL.md`
- staging QR helper mechanics:
  `how_to_guides/LESSONS_STAGING_QR_PROTOCOL.md`
- attached checkout startup guidance:
  `agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md`
- old dependency name lookup:
  `technical_references/AGENT_RUNTIME_REFERENCE_MAP.md`

## Directory Map

- root files
  - top-level map and workflow owner
- `agent_coordination/`
  - attached-checkout bootstrap
- `proof_packets/`
  - lane packet workflows, publish rules, and maintenance rules
- `lessons_content_standards/`
  - packet shapes, quality bar, poker grounding, copy rules, and right-move rules
- `technical_references/`
  - tool references, route guides, runtime maps, doctrine maps, and runner instructions
- `how_to_guides/`
  - local project GitHub and QR helper mechanics

## Rule

Use the attached checkout for current product state only. Do not treat attached
checkout instruction files, old plans, other repos, or state stored globally
on this machine as shared Lessons workflow owners.

If a shared rule is missing, add or repair the shared owner here instead of
reaching into a sibling repo or an old skill dependency.
