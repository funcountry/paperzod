# Lessons Doctrine Ownership Map

This guide explains where Lessons doctrine belongs now that repo-owned agent
homes use `AGENTS.md` only.

Use this file to get oriented or decide where a new rule should live.
Do not use it as a replacement for the real owner files. When a rule matters,
follow the owner named here and edit that owner directly.

## Main rules

- Shared Lessons behavior lives in the Lessons shared owners first.
- Repo-owned agent homes use `AGENTS.md` only.
- If several Lessons agents must stay in sync, move the rule to a shared owner
  instead of copying it into several homes.
- Delete duplicate doctrine instead of keeping backup explanations.
- Doctrine-only work stays in doctrine owners. Do not patch old worktrees or
  attached checkouts as part of doctrine cleanup.

## Shared owners

| Owner | Path | What it owns |
| --- | --- | --- |
| Repo-wide runtime doctrine | `paperclip_home/agents/shared/` | runtime load order, attached-checkout boundaries, same-issue rules, and other repo-wide runtime law |
| Lessons shared entrypoint | `paperclip_home/project_homes/lessons/shared/README.md` | how to find the right Lessons owner |
| Lessons workflow owner | `paperclip_home/project_homes/lessons/shared/AUTHORITATIVE_LESSONS_WORKFLOW.md` | lane order, handoff, same-issue workflow, and lane map |
| Lessons packet workflows | `paperclip_home/project_homes/lessons/shared/proof_packets/` | what each lane must produce and prove |
| Lessons content standards | `paperclip_home/project_homes/lessons/shared/lessons_content_standards/` | quality bar, packet shapes, grounding, copy rules, and right-move rules |
| Lessons helper and reference docs | `paperclip_home/project_homes/lessons/shared/how_to_guides/` and `paperclip_home/project_homes/lessons/shared/technical_references/` | helper mechanics, tool references, runner instructions, and ownership maps |

## Agent-home rule

Every repo-owned Lessons agent home now has one live local file:

- `AGENTS.md` for the role, local boundaries, and the shared owners that role
  must read

Do not add a second role-local file layer.
If local text does not still change behavior, delete it.

## Current Lessons agent homes

| Agent home | Main job | Local file | Main outputs or proof |
| --- | --- | --- | --- |
| `paperclip_home/agents/lessons_project_lead/` | route the issue, keep ownership and next step coherent, handle owner gaps and doctrine upkeep | `AGENTS.md` | issue shaping, routing comment, current issue `plan` |
| `paperclip_home/agents/section_dossier_engineer/` | build the section dossier from first principles | `AGENTS.md` | `section_root/_authoring/PRIOR_KNOWLEDGE_MAP.md`, `section_root/_authoring/ADVANCEMENT_DELTA.md`, `section_root/_authoring/BRIEF.md`, `section_root/_authoring/CONCEPTS.md`, `section_root/_authoring/LOG.md`, `section_root/_authoring/PROBLEMS.md` |
| `paperclip_home/agents/section_concepts_terms_curator/` | lock concepts, terms, aliases, and writer vocabulary for the section | `AGENTS.md` | `section_root/_authoring/CONCEPTS.md`, `section_root/_authoring/VOCAB.md`, `section_root/_authoring/TERM_DECISIONS.md` |
| `paperclip_home/agents/lessons_section_architect/` | choose honest lesson count, template family, and canonical lesson slot mapping | `AGENTS.md` | `section_root/_authoring/LEARNING_JOBS.md`, `section_root/_authoring/SECTION_FLOW_AUDIT.md`, `section_root/_authoring/STRAWMAN_LESSON_CONTAINERS.md`, `section_root/_authoring/TEMPLATE_DECISION.md`, `section_root/_authoring/TEMPLATE.md`, `section_root/_authoring/SECTION_ARCHITECTURE.md`, `section_root/ARCHITECTURE_LOCK.md` |
| `paperclip_home/agents/lessons_playable_strategist/` | choose the playable corridor and capstone path from current product truth | `AGENTS.md` | `section_root/_authoring/PLAYABLE_STRATEGY.md` |
| `paperclip_home/agents/lessons_lesson_architect/` | shape one lesson's burden, step arc, pacing, and downstream constraints | `AGENTS.md` | `lesson_root/_authoring/LESSON_ARCHITECTURE.md` |
| `paperclip_home/agents/lessons_situation_synthesizer/` | turn the lesson plan into concrete reps, candidate-set proof, and action-authority proof when needed | `AGENTS.md` | `lesson_root/_authoring/SITUATION_SYNTHESIS.md` and `lesson_root/_authoring/ACTION_AUTHORITY.md` when exact action advice survives |
| `paperclip_home/agents/lessons_playable_materializer/` | build and validate `lesson_root/lesson_manifest.json` from the locked lesson packet | `AGENTS.md` | `lesson_root/lesson_manifest.json`, builder receipts, validation receipts, and `lesson_root/GUIDED_WALKTHROUGH_LENGTH_REPORT.md` when needed |
| `paperclip_home/agents/lessons_copywriter/` | rewrite learner-facing copy and feedback without changing lesson structure or authority | `AGENTS.md` | `lesson_root/lesson_manifest.json`, `lesson_root/COPY_RECEIPTS.md`, `lesson_root/ANTI_LEAK_AUDIT.md`, and refreshed validation proof |
| `paperclip_home/agents/lessons_acceptance_critic/` | judge the packet in front of it and leave `accept` or `changes requested` | `AGENTS.md` | explicit verdict comment and honest reroute to the next owner |

## Do not reintroduce

- agent homes as parallel workflow manuals
- local copies of shared packet law or shared content standards
- new pointer hops inside already-loaded shared doctrine
- helper guides that start owning workflow meaning
- duplicate doctrine kept for posterity
- doctrine cleanup that spills into old worktrees, attached checkouts, or
  archaeology
