import { writeFile } from "node:fs/promises";
import path from "node:path";

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
});
