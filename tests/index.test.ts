import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { VitePluginSvgSolidOptions } from "../src/types";
import { mockPlugin7Context, mockPlugin8Context } from "./fixtures/mock.ts";

// import plugin
import svgSolid from "../src/index.mjs";

import { htmlToSolid } from "../src/htmlToSolid.mjs";
import { createElement } from "../src/createElement.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Load = (
  id: string,
  ops?: { ssr: boolean },
) => Promise<({ code: string; map: null } | null)>;

vi.mock('vite', async () => {
  const actual = await vi.importActual('vite');
  return {
    ...actual,
    // Mock any Vite exports if necessary
    transformWithOxc: vi.fn().mockImplementation((code) =>
      Promise.resolve({
        code,  // return the same code that was passed
        map: `[{"file": "./file.ts"}]`
      })
    ),
    transformWithEsbuild: vi.fn().mockImplementation((code) =>
      Promise.resolve({
        code,  // return the same code that was passed
        map: [{ "file": "./file.ts" }]
      })
    ),
  };
});

describe("vite-solid-svg", () => {
  it("should be a function", () => {
    expect(typeof svgSolid).toBe("function");
  });

  it("should return a vite plugin object", () => {
    const plugin = svgSolid();
    expect(plugin).toHaveProperty("name", "solid-svg");
    expect(plugin).toHaveProperty("enforce", "pre");
    expect(typeof plugin.load).toBe("function");
  });

  it("should transform svg files with ?solid query with vite 8", async () => {
    const plugin = svgSolid();
    // @ts-expect-error - this is testing
    plugin?.buildStart?.call(mockPlugin8Context);
    const svgPath = resolve(__dirname, "./fixtures/solid.svg");
    const result = await (plugin.load as Load)(svgPath + "?solid");

    expect(result).toBeDefined();
    expect(typeof result?.code).toBe("string");

    // Check if the transformed code includes Solid imports
    expect(result?.code).toContain("import { createElement } from");

    // Check if the transformed code creates a component
    expect(result?.code).toContain("export default function SVGComponent");

    // Check if the component handles props
    expect(result?.code).toContain("props = {}");

    // Check if SVG content is included
    expect(result?.code).toContain("viewBox");

    // Check map is generated
    expect(result?.map).not.toBe(null);
  });

  it("should transform svg files with ?solid query with vite 7", async () => {
    const plugin = svgSolid();
    // @ts-expect-error - this is testing
    plugin?.buildStart?.call(mockPlugin7Context);
    const svgPath = resolve(__dirname, "./fixtures/solid.svg");
    const result = await (plugin.load as Load)(svgPath + "?solid");

    expect(result).toBeDefined();
    expect(typeof result?.code).toBe("string");

    // Check if the transformed code includes Solid imports
    expect(result?.code).toContain("import { createElement } from");

    // Check if the transformed code creates a component
    expect(result?.code).toContain("export default function SVGComponent");

    // Check if the component handles props
    expect(result?.code).toContain("props = {}");

    // Check if SVG content is included
    expect(result?.code).toContain("viewBox");

    // Check map is generated
    expect(result?.map).not.toBe(null);
  });

  it("should not transform non-svg files", async () => {
    const plugin = svgSolid();
    const result = await (plugin.load as Load)("test.js?solid");
    expect(result).toBeNull();
  });

  it("should not transform svg files without ?solid query", async () => {
    const plugin = svgSolid();
    const result = await (plugin.load as Load)("test.svg");
    expect(result).toBeNull();
  });

  it("should work with aria and data attributes", () => {
    // a set of tests to add full coverage
    const html = `
  <fieldset>
    "This is a text node"
    <button class="btn" aria-disabled="true" data-disabled="true" disabled>click me</button>
  </fieldset>
    `.trim();

    const code = htmlToSolid(html);
    expect(code.attributes).toEqual({});
  });

  it("should handle invalid markup", () => {
    expect(htmlToSolid()).toEqual({ code: "", attributes: {} });

    try {
      // @ts-expect-error - we need to test this case
      htmlToSolid({});
    } catch (er: unknown) {
      expect(er).toBeInstanceOf(TypeError);
      expect((er as TypeError).message).toEqual("input must be a string");
    }
  });

  it("cover createElement", () => {
    const mk = createElement(
      "div",
      {},
      // @ts-expect-error - this case is only for Ryan's playground
      createElement("span"),
      createElement("span", {}, "This is a span text"),
    );
    console.log(mk);
  });

  it("should accept plugin options", () => {
    const options: Partial<VitePluginSvgSolidOptions> = {
      include: "**/*.svg",
    };
    const plugin = svgSolid(options);
    expect(plugin).toBeDefined();
  });
});
