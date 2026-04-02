import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

import { runNodeScript, runProcess } from "../helpers/cli.js";
import { withTempDir } from "../helpers/fs.js";

const repoRoot = path.resolve(import.meta.dirname, "../..");

function npmCommand(): string {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function fixtureModuleSource(setupLiteral: string): string {
  return `export default ${setupLiteral};\n`;
}

function tsFixtureModuleSource(setupLiteral: string): string {
  return `const setup = ${setupLiteral} as const;\nexport default setup;\n`;
}

function helperTsFixtureModuleSource(importSpecifier: string): string {
  return [
    `import { composeSetup, defineRoleHomeTemplate, loadFragments } from ${JSON.stringify(importSpecifier)};`,
    "",
    "const roleHome = defineRoleHomeTemplate({",
    '  id: "role_home",',
    "  sections: [",
    '    { key: "readFirst", title: "Read First" },',
    '    { key: "roleContract", title: "Role Contract", stableSlug: "role-contract" }',
    "  ] as const",
    "});",
    "",
    'const fragments = loadFragments(new URL("./fragments/", import.meta.url), {',
    '  readFirst: "read_first.md"',
    "});",
    "",
    "export default composeSetup(",
    "  {",
    '    id: "cli_helper_ts",',
    '    name: "CLI Helper TS",',
    "    roles: [{ id: \"writer\", name: \"Writer\", purpose: \"Write the draft.\" }]",
    "  },",
    "  roleHome.document({",
    '    surfaceId: "writer_home",',
    '    runtimePath: "generated/writer/AGENTS.md",',
    '    roleId: "writer",',
    "    sections: {",
    "      readFirst: { body: fragments.readFirst }",
    "    }",
    "  })",
    ");",
    ""
  ].join("\n");
}

function ownedCompileFixtureModuleSource(importSpecifier: string): string {
  return [
    `import { defineSetupModule } from ${JSON.stringify(importSpecifier)};`,
    "",
    "export default defineSetupModule({",
    "  setup: {",
    '    id: "cli_owned_output",',
    '    name: "CLI Owned Output",',
    '    surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],',
    '    generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["surface_1"] }]',
    "  },",
    '  outputOwnership: [{ kind: "root", path: "generated" }]',
    "});",
    ""
  ].join("\n");
}

beforeAll(async () => {
  const build = await runProcess(npmCommand(), ["run", "build"], repoRoot);
  expect(build.code).toBe(0);
});

describe("cli validate and compile", () => {
  it("supports package self-imports and subpath exports after build", async () => {
    const result = await runNodeScript(
      [
        "--input-type=module",
        "-e",
        [
          "const root = await import('paperzod');",
          "const core = await import('paperzod/core');",
          "const markdown = await import('paperzod/markdown');",
          "const testing = await import('paperzod/testing');",
          "console.log(JSON.stringify({",
          "  root: ['validateSetup','compileSetup','composeSetup','loadFragments','defineRoleHomeTemplate','defineGateTemplate','defineSetupModule'].every((key) => typeof root[key] === 'function'),",
          "  core: typeof core.createDiagnostic === 'function',",
          "  markdown: typeof markdown.renderDocuments === 'function',",
          "  testing: typeof testing.stableJson === 'function'",
          "}));"
        ].join(" ")
      ],
      repoRoot
    );

    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout.trim())).toEqual({
      root: true,
      core: true,
      markdown: true,
      testing: true
    });
  });

  it("validates a good setup and exits zero", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "valid-setup.mjs");
      await writeFile(
        fixturePath,
        fixtureModuleSource(`{
          id: "cli_valid",
          name: "CLI Valid",
          surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
          generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["surface_1"] }]
        }`),
        "utf8"
      );

      const result = await runNodeScript(["dist/cli/index.js", "validate", fixturePath], repoRoot);
      expect(result.code).toBe(0);
      expect(result.stdout).toContain("VALID cli_valid");
    });
  });

  it("validates a good TypeScript setup and exits zero", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "valid-setup.ts");
      await writeFile(
        fixturePath,
        tsFixtureModuleSource(`{
          id: "cli_valid_ts",
          name: "CLI Valid TS",
          surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
          generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["surface_1"] }]
        }`),
        "utf8"
      );

      const result = await runNodeScript(["dist/cli/index.js", "validate", fixturePath], repoRoot);
      expect(result.code).toBe(0);
      expect(result.stdout).toContain("VALID cli_valid_ts");
    });
  });

  it("validates a helper-backed TypeScript setup with fragment loading and exits zero", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "helper-setup.ts");
      const fragmentsDir = path.join(dir, "fragments");
      const importSpecifier = pathToFileURL(path.join(repoRoot, "dist/index.js")).href;
      await mkdir(fragmentsDir, { recursive: true });
      await writeFile(path.join(fragmentsDir, "read_first.md"), "Read the shared workflow first.\n", "utf8");
      await writeFile(fixturePath, helperTsFixtureModuleSource(importSpecifier), "utf8");

      const result = await runNodeScript(["dist/cli/index.js", "validate", fixturePath], repoRoot);
      expect(result.code).toBe(0);
      expect(result.stdout).toContain("VALID cli_helper_ts");
    });
  });

  it("reports validation failures and exits nonzero", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "invalid-setup.mjs");
      await writeFile(
        fixturePath,
        fixtureModuleSource(`{
          id: "cli_invalid",
          name: "CLI Invalid",
          workflowSteps: [{
            id: "step_1",
            roleId: "missing_role",
            purpose: "Emit output.",
            requiredInputIds: ["missing_input"],
            requiredOutputIds: ["missing_output"],
            stopLine: "Stop here."
          }]
        }`),
        "utf8"
      );

      const result = await runNodeScript(["dist/cli/index.js", "validate", fixturePath], repoRoot);
      expect(result.code).toBe(1);
      expect(result.stderr).toContain("check.workflow.missing_role");
      expect(result.stderr).toContain("check.workflow.missing_route");
    });
  });

  it("runs setup-local checks through validate and compile", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "local-check-setup.mjs");
      const importSpecifier = pathToFileURL(path.join(repoRoot, "dist/index.js")).href;
      await writeFile(
        fixturePath,
        [
          `import { defineSetupModule } from ${JSON.stringify(importSpecifier)};`,
          "",
          "export default defineSetupModule({",
          "  setup: {",
          '    id: "cli_local_check",',
          '    name: "CLI Local Check"',
          "  },",
          "  checks: [",
          "    {",
          '      id: "cli_local_rule",',
          "      run: () => [{",
          '        code: "check.local.cli_rule",',
          '        severity: "error",',
          '        phase: "check",',
          '        message: "CLI local rule fired."',
          "      }]",
          "    }",
          "  ]",
          "});",
          ""
        ].join("\n"),
        "utf8"
      );

      const validateResult = await runNodeScript(["dist/cli/index.js", "validate", fixturePath], repoRoot);
      expect(validateResult.code).toBe(1);
      expect(validateResult.stderr).toContain("check.local.cli_rule");

      const compileResult = await runNodeScript(
        ["dist/cli/index.js", "compile", fixturePath, "--repo-root", dir, "--output-root", "out"],
        repoRoot
      );
      expect(compileResult.code).toBe(1);
      expect(compileResult.stderr).toContain("check.local.cli_rule");
    });
  });

  it("compiles in dry-run mode and reports file actions", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "compile-setup.mjs");
      await writeFile(
        fixturePath,
        fixtureModuleSource(`{
          id: "cli_compile",
          name: "CLI Compile",
          surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "generated/WORKFLOW.md" }],
          generatedTargets: [{ id: "target_1", path: "generated/WORKFLOW.md", sourceIds: ["surface_1"] }]
        }`),
        "utf8"
      );

      const result = await runNodeScript(
        ["dist/cli/index.js", "compile", fixturePath, "--repo-root", dir, "--output-root", "out"],
        repoRoot
      );

      expect(result.code).toBe(0);
      expect(result.stdout).toContain("COMPILED cli_compile");
      expect(result.stdout).toContain("dry-run");
      expect(result.stdout).toContain("create");
    });
  });

  it("previews deletes in dry-run and requires --prune before write mode applies them", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "owned-compile-setup.mjs");
      const importSpecifier = pathToFileURL(path.join(repoRoot, "dist/index.js")).href;
      const stalePath = path.join(dir, "out", "generated", "STALE.md");
      const generatedPath = path.join(dir, "out", "generated", "WORKFLOW.md");
      await writeFile(fixturePath, ownedCompileFixtureModuleSource(importSpecifier), "utf8");
      await mkdir(path.dirname(stalePath), { recursive: true });
      await writeFile(stalePath, "# stale\n", "utf8");

      const dryRun = await runNodeScript(
        ["dist/cli/index.js", "compile", fixturePath, "--repo-root", dir, "--output-root", "out"],
        repoRoot
      );
      expect(dryRun.code).toBe(0);
      expect(dryRun.stdout).toContain(`create surface_1 ${generatedPath}`);
      expect(dryRun.stdout).toContain(`delete ${stalePath}`);

      const blockedWrite = await runNodeScript(
        ["dist/cli/index.js", "compile", fixturePath, "--repo-root", dir, "--output-root", "out", "--write"],
        repoRoot
      );
      expect(blockedWrite.code).toBe(1);
      expect(blockedWrite.stderr).toContain("emit.prune_required");
      await expect(readFile(generatedPath, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
      expect(await readFile(stalePath, "utf8")).toBe("# stale\n");

      const prunedWrite = await runNodeScript(
        ["dist/cli/index.js", "compile", fixturePath, "--repo-root", dir, "--output-root", "out", "--write", "--prune"],
        repoRoot
      );
      expect(prunedWrite.code).toBe(0);
      expect(prunedWrite.stdout).toContain(`create surface_1 ${generatedPath}`);
      expect(prunedWrite.stdout).toContain(`delete ${stalePath}`);
      expect((await readFile(generatedPath, "utf8")).length).toBeGreaterThan(0);
      await expect(readFile(stalePath, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
    });
  });

  it("validates the canonical release_ops setup from setups/**", async () => {
    const result = await runNodeScript(["dist/cli/index.js", "validate", "setups/release_ops/index.ts"], repoRoot);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain("VALID release_ops");
  });

  it("reports compile failures and exits nonzero", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "compile-invalid.mjs");
      await writeFile(
        fixturePath,
        fixtureModuleSource(`{
          id: "cli_compile_invalid",
          name: "CLI Compile Invalid",
          surfaces: [{ id: "surface_1", surfaceClass: "workflow_owner", runtimePath: "../outside/WORKFLOW.md" }],
          generatedTargets: [{ id: "target_1", path: "../outside/WORKFLOW.md", sourceIds: ["surface_1"] }]
        }`),
        "utf8"
      );

      const result = await runNodeScript(
        ["dist/cli/index.js", "compile", fixturePath, "--repo-root", dir, "--output-root", "out"],
        repoRoot
      );

      expect(result.code).toBe(1);
      expect(result.stderr).toContain("plan.target_path_out_of_scope");
    });
  });
});
