import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  points: string[];
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AuthShell({
  badge,
  title,
  description,
  points,
  children,
  footer,
  className,
}: AuthShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_right,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,var(--background),var(--background))] px-4 py-6 text-foreground sm:px-6 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
        <section className="grid w-full gap-6 overflow-hidden rounded-[2rem] border border-border bg-card/90 p-5 shadow-2xl shadow-black/10 backdrop-blur sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(160deg,rgba(15,23,42,0.95),rgba(12,18,30,0.9),rgba(30,41,59,0.98))] p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.25),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.18),transparent_30%)]" />
            <div className="relative space-y-5">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-sky-100/90">
                {badge}
              </div>
              <div className="space-y-3">
                <h1 className="max-w-md font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                  {description}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-200/90">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 rounded-full bg-sky-300" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[1.5rem] border border-border bg-background p-5 sm:p-6">
            {children}
            {footer ? <div className="mt-6">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
