# Lessons Project Home

This is the repo home for Lessons shared doctrine, Lessons-only helper
tools, and dated planning packets.

Use it in this order:

- `paperclip_home/project_homes/lessons/shared/` for live shared Lessons
  doctrine
- `paperclip_home/agents/<agent>/` for agent-specific guidance
- `paperclip_home/project_homes/lessons/tools/` for Lessons-only helpers that
  agents may run
- `paperclip_home/project_homes/lessons/plans/` for dated planning, research,
  and audit packets

Rules:

- `plans/` is not a live workflow owner
- this folder is not the live `psmobile` checkout
- work that changes repo files still runs through the Paperclip Lessons
  project workspace and its managed checkout/worktree flow
- nothing here may depend on sibling repos, `$HOME/workspace/...` paths, or
  machine-global auth state unless the current thread or a real governance
  surface explicitly authorizes it
