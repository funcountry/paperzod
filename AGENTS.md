# AGENTS.md

## First Run

- `npm install`
- `npm run typecheck`
- `npm run test:types`
- `npm run build`
- Use `npx vitest run <path>` for the smallest honest test pass on the area you changed.
- Run `npm test` before claiming broad verification. If unrelated failures already exist, say that plainly and do not hide them with snapshot churn.

## Definition Of Done

- Run the smallest honest verification set for the files you changed.
- If you changed TypeScript in the compiler, graph, planner, target, or renderer layers, run `npm run typecheck`, `npm run build`, and the relevant `npx vitest run ...` suites.
- If you changed render output, fixtures, snapshots, or goldens, run the matching render or e2e tests and read the output diff before updating snapshots.
- If you replace a contract, path, fixture, doc, or helper surface, delete the superseded one in the same change unless the user explicitly asks to keep it.
- If you changed docs only, tests are optional. Say what you did and did not run.

## Red Lines

- Do not edit `vendor/zod/**` unless the task is explicitly about the vendored reference checkout.
- Keep `src/**` framework-only. Setup-local doctrine, authored setup prose, and proving-package specifics belong in `setups/**`, not in core compiler code.
- Do not special-purpose public docs, APIs, or examples to Lessons. Treat Lessons fixtures and goldens as one proving case for a generic compiler.
- Do not keep dead code, dead docs, dead fixtures, compatibility shims, or duplicate surfaces around for posterity, archaeology, or legacy comfort. Git is the history.
- Do not leave parallel old and new paths in the repo unless the user explicitly asks for a compatibility window.
- Obsolete files and compatibility scaffolding confuse agents because dead paths look live and start attracting edits, tests, and citations.
- Do not update snapshots or `test/goldens/lessons-live/**` just to force green tests. Read the rendered change first and explain why the output contract changed.
- Treat `docs/ref/**` as grounding input and reference material, not generated output.
- Do not claim the repo is green unless you actually ran the relevant commands.

## Blocked State

- Stop and ask when the right behavior depends on a product decision that is not settled in the repo yet.
- Stop and ask if a path might still be externally consumed and the repo does not answer that question. Otherwise, delete the superseded path instead of preserving it.
- If a change introduces or reshapes a public doctrine surface, read the docs map first and align code, tests, and docs in the same change.
- If the task is authoring or tightening repo instruction files, use `$agents-md-authoring`.

## Writing

- Write for a human reader first.
- Use plain English.
- Lead with the concrete thing: what changed, what to run, what happens next.
- Avoid house jargon, compressed labels, and schema-sounding prose.

## Docs Map

- `docs/ref/GENERIC_DOCTRINE_SYSTEM_PLAIN_EXAMPLE.md`: the smallest plain-English explanation of the product shape.
- `docs/requirements.md`: product contract and boundaries.
- `docs/schema.md`: source language and node model.
- `docs/architecture.md`: compiler layers and pipeline shape.
- `docs/testing.md`: proof standard and release gate.
- `docs/example_editorial.md`: the high-fidelity proving example and source-shape explanation.
- `docs/example_typed_runtime_law.md`: the typed refs, required sections, and structured-runtime-law proving example.

## Test Truth Surfaces

- `setups/**`: canonical repo-local proving setups when the task touches setup truth.
- `test/fixtures/source/**`: authored proving fixtures and synthetic mutation inputs.
- `test/goldens/lessons-live/**`: one frozen parity corpus for a proving case.
