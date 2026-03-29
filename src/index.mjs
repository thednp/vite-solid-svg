import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createFilter } from "@rollup/pluginutils";
import { htmlToSolid } from "./htmlToSolid.mjs";

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cwd = process.cwd();

/** @typedef {typeof import("./types").VitePluginSolidSVG} VitePluginSolidSVG */
/** @typedef {import("./types").VitePluginSvgSolidOptions} VitePluginSvgSolidOptions */
/** @typedef {import("vite").BuildAppHook} BuildAppHook */
/** @typedef {ThisParameterType<BuildAppHook>} PluginContext */

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
    oxcOptions,
    include = ["**/*.svg?solid"],
    exclude,
  } = options;
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  /** @type {VitePluginSvgSolidOptions} */
  let config;
  let isOxc = true;

  return {
    name: "solid-svg",
    enforce: "pre",
    buildStart() {
      const { viteVersion } = this.meta;
      isOxc = Number(viteVersion[0]) >= 8;
    },
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

        // Transform component to ESM
        const vite = await import("vite");

        const transformer = isOxc ? "transformWithOxc" : "transformWithEsbuild";
        const langProp = isOxc ? "lang" : "loader";
        // const mapProp = isOxc ? "source_map" : "sourcemap";
        const options = (isOxc ? oxcOptions : esbuildOptions) || {};

        // Transform the component code using esbuild/oxc
        const result = await vite[transformer](componentCode, id, {
          [langProp]: "js",
          sourcemap: true,
          ...options,
        });

        return {
          code: result.code,
          map: result.map
            ? (
              typeof result.map === "string"
                ? JSON.parse(result.map)
                : result.map
            )
            : /* istanbul ignore next @preserve */ null,
        };
      }
      return null;
    },
  };
}
