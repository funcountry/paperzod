import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { compileSetup, createPaperclipMarkdownTarget } from "../../../src/index.js";
import lessonsFullSeed from "../../fixtures/source/lessons-full.js";

interface InventoryDocument {
  order: number;
  relativePath: string;
  surfaceClass: string;
}

interface InventoryFile {
  version: number;
  scope: {
    generated: string;
    excluded: string[];
  };
  documents: InventoryDocument[];
}

function readInventory(): InventoryFile {
  return JSON.parse(
    readFileSync(path.resolve("test/goldens/lessons-live/INVENTORY.json"), "utf8")
  ) as InventoryFile;
}

function compileLessonsFull() {
  return compileSetup(
    lessonsFullSeed,
    createPaperclipMarkdownTarget({
      repoRoot: "/repo",
      outputRoot: "paperclip_agents"
    })
  );
}

describe("Lessons manifest alignment with frozen inventory", () => {
  it("keeps the represented Lessons subset inside the frozen inventory with matching surface classes", () => {
    const inventory = readInventory();
    const byPath = new Map(inventory.documents.map((document) => [document.relativePath, document]));
    const result = compileLessonsFull();

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    const represented = result.data.plan.documents.map((document) => ({
      id: document.id,
      relativePath: document.path,
      surfaceClass: document.surfaceClass
    }));

    expect(represented.some((document) => document.surfaceClass === "project_home_root")).toBe(true);
    expect(represented.some((document) => document.relativePath === "paperclip_home/project_homes/lessons/README.md")).toBe(true);

    for (const document of represented) {
      const inventoryDocument = byPath.get(document.relativePath);
      expect(inventoryDocument, `Missing inventory entry for ${document.relativePath}`).toBeDefined();
      expect(document.surfaceClass).toBe(inventoryDocument?.surfaceClass);
    }
  });

  it("does not emit represented Lessons files into excluded inventory subtrees", () => {
    const inventory = readInventory();
    const result = compileLessonsFull();

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    const prefixes = inventory.scope.excluded.map((pattern) => pattern.replace("/**", "/"));
    for (const document of result.data.plan.documents) {
      expect(prefixes.some((prefix) => document.path.startsWith(prefix))).toBe(false);
    }
  });
});
