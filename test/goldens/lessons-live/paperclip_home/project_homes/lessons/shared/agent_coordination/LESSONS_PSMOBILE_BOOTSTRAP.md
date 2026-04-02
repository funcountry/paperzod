# Lessons PSMobile Bootstrap

This file owns attached `psmobile` startup and runtime handling.

Use it when the current Lessons job touches:

- attached checkout setup or a missing local checkout
- validator or TS script startup failures
- missing repo dependencies or toolchain prerequisites
- confusion between environment setup install and real repo setup
- runtime confirmation work that depends on the attached checkout being honest

## Core rule

Keep environment setup install separate from repo dependency setup.

- `psmobile-setup` is an environment setup installer only
- it does not install Node dependencies, toolchains, or repo runtime
  prerequisites
- the attached product repo owns the exact product bootstrap commands and the
  package-level dependency owner

## Where Attached-Checkout Startup Truth Comes From

For attached `psmobile` Lessons work, startup instructions come from the
current repo source of truth:

- `QUICKSTART.md`
- the relevant root `Makefile` target such as `make setup`
- additional local to the product repo bootstrap or runtime entrypoints only when the
  current issue actually needs them, such as:
  - `make flutter-setup`
  - `make flutter-dev`
- the direct dependency owner for the failing script or package:
  - package manifests
  - lockfiles
  - local to the repo script entrypoints

Do not substitute:

- ambient package state
- lead memory
- stale notes
- auth state stored globally on this machine
- `$HOME/workspace/...`
- another project as the normal overflow owner

Checkout-root `AGENTS.md` / `CLAUDE.md` may route you to those local to the product repo
bootstrap sources, but interpret them only through
`paperclip_home/agents/shared/ATTACHED_CHECKOUT_INSTRUCTION_ADMISSIBILITY_RULES.md`.
They do not decide commit timing, manual validation, or Paperclip issue/PR
advancement.

## Startup And Runtime Diagnosis Order

When a Lessons issue hits a validator, TS script, or bootstrap failure:

1. verify that the attached checkout exists and matches the current checkout
   details named on the active issue `plan`
2. reread the startup sources named above
3. verify the failing script's direct dependency owner at the package
   boundary before treating the failure as lesson content invalidity
4. distinguish content invalidity from bootstrap/runtime invalidity
5. stop and escalate instead of guessing from local residue

## Stop Rule

If the attached repo's startup instructions are missing, contradictory, or still not
enough to make the current runtime honest:

- block the issue
- name the exact missing bootstrap or runtime source
- do not quietly keep working from guessed local state
