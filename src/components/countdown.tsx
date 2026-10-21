"use client";

import { useEffect, useState } from "react";

/* Days, hours and minutes left until a date, ticking each minute. Computed in the browser
   so a statically built page never shows a stale count. */
export function Countdown({ to }: { to: string }) {
  const target = new Date(to).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0); // first read after mount, so server and client HTML match
    const id = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const left = now === null ? null : Math.max(0, target - now);
  const parts = [
    { unit: "days", value: left === null ? null : Math.floor(left / 86_400_000) },
    { unit: "hrs", value: left === null ? null : Math.floor(left / 3_600_000) % 24 },
    { unit: "min", value: left === null ? null : Math.floor(left / 60_000) % 60 },
  ];

  if (left === 0) {
    return <p className="font-mono text-[13px] font-semibold text-[#C026D3]">It&apos;s out. Do not disturb.</p>;
  }

  return (
    <div className="flex items-end gap-2">
      {parts.map((p) => (
        <div key={p.unit} className="text-center">
          <span className="tabular block min-w-[44px] rounded-md bg-gradient-to-b from-[#F4ADFF] to-[#EA00FF] px-2 py-1.5 font-mono text-[18px] font-semibold leading-none text-white">
            {p.value === null ? "--" : String(p.value).padStart(2, "0")}
          </span>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#9CA3AF]">{p.unit}</span>
        </div>
      ))}
    </div>
  );
}
