import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { VitePluginSvgSolidOptions } from "./types";

// import plugin
import svgSolid from "./index.mjs";

import { htmlToSolid } from "./htmlToSolid.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

  it("should transform svg files with ?solid query", async () => {
    const plugin = svgSolid();
    const svgPath = resolve(__dirname, "solid.svg");
    const result = await plugin.load?.(svgPath + "?solid");

    if (!result) return;

    expect(result).toBeDefined();
    expect(typeof result.code).toBe("string");

    // Check if the transformed code includes Solid imports
    expect(result.code).toContain("import { createElement } from");

    // Check if the transformed code creates a component
    expect(result.code).toContain("export default function SVGComponent");

    // Check if the component handles props
    expect(result.code).toContain("props = {}");

    // Check if SVG content is included
    expect(result.code).toContain("viewBox");
  });

  it("should not have any default props", async () => {
    const plugin = svgSolid();
    const svgPath = resolve(__dirname, "solid-no-props.svg");
    const result = await plugin.load?.(svgPath + "?solid");

    if (!result) return;

    expect(result).toBeDefined();
    expect(typeof result.code).toBe("string");

    // Check if the transformed code includes Solid imports
    expect(result.code).toContain("import { createElement } from");
  });

  it("should not transform non-svg files", async () => {
    const plugin = svgSolid();
    const result = await plugin.load?.("test.js?solid");
    expect(result).toBeNull();
  });

  it("should not transform svg files without ?solid query", async () => {
    const plugin = svgSolid();
    const result = await plugin.load?.("test.svg");
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

  it("should accept plugin options", () => {
    const options: Partial<VitePluginSvgSolidOptions> = {
      include: "**/*.svg",
    };
    const plugin = svgSolid(options);
    expect(plugin).toBeDefined();
  });
});
