import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, X, BookOpen, PlayCircle } from "lucide-react";
import { GtProvider } from "@/lib/gt-store";
import { ROLES, type Role } from "@/lib/gt-data";
import { ACTIONS, ROLE_VIEWS, VIEW_LABELS, type ViewId } from "@/lib/gt-actions";
import { App, type Mode } from "@/components/gt/app-ctx";
import { DAccueil, DComparaison, DFiabilite, DMaintenance, DEquipe, DEnergie, DRapport } from "@/components/gt/directeur";
import { RDashboard, RSignalements, RCommandes, RReleves, RConfig } from "@/components/gt/responsable";
import { Panel } from "@/components/gt/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GenTrack — Guide interactif & Manuel opérationnel" },
      { name: "description", content: "Pilotage des équipements et de la maintenance hôtelière Madame T : écrans Directeur, Responsable et Technicien avec fiches action." },
      { property: "og:title", content: "GenTrack — Guide interactif & Manuel opérationnel" },
      { property: "og:description", content: "Pilotage équipements & maintenance hôtelière, fiches action opérationnelles." },
    ],
  }),
  component: Index,
});

const VIEWS: Record<ViewId, () => React.JSX.Element> = {
  "d-accueil": DAccueil, "d-comparaison": DComparaison, "d-fiabilite": DFiabilite, "d-maintenance": DMaintenance,
  "d-equipe": DEquipe, "d-energie": DEnergie, "d-rapport": DRapport,
  "r-dashboard": RDashboard, "r-signalements": RSignalements, "r-commandes": RCommandes, "r-releves": RReleves, "r-config": RConfig,
  "t-bot": TechBot,
};

function TechBot() {
  const list = ACTIONS.filter((a) => a.role === "technicien");
  return (
    <div>
      <h2 className="mb-2 text-2xl font-extrabold tracking-tight">Bot WhatsApp & formulaires</h2>
      <p className="mb-6 text-sm text-muted-foreground">Le simulateur WhatsApp arrive bientôt. Procédures du technicien :</p>
      <div className="grid gap-3 md:grid-cols-2">{list.map((a) => <FicheCard key={a.id} id={a.id} />)}</div>
    </div>
  );
}

function FicheCard({ id }: { id: string }) {
  const a = ACTIONS.find((x) => x.id === id);
  if (!a) return null;
  return (
    <Panel accent="gold">
      <h4 className="font-bold">{a.title}</h4>
      <dl className="mt-3 space-y-2 text-sm">
        <div><dt className="eyebrow">Qui</dt><dd>{a.who}</dd></div>
        <div><dt className="eyebrow">Quand</dt><dd>{a.when}</dd></div>
        <div><dt className="eyebrow">Procédure</dt><dd><ol className="ml-4 list-decimal space-y-1">{a.steps.map((s, i) => <li key={i}>{s}</li>)}</ol></dd></div>
        <div><dt className="eyebrow">Impact / résultat</dt><dd>{a.result}</dd></div>
        {a.tips.length > 0 && <div><dt className="eyebrow">Conseils & pièges</dt><dd><ul className="ml-4 list-disc">{a.tips.map((t, i) => <li key={i}>{t}</li>)}</ul></dd></div>}
      </dl>
    </Panel>
  );
}

function Index() {
  const [role, setRole] = useState<Role>("directeur");
  const [view, setView] = useState<ViewId>("d-accueil");
  const [mode, setMode] = useState<Mode>("guide");
  const [fiche, setFiche] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const go = (r: Role, v: ViewId) => { setRole(r); setView(v); };
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return ACTIONS.filter((a) => (a.title + " " + a.keywords).toLowerCase().includes(s)).slice(0, 6);
  }, [q]);
  const viewActions = ACTIONS.filter((a) => a.view === view);
  const View = VIEWS[view];

  return (
    <GtProvider>
      <App.Provider value={{ role, view, mode, go, setMode, openFiche: setFiche }}>
        <div className="flex min-h-screen flex-col md:flex-row">
          <aside className="no-print bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-y-auto">
            <div className="flex items-center gap-3 px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-lg font-black text-ink">G</div>
              <div><div className="text-lg font-extrabold tracking-tight">Gen<span className="text-gold">Track</span></div><div className="text-xs text-night-muted">Madame T Hotels</div></div>
            </div>
            <div className="px-3" data-tour="role-switch">
              <div className="eyebrow px-2 pb-2 text-night-muted">Profil</div>
              {ROLES.map((r) => (
                <button key={r.id} onClick={() => go(r.id, ROLE_VIEWS[r.id][0] ?? "d-accueil")}
                  className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${role === r.id ? "bg-sidebar-accent text-gold" : "hover:bg-sidebar-accent/60"}`}>
                  <div className="font-semibold">{r.label}</div><div className="text-xs text-night-muted">{r.scope}</div>
                </button>
              ))}
            </div>
            <nav className="mt-4 flex gap-1 overflow-x-auto px-3 pb-4 md:block">
              <div className="eyebrow hidden px-2 pb-2 text-night-muted md:block">Écrans</div>
              {ROLE_VIEWS[role].map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm md:mb-1 md:w-full ${view === v ? "bg-gold font-semibold text-ink" : "hover:bg-sidebar-accent/60"}`}>
                  {VIEW_LABELS[v]}
                </button>
              ))}
            </nav>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="no-print sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-card/95 px-4 py-3 backdrop-blur md:px-8">
              <div className="relative min-w-0 flex-1" data-tour="search">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher une procédure (ex. approuver une commande)"
                  className="w-full rounded-full border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                {results.length > 0 && (
                  <div className="absolute left-0 right-0 top-11 z-30 min-w-[18rem] rounded-xl border bg-popover p-1 shadow-lg">
                    {results.map((a) => (
                      <button key={a.id} onClick={() => { go(a.role, a.view); setFiche(a.id); setQ(""); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent">
                        <div className="font-semibold">{a.title}</div><div className="text-xs text-muted-foreground">{a.who} · {VIEW_LABELS[a.view]}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex rounded-full border bg-muted p-1 text-sm" data-tour="mode-switch">
                <button onClick={() => setMode("demo")} className={`flex items-center gap-1 rounded-full px-3 py-1 ${mode === "demo" ? "bg-primary text-primary-foreground" : ""}`}><PlayCircle className="h-4 w-4" />Démonstration</button>
                <button onClick={() => setMode("guide")} className={`flex items-center gap-1 rounded-full px-3 py-1 ${mode === "guide" ? "bg-gold text-ink" : ""}`}><BookOpen className="h-4 w-4" />Guide</button>
              </div>
            </header>
            <div className="flex flex-1 flex-col xl:flex-row">
              <main className="min-w-0 flex-1 p-4 md:p-8"><View /></main>
              {mode === "guide" && viewActions.length > 0 && (
                <aside className="no-print border-t bg-ivory p-4 xl:w-96 xl:shrink-0 xl:border-l xl:border-t-0">
                  <div className="eyebrow mb-3">Fiches action · {VIEW_LABELS[view]}</div>
                  <div className="space-y-3">{viewActions.map((a) => <FicheCard key={a.id} id={a.id} />)}</div>
                </aside>
              )}
            </div>
          </div>
        </div>
        {fiche && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={() => setFiche(null)}>
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button aria-label="Fermer" onClick={() => setFiche(null)} className="absolute right-3 top-3 z-10 rounded-full bg-muted p-1"><X className="h-4 w-4" /></button>
              <FicheCard id={fiche} />
            </div>
          </div>
        )}
      </App.Provider>
    </GtProvider>
  );
}
