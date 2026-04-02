import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      paperzod: fileURLToPath(new URL("./src/index.ts", import.meta.url))
    }
  },
  test: {
    include: ["test/**/*.test.ts"],
    exclude: ["vendor/**"],
    environment: "node",
    coverage: {
      enabled: false
    }
  }
});
