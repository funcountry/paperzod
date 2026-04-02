# Lessons GitHub Access Protocol

This file is the shared GitHub access guide for the Lessons project.

This file owns only:

- GitHub auth posture
- the local Lessons GitHub helpers
- remote verification mechanics
- PR-body update helper mechanics

It does not own:

- PR lifecycle or followthrough law
- work product requirements
- the decision that a PR must exist or be refreshed
- the decision that a PR body needs current lesson QR blocks

Those workflow rules are owned by:

- `paperclip_home/project_homes/lessons/shared/proof_packets/LESSONS_PUBLISH_AND_FOLLOWTHROUGH_WORKFLOW.md`

## Rule

For lessons work, the only allowed GitHub access paths are:

These helpers are repo-owned. They do not live in the attached checkout.
In command examples below, replace `<paperclip_agents_root>` with the repo root
that contains this doctrine file.

1. `paperclip_home/project_homes/lessons/tools/lessons-gh`
2. `paperclip_home/project_homes/lessons/tools/lessons-git`
3. `paperclip_home/project_homes/lessons/tools/verify_lessons_github_access.sh`
4. `paperclip_home/project_homes/lessons/tools/update_pr_with_lessons_qrs.sh`
5. the ignored local env file `paperclip_home/project_homes/lessons/tools/lessons_github_app.env`

Anything else requires explicit approval in the current thread or a real
governance source.

Do not depend on:

- `$HOME/workspace/agents`
- sibling repos or old workspace trees
- `$HOME/.config/gh/hosts.yml`
- `gh auth login`
- `gh auth switch`
- plain `gh auth status` as a truth check
- ad hoc credential helpers that change global auth state on this machine

## Allowed execution boundary

Lessons agents may depend on only these filesystem locations by default:

1. `paperclip_home/project_homes/lessons/**`
2. the active lessons repo checkout attached to the Paperclip lessons project

Anything outside those two locations is out of bounds unless the current thread
or a real governance source explicitly authorizes it.

## Attached checkout relationship

The lessons GitHub auth path is separate from the attached lessons checkout.

Use the attached checkout for local repo work.
Use the wrappers in this folder for GitHub API calls and any `git` command that
talks to `github.com`.

The GitHub protocol in this folder exists for:

- `gh` API calls
- `git` commands that talk to `github.com`
- remote probes and verification
- future operator workflows that need a local to the repo GitHub auth path

Use plain local `git` only for local-only work inside the attached checkout.

## Local secret file

The local env file is:

- `paperclip_home/project_homes/lessons/tools/lessons_github_app.env`

Expected keys:

- `GH_APP_LESSONS_APP_ID`
- `GH_APP_LESSONS_PRIVATE_KEY_B64`
- optional `LESSONS_GITHUB_REPO`

This file is ignored by git and must stay local.

## Required commands

### `gh`

```bash
bash "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/lessons-gh" pr list -R funcountry/psmobile
```

### `git` against GitHub

```bash
bash "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/lessons-git" \
  ls-remote https://github.com/funcountry/psmobile.git HEAD
```

### verification

```bash
bash "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/verify_lessons_github_access.sh"
```

That verification must prove:

- wrapped `gh api repos/<repo>` succeeds
- wrapped `gh pr list -R <repo>` succeeds
- wrapped `git ls-remote https://github.com/<repo>.git HEAD` succeeds

## PR Body Update Helper

```bash
bash "<paperclip_agents_root>/paperclip_home/project_homes/lessons/tools/update_pr_with_lessons_qrs.sh" \
  --pr <number> \
  --entry-file /absolute/path/to/pr_qr_block_lesson_a.md \
  --entry-file /absolute/path/to/pr_qr_block_lesson_b.md
```

The helper replaces the `LESSONS_PLAYTEST_QRS` marker section in the PR body,
or appends that section if it does not exist yet.

Use it when the shared git/PR workflow owner says the current PR body needs
fresh lesson QR blocks.

## Failure mode

If the local env file is missing or verification fails, stop and escalate.

Do not route around the failure by:

- falling back to `$HOME/workspace/agents`
- writing tokens into global `gh` state on this machine
- using a different local clone as implied truth
