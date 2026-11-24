import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTIONS } from "@/lib/gt-actions";
import { useApp } from "./app-ctx";

export function Panel({ className, children, accent }: { className?: string; children: ReactNode; accent?: "ok" | "warn" | "crit" | "gold" | undefined }) {
  const bar = accent ? { ok: "border-l-ok", warn: "border-l-warn", crit: "border-l-crit", gold: "border-l-gold" }[accent] : "";
  return <div className={cn("rounded-2xl border bg-card p-5", accent && "border-l-4", bar, className)}>{children}</div>;
}

export function Kpi({ label, value, unit, sub, tone }: { label: string; value: ReactNode; unit?: string; sub?: ReactNode; tone?: "ok" | "warn" | "crit" | "gold" }) {
  const c = tone ? { ok: "text-ok", warn: "text-warn", crit: "text-crit", gold: "text-gold" }[tone] : "text-foreground";
  return (
    <Panel>
      <div className="eyebrow">{label}</div>
      <div className={cn("kpi mt-3 text-5xl", c)}>{value}{unit && <span className="ml-1 text-3xl">{unit}</span>}</div>
      {sub && <div className="mt-2 text-sm text-muted-foreground">{sub}</div>}
    </Panel>
  );
}

export type Tone = "ok" | "warn" | "crit" | "neutral" | "gold";
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  const cls = {
    ok: "bg-ok/12 text-ok", warn: "bg-warn/12 text-warn", crit: "bg-crit/12 text-crit",
    neutral: "bg-muted text-muted-foreground", gold: "bg-gold/15 text-accent-foreground",
  }[tone];
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold", cls)}>{children}</span>;
}
export const statutTone = (s: string): Tone => (s === "Critique" ? "crit" : s === "À surveiller" ? "warn" : "ok");

export function FicheBtn({ id, label = "Fiche action", className }: { id: string; label?: string; className?: string }) {
  const { openFiche } = useApp();
  if (!ACTIONS.find((a) => a.id === id)) return null;
  return (
    <button onClick={() => openFiche(id)} className={cn("no-print inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-accent-foreground hover:bg-gold/20", className)}>
      <Info className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return <div className="mb-3 mt-8 flex items-center gap-3"><h3 className="eyebrow">{children}</h3><div className="h-px flex-1 bg-border" />{right}</div>;
}

export function PageHead({ title, sub, fiche, right }: { title: string; sub?: string; fiche?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{right}{fiche && <FicheBtn id={fiche} />}</div>
    </div>
  );
}

export function GoldBtn({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={cn("inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-ink hover:bg-gold-warm disabled:opacity-50", className)} />;
}
export function DarkBtn({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={cn("inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50", className)} />;
}
export function GhostBtn({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={cn("inline-flex items-center justify-center gap-1.5 rounded-xl border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-50", className)} />;
}

export function Bar({ pct, tone = "ok" }: { pct: number; tone?: Tone }) {
  const c = { ok: "bg-ok", warn: "bg-warn", crit: "bg-crit", neutral: "bg-muted-foreground", gold: "bg-gold" }[tone];
  return <div className="h-2 w-full overflow-hidden rounded-full bg-border"><div className={cn("h-full rounded-full", c)} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>;
}
