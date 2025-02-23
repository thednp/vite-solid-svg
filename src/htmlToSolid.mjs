import { Parser } from "@thednp/domparser/parser";

/** @typedef {typeof import("./types").DomToSolid} DomToSolid */
/** @typedef {typeof import("./types").htmlToDOM} htmlToDOM */
/** @typedef {import("@thednp/domparser").NodeLike} NodeLike */
/** @typedef {import("@thednp/domparser").ChildLike} ChildLike */
/** @typedef {import("@thednp/domparser").ParseResult} ParseResult */
/** @typedef {typeof import("./types").htmlToSolid} htmlToSolid */

/**
 * Returns a quoted string if the key is a valid identifier,
 * otherwise returns the original key.
 * @type {typeof import('./types').quoteText}
 */
export const quoteText = (key) =>
  /^[a-zA-Z_][a-zA-Z_0-9]+$/.test(key) ? key : `"${key}"`;

/**
 * Returns the Solid value enclosed in quotes or brackets depending on the value.
 * @param {string | number} val
 */
export const solidValue = (val) => {
  return `"${val}"`;
}

/**
 * Converts HTML to Solid code.
 * 
 * @type {htmlToDOM}
 */
const htmlToDOM = (input) => {
  if (!input) return { nodeName: '#document', children: [] };
  if (typeof input !== 'string') throw new TypeError('input must be a string');
  return Parser().parseFromString(input).root;
}

/**
 * Converts a `DOMNode` to a Solid code string
 * @type {DomToSolid} 
 */
const DomToSolid = (input, depth = 0) => {
  const { tagName, nodeName, attributes, children, nodeValue } = input;
  const isText = nodeName === '#text';
  const firstChildIsText = children?.[0]?.nodeName === '#text';
  const attributeEntries = Object.entries(attributes || {});
  const spaces = "  ".repeat(depth); // Calculate spaces based on depth
  let output = isText ? '' : (spaces + `createElement("${tagName}", `);

    const attributesHTML = (attributeEntries.length ?
      attributeEntries.map(([key, value]) =>
        `${quoteText(key)}: ${solidValue(value)}`
      ).join(', ')
      : "")
      // don't add props to children
      .concat(depth === 0 ? ", ...props" : "");
    output += !isText ? `{${attributesHTML}}` : "";
    output += !isText && children?.length ? ',' : '';

    if (children?.length) {
    const childrenHTML = children
      // Increase depth for children
      // @ts-expect-error
      .map(child => (firstChildIsText ? (attributeEntries.length ? " " : "") : ("\n" + "  ".repeat(depth + 1))) + DomToSolid(child, depth + 1))
      .join(',');
    output += `${childrenHTML}`;
  }
  if (nodeValue) {
    output += `"${nodeValue}"`;
  }
  // Adjust newline for closing bracket
  output += isText ? "" : (children?.length && !firstChildIsText ? ("\n" + "  ".repeat(depth + 1) + ')') : ')');

  return output;
}

/**
 * Converts HTML markup to Solid code.
 * 
 * @type {htmlToSolid}
 */
export const htmlToSolid = (input, options = {}) => {
  const { replacement } = options;
  const doc = htmlToDOM(input);
  if (!doc?.children.length) return { code: '', attributes: {} };
  const { tagName, nodeName, attributes, children } = doc.children[0];
  // @ts-expect-error
  const code = DomToSolid({ tagName, nodeName, attributes: replacement || attributes, children });

  return { code, attributes };
}
