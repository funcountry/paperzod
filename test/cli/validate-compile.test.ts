import { writeFile } from "node:fs/promises";
import path from "node:path";

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
          "  root: ['validateSetup','compileSetup'].every((key) => typeof root[key] === 'function'),",
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
