import { Countdown } from "@/components/countdown";

/* The "Now" section as a small player-stats HUD: four status cards, each with its own
   live readout (reading progress, a release countdown, this week's training days, a
   terminal cursor). Update the copy and numbers here as things change. */

const READING_PROGRESS = 40; // percent through the current book
const TRAINING_DAYS = [true, true, true, false, true, true, false]; // Mon to Sun
const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const GTA6_RELEASE = "2026-11-19T00:00:00-05:00"; // Rockstar's announced launch date

function Card({
  label,
  value,
  note,
  icon,
  children,
}: {
  label: string;
  value: string;
  note: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#ECECED] bg-white p-5">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C026D3]">{label}</p>
      <p className="mt-2 flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em] text-[#111827]">
        {icon}
        {value}
      </p>
      <p className="mt-0.5 text-[14px] text-[#6B7280]">{note}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function NowHud() {
  const trained = TRAINING_DAYS.filter(Boolean).length;
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card label="Now reading" value="Psycho-Cybernetics" note="Maxwell Maltz, on rewiring your self-image.">
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F3F4F6]">
              <div
                className="now-fill h-full rounded-full bg-gradient-to-r from-[#F4ADFF] to-[#EA00FF]"
                style={{ width: `${READING_PROGRESS}%` }}
              />
            </div>
            <span className="tabular font-mono text-[12px] text-[#6B7280]">{READING_PROGRESS}%</span>
          </div>
        </Card>

        <Card label="Waiting for" value="GTA VI" note="Launching November 19, 2026. Calendar already cleared.">
          <Countdown to={GTA6_RELEASE} />
        </Card>

        <Card label="Training" value={`${trained}× this week`} note="Lifting is the one meeting I never skip.">
          <ul className="flex gap-1.5" aria-label={`Trained ${trained} of 7 days this week`}>
            {TRAINING_DAYS.map((done, i) => (
              <li
                key={i}
                className={`flex h-7 w-7 items-center justify-center rounded-md font-mono text-[11px] ${
                  done ? "now-day bg-gradient-to-b from-[#F4ADFF] to-[#EA00FF] text-white" : "border border-[#ECECED] text-[#9CA3AF]"
                }`}
                style={done ? { animationDelay: `${i * 0.12}s` } : undefined}
              >
                {DAY_LETTERS[i]}
              </li>
            ))}
          </ul>
        </Card>

        <Card
          label="Default mode"
          value="Clauding"
          icon={
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/claudecode 1.svg" alt="Claude" className="now-claude h-6 w-6" />
          }
          note="Building side by side with Claude Code, most hours of the day."
        >
          <p className="rounded-md bg-[#111827] px-3 py-2 font-mono text-[12px] text-[#E5E7EB]">
            <span className="text-[#F0ABFC]">$</span> claude <span className="text-[#9CA3AF]">&quot;ship it&quot;</span>
            <span className="now-cursor ml-1 inline-block h-[13px] w-[7px] translate-y-[2px] bg-[#F0ABFC]" aria-hidden="true" />
          </p>
        </Card>
      </div>
    </div>
  );
}
