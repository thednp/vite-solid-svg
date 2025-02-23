import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { transformWithEsbuild } from "vite";
import { createFilter } from "@rollup/pluginutils";
import { htmlToSolid } from "./htmlToSolid.mjs";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cwd = process.cwd();

/** @typedef {typeof import("./types").VitePluginSolidSVG} VitePluginSolidSVG */
/** @typedef {import("./types").VitePluginSvgSolidOptions} VitePluginSvgSolidOptions */

/**
 * Compiles SVGs to Solid component code
 * @param {string} svgCode
 * @returns {string} the compiled code
 */
function transformSvgToSolid(svgCode) {
  // Convert the SVG string directly to Solid code
  const solidCode = htmlToSolid(svgCode);

  // Wrap the converted code in a component
  const componentCode = `
import { createElement } from "@createElement";

export default function SVGComponent(props = {}) {
	return ${solidCode.code};
};
`.trim();

  return componentCode;
}

/** @type {VitePluginSolidSVG} */
export default function vitePluginSvgSolid(options = {}) {
  const {
    esbuildOptions,
    include = ["**/*.svg?solid"],
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  /** @type {VitePluginSvgSolidOptions} */
  let config;

  return {
    name: "solid-svg",
    enforce: "pre",
    // istanbul ignore next - impossible to test outside of vite runtime
    configResolved(cfg) {
      config = cfg;
    },
    // istanbul ignore next - impossible to test outside of vite runtime
    config() {
      return {
        resolve: {
          alias: {
            "@createElement": path.resolve(__dirname, "./createElement.mjs"),
          },
        },
      };
    },
    async load(id) {
      if (filter(id)) {
        const file = id.replace(postfixRE, "");
        // Resolve the file path
        /* istanbul ignore next @preserve - we cannot test this outside the vite runtime */
        const filePath =
          !file.startsWith(cwd) && file.startsWith("/") && config?.publicDir
            ? path.resolve(config.publicDir, file.slice(1))
            : file;
        // Read the SVG file
        const svgCode = await fs.promises.readFile(filePath, "utf8");

        // Transform SVG to Solid component
        const componentCode = transformSvgToSolid(svgCode);

        // Transform the component code using esbuild
        const result = await transformWithEsbuild(componentCode, id, {
          loader: "js",
          ...esbuildOptions,
        });

        return {
          code: result.code,
          map: null,
        };
      }
      return null;
    },
  };
}
