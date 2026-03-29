/// <reference path="global.d.ts" />

import type {
  ChildLike,
  DOMNode,
  NodeLike,
  ParseResult,
  RootNode,
} from "@thednp/domparser";

import type { FilterPattern } from "@rollup/pluginutils";
import type { Plugin, ResolvedConfig, OxcOptions } from "vite";

export type VitePluginSvgSolidOptions = {
  oxcOptions?: OxcOptions;
  /** @deprecated */
  esbuildOptions?: EsbuildTransformOptions;
  exclude?: FilterPattern;
  include?: FilterPattern;
};

export declare const VitePluginSolidSVG: (
  config?: VitePluginSvgSolidOptions,
) => Plugin<VitePluginSvgSolidOptions>;
export default VitePluginSolidSVG;

export type SolidCode = {
  code: string;
  attributes?: Record<string, string | Record<string, string>>;
};

type ChildEl = ChildLike & Omit<NodeLike, "attributes"> & {
  attributes: Record<string, string>;
} & {
  children: ChildLike[];
};

/**
 * Converts a `ChildLike` to a Solid code string
 * @param input
 * @param depth
 */
export const DomToSolid: (input: ChildEl, depth?: number) => string;

/**
 * Converts HTML to Solid code.
 */
export const htmlToSolid: (
  input?: string,
) => SolidCode;

/** Converts HTML to DOMLike */
export const htmlToDOM: (
  input?: string,
  options?: Partial<ParserOptions>,
) => ParseResult["root"];

/**
 * Returns a quoted string if the key is a valid identifier,
 * otherwise returns the original key.
 */
export const quoteText: (key: string) => string;
