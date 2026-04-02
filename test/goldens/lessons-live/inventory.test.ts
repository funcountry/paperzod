import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const inventoryPath = path.resolve("test/goldens/lessons-live/INVENTORY.json");

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
  return JSON.parse(readFileSync(inventoryPath, "utf8")) as InventoryFile;
}

describe("Lessons live golden inventory", () => {
  it("tracks the frozen in-scope runtime corpus", () => {
    const inventory = readInventory();

    expect(inventory.version).toBe(1);
    expect(inventory.scope.excluded).toEqual([
      "paperclip_home/project_homes/lessons/tools/**",
      "paperclip_home/project_homes/lessons/plans/**"
    ]);
    expect(inventory.documents).toHaveLength(38);
    expect(inventory.documents[0]).toEqual({
      order: 1,
      relativePath: "paperclip_home/agents/lessons_project_lead/AGENTS.md",
      surfaceClass: "role_home"
    });
    expect(inventory.documents.at(-1)).toEqual({
      order: 38,
      relativePath: "paperclip_home/project_homes/lessons/shared/agent_coordination/LESSONS_PSMOBILE_BOOTSTRAP.md",
      surfaceClass: "coordination"
    });
  });

  it("only references files that exist in the checked-in goldens", () => {
    const inventory = readInventory();

    for (const document of inventory.documents) {
      expect(existsSync(path.resolve("test/goldens/lessons-live", document.relativePath))).toBe(true);
    }
  });
});
