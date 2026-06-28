"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle Matrix-style digital rain rendered on a full-viewport canvas behind
 * the page content. Falls top→bottom and is masked out by ~80% of the viewport
 * height, so it fades away before reaching the bottom.
 */
export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Honor reduced-motion: leave the canvas blank.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const FONT_SIZE = 14;
    const CHARS =
      "アカサタナハマヤラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const BRIGHT_CHANCE = 0.1; // low frequency of brighter, glowing streams

    let columns = 0;
    let drops: number[] = [];
    let bright: boolean[] = [];

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.max(1, Math.floor(canvas.width / FONT_SIZE));
      // Start each column at a random negative offset so they don't fall in sync.
      drops = Array.from({ length: columns }, () => Math.random() * -50);
      bright = Array.from({ length: columns }, () => Math.random() < BRIGHT_CHANCE);
    };
    setup();

    let raf = 0;
    let last = 0;
    const FRAME_MS = 55; // ~18fps — slow, calm rain

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < FRAME_MS) return;
      last = t;

      // Translucent black overlay creates the trailing fade behind each glyph.
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        if (bright[i]) {
          // A few streams glow a little brighter than the rest.
          ctx.shadowColor = "rgba(74, 222, 128, 1)";
          ctx.shadowBlur = 11;
          ctx.fillStyle = "rgba(160, 255, 195, 1)";
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(74, 222, 128, 0.85)";
        }
        ctx.fillText(char, x, y);

        // Reset the column once it's past the bottom (randomized so streams vary).
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          bright[i] = Math.random() < BRIGHT_CHANCE; // re-roll glow on reset
        }
        drops[i]++;
      }
      ctx.shadowBlur = 0; // reset so the trailing fillRect isn't blurred
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", setup);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        opacity: 0.22,
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
      }}
    />
  );
}
