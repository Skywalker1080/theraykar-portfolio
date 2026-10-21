/* Small looping animated mark for each kind of project, drawn in the site's pink gradient:
   Product: a chat UI with a typing reply. Agent: a question turning into filtered rows.
   ML: a forecast line drawing itself. Data: packets flowing into a database. */
export type GlyphKind = "Product" | "Agent" | "ML" | "Data";

export function ProjectGlyph({ kind, size = 44 }: { kind: GlyphKind; size?: number }) {
  const id = `pg-${kind.toLowerCase()}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="5 7 34 32"
      fill="none"
      aria-hidden="true"
      className={`glyph glyph-${kind.toLowerCase()} shrink-0`}
    >
      <defs>
        <linearGradient id={id} x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4ADFF" />
          <stop offset="1" stopColor="#EA00FF" />
        </linearGradient>
      </defs>
      {kind === "Product" && (
        <g stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round">
          <rect x="9" y="11" width="26" height="22" rx="4" />
          <line x1="9" y1="17" x2="35" y2="17" />
          <circle className="g-dot" cx="16" cy="25" r="1.6" fill={`url(#${id})`} stroke="none" />
          <circle className="g-dot" cx="22" cy="25" r="1.6" fill={`url(#${id})`} stroke="none" />
          <circle className="g-dot" cx="28" cy="25" r="1.6" fill={`url(#${id})`} stroke="none" />
        </g>
      )}
      {kind === "Agent" && (
        <g stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round">
          <path d="M9 12h11a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-6l-3 3v-3H9" />
          <line className="g-row" x1="24" y1="27" x2="35" y2="27" />
          <line className="g-row" x1="24" y1="31" x2="35" y2="31" />
          <line className="g-row" x1="24" y1="35" x2="35" y2="35" />
        </g>
      )}
      {kind === "ML" && (
        <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 34h26" stroke="#F5D0FE" />
          <path className="g-line" d="M9 30l6-6 5 3 6-9 9-5" stroke={`url(#${id})`} pathLength="1" />
          <circle className="g-tip" cx="35" cy="13" r="2.4" fill="#EA00FF" />
        </g>
      )}
      {kind === "Data" && (
        <g stroke={`url(#${id})`} strokeWidth="2" strokeLinecap="round">
          <line x1="7" y1="22" x2="22" y2="22" strokeDasharray="2 3" />
          <circle className="g-packet" cx="8" cy="22" r="2" fill="#EA00FF" stroke="none" />
          <ellipse cx="30" cy="14" rx="7" ry="3" />
          <path d="M23 14v16c0 1.7 3.1 3 7 3s7-1.3 7-3V14" />
          <path className="g-fill" d="M23 22c0 1.7 3.1 3 7 3s7-1.3 7-3" />
        </g>
      )}
    </svg>
  );
}
