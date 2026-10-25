import type { Element, ElementContent, Root, RootContent } from "hast";

/* Rehype plugin: wraps every "→" in post text in <span class="pink-arrow">, which globals.css
   draws as the site's pink arrow (same markup as components/viz/arrow.tsx). Code stays as typed. */
const ARROW = "→";

function arrowSpan(): Element {
  return { type: "element", tagName: "span", properties: { className: ["pink-arrow"] }, children: [{ type: "text", value: ARROW }] };
}

function splitText(value: string): ElementContent[] {
  return value.split(ARROW).flatMap((part, i) => {
    const nodes: ElementContent[] = i > 0 ? [arrowSpan()] : [];
    if (part) nodes.push({ type: "text", value: part });
    return nodes;
  });
}

function walk(node: Root | Element) {
  node.children = node.children.flatMap((child): RootContent[] => {
    if (child.type === "text" && child.value.includes(ARROW)) return splitText(child.value);
    if (child.type === "element" && child.tagName !== "code" && child.tagName !== "pre") walk(child);
    return [child];
  }) as typeof node.children;
}

export function rehypePinkArrows() {
  return (tree: Root) => walk(tree);
}
