/* Line-art marks for the Beyond Work stickers, in the same pink-gradient line style as the
   project glyphs, each with a small idle animation: controller buttons blinking, a
   dumbbell being lifted, a page turning, wheels spinning, steam rising from a pot. */
export type HobbyKind = "gaming" | "training" | "reading" | "riding" | "cooking";

export function HobbyGlyph({ kind, size = 48 }: { kind: HobbyKind; size?: number }) {
  const id = `hg-${kind}`;
  const stroke = `url(#${id})`;
  return (
    <svg width={size} height={size} viewBox="5 6 34 34" fill="none" aria-hidden="true" className={`hg hg-${kind}`}>
      <defs>
        <linearGradient id={id} x1="22" y1="0" x2="22" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4ADFF" />
          <stop offset="1" stopColor="#EA00FF" />
        </linearGradient>
      </defs>
      <g stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {kind === "gaming" && (
          <>
            <path d="M14 15h16a6 6 0 0 1 5.8 7.5l-1.6 6.2a3.5 3.5 0 0 1-6 1.5L26 28h-8l-2.2 2.2a3.5 3.5 0 0 1-6-1.5l-1.6-6.2A6 6 0 0 1 14 15z" />
            <path d="M15 20v5M12.5 22.5h5" />
            <circle className="hg-btn" cx="28" cy="21" r="1.3" fill="#EA00FF" stroke="none" />
            <circle className="hg-btn" cx="31" cy="24" r="1.3" fill="#EA00FF" stroke="none" />
          </>
        )}
        {kind === "training" && (
          <g className="hg-lift">
            <path d="M12 22h20" />
            <rect x="9" y="16" width="4" height="12" rx="1.5" />
            <rect x="31" y="16" width="4" height="12" rx="1.5" />
            <path d="M6.5 19v6M37.5 19v6" />
          </g>
        )}
        {kind === "reading" && (
          <>
            <path d="M22 14c-3-2-7-2.5-11-2v18c4-.5 8 0 11 2 3-2 7-2.5 11-2V12c-4-.5-8 0-11 2z" />
            <path d="M22 14v18" />
            <path className="hg-page" d="M22 14c2-1.5 5-2.2 8-2.2v18c-3 0-6 .7-8 2.2" />
          </>
        )}
        {kind === "riding" && (
          <>
            <g className="hg-wheel" style={{ transformOrigin: "12px 28px" }}>
              <circle cx="12" cy="28" r="5.5" />
              <path d="M12 22.5v11M6.5 28h11" strokeWidth="1.2" />
            </g>
            <g className="hg-wheel" style={{ transformOrigin: "32px 28px" }}>
              <circle cx="32" cy="28" r="5.5" />
              <path d="M32 22.5v11M26.5 28h11" strokeWidth="1.2" />
            </g>
            <path d="M12 28l6-9h8l6 9M18 19l-2-3h-3M26 19l2-4h3" />
          </>
        )}
        {kind === "cooking" && (
          <>
            <path d="M10 22h24v6a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6v-6z" />
            <path d="M7 22h30" />
            <path className="hg-steam" d="M17 18c-1.5-1.5 1.5-3 0-5" />
            <path className="hg-steam" d="M22 18c-1.5-1.5 1.5-3 0-5" />
            <path className="hg-steam" d="M27 18c-1.5-1.5 1.5-3 0-5" />
          </>
        )}
      </g>
    </svg>
  );
}
