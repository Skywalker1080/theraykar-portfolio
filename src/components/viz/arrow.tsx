import { Fragment, type ReactNode } from "react";

/* The site's arrow: a thin line-and-chevron in the pink gradient. The "→" character stays
   in the DOM (transparent, under a CSS mask) so copy-paste and screen readers still get it. */
export function PinkArrow() {
  return <span className="pink-arrow">→</span>;
}

/* Swaps every "→" in a plain string for a PinkArrow, for text passed to visualizations. */
export function withArrows(text: string): ReactNode {
  if (!text.includes("→")) return text;
  return text.split("→").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <PinkArrow />}
      {part}
    </Fragment>
  ));
}
