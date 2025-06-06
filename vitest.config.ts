import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text", "lcov"],
      enabled: true,
      include: [
        "src/index.mjs",
        "src/createElement.mjs",
        "src/htmlToSolid.mjs",
      ],
    },
  },
});
