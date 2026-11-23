import type { ReactNode } from "react";
import { CalendarCheck, Sparkles, ShieldCheck } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const perks = [
  { icon: Sparkles, text: "Explore haircut, skincare, spa and more" },
  { icon: CalendarCheck, text: "Request appointments in a few clicks" },
  { icon: ShieldCheck, text: "Pay securely once your booking is confirmed" },
];

export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <section className="mx-auto flex max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="grid w-full overflow-hidden rounded-3xl border border-line bg-white shadow-sm lg:grid-cols-2">
        {/* decorative side panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 p-10 text-white lg:flex">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">SalonBook</p>
            <h2 className="mt-4 text-3xl font-semibold leading-snug">
              Your next look is just one booking away.
            </h2>
          </div>
          <ul className="space-y-4">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* form side */}
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
