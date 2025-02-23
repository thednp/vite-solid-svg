import { Dynamic, mergeProps } from "solid-js/web";

/** @typedef {import("solid-js").JSX} JSX */
/** @typedef {import("solid-js").ValidComponent} ValidComponent */

/**
 * 
 * @param {ValidComponent} tagName 
 * @param {Record<string, unknown>} props 
 * @param  {...JSX.Element[]} children 
 * @returns {JSX.Element}
 */
export function createElement(tagName, props, ...children) {
  const finalProps = mergeProps(
    (props || {}),
    // Only add children if they exist to avoid unnecessary empty arrays
    (children.length > 0 ? { children: children.length === 1 ? children[0] : children } : {})
  );

  return Dynamic({ component: tagName, ...finalProps });
}
