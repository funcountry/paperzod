import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

import { runNodeScript, runProcess } from "../helpers/cli.js";
import { withTempDir } from "../helpers/fs.js";

const repoRoot = path.resolve(import.meta.dirname, "../..");

function npmCommand(): string {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

beforeAll(async () => {
  const build = await runProcess(npmCommand(), ["run", "build"], repoRoot);
  expect(build.code).toBe(0);
});

describe("cli doctor", () => {
  it("renders actionable human-readable diagnostics", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "doctor-setup.mjs");
      await writeFile(
        fixturePath,
        `export default {
          id: "doctor_case",
          name: "Doctor Case",
          workflowSteps: [{
            id: "step_1",
            roleId: "missing_role",
            purpose: "Emit output.",
            requiredInputIds: ["missing_input"],
            requiredOutputIds: ["missing_output"],
            stopLine: "Stop here."
          }]
        };\n`,
        "utf8"
      );

      const result = await runNodeScript(["dist/cli/index.js", "doctor", fixturePath], repoRoot);
      expect(result.code).toBe(1);
      expect(result.stdout).toContain("Doctor report for doctor_case");
      expect(result.stdout).toContain("[check] check.workflow.missing_role");
      expect(result.stdout).toContain("Fix surface: source role and workflow declarations");
      expect(result.stdout).toContain("Node: step_1");
    });
  });

  it("runs setup-local checks through the same doctor pipeline", async () => {
    await withTempDir(async (dir) => {
      const fixturePath = path.join(dir, "doctor-setup-module.mjs");
      const importSpecifier = pathToFileURL(path.join(repoRoot, "dist/index.js")).href;
      await writeFile(
        fixturePath,
        [
          `import { defineSetupModule } from ${JSON.stringify(importSpecifier)};`,
          "",
          "export default defineSetupModule({",
          "  setup: {",
          '    id: "doctor_module_case",',
          '    name: "Doctor Module Case"',
          "  },",
          "  checks: [",
          "    {",
          '      id: "doctor_local_rule",',
          "      run: () => [{",
          '        code: "check.local.doctor_rule",',
          '        severity: "error",',
          '        phase: "check",',
          '        message: "Doctor local rule fired."',
          "      }]",
          "    }",
          "  ]",
          "});",
          ""
        ].join("\n"),
        "utf8"
      );

      const result = await runNodeScript(["dist/cli/index.js", "doctor", fixturePath], repoRoot);
      expect(result.code).toBe(1);
      expect(result.stdout).toContain("Doctor report for doctor_module_case");
      expect(result.stdout).toContain("[check] check.local.doctor_rule");
      expect(result.stdout).toContain("Fix surface: the relevant source declarations");
    });
  });
});
