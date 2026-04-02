import { performance } from "node:perf_hooks";

import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget, createTargetAdapter } from "../../src/index.js";
import lessonsSetup from "../../setups/lessons/index.ts";
import demoMinimalSeed from "../fixtures/source/demo-minimal.js";

function compileDemo() {
  return compileSetup(
    demoMinimalSeed,
    createTargetAdapter({
      name: "test",
      repoRoot: "/repo",
      outputRoot: "out"
    })
  );
}

function compileLessonsFull() {
  return compileSetup(
    lessonsSetup,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "paperclip_agents"
    })
  );
}

describe("performance guardrails", () => {
  it("compiles demo_minimal fast enough for interactive use", () => {
    const start = performance.now();
    const result = compileDemo();
    const durationMs = performance.now() - start;

    expect(result.success).toBe(true);
    expect(durationMs).toBeLessThan(250);
  });

  it("compiles lessons_full fast enough for practical iteration", () => {
    const start = performance.now();
    const result = compileLessonsFull();
    const durationMs = performance.now() - start;

    expect(result.success).toBe(true);
    expect(durationMs).toBeLessThan(500);
  });

  it("keeps heap growth bounded across repeated lessons_full compiles", () => {
    const before = process.memoryUsage().heapUsed;
    for (let index = 0; index < 25; index += 1) {
      const result = compileLessonsFull();
      expect(result.success).toBe(true);
    }
    const after = process.memoryUsage().heapUsed;
    const deltaMb = (after - before) / (1024 * 1024);

    expect(deltaMb).toBeLessThan(64);
  });
});
