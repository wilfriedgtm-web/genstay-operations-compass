import { useState } from "react";
import { Printer, Target } from "lucide-react";
import { toast } from "sonner";
import { FIABILITE, HOTELS, TECHS, fcfa } from "@/lib/gt-data";
import { useGt } from "@/lib/gt-store";
import { cn } from "@/lib/utils";
import { useApp } from "./app-ctx";
import { Badge, Bar, FicheBtn, GhostBtn, GoldBtn, Kpi, PageHead, Panel, SectionTitle, statutTone } from "./ui";

export function DAccueil() {
  const { go } = useApp();
  const gt = useGt();
  const open = gt.signalements.filter((s) => s.status !== "resolu").length;
  return (
    <div>
      <PageHead title="Portefeuille — 4 hôtels" sub="Vue consolidée au lundi 23 novembre 2026" fiche="d-lire-portefeuille" />
      <div className="grid gap-4 md:grid-cols-4">
        <Kpi label="Sites en alerte" value="2" unit="/ 4" tone="warn" sub="Dakar critique, Douala à surveiller" />
        <Kpi label="Signalements actifs" value={open + 6} tone="crit" sub={`dont ${open} à Dakar`} />
        <Kpi label="Disponibilité moy." value="97,6" unit="%" tone="ok" sub="Objectif 98 %" />
        <Kpi label="Interventions clôturées" value="39" tone="gold" sub="sur 90 jours" />
      </div>
      <SectionTitle>Hôtels</SectionTitle>
      <div data-tour="hotels" className="grid gap-4 md:grid-cols-2">
        {HOTELS.map((h) => {
          const fuel = h.id === "dakar" ? gt.fuelPct : h.carburant;
          const auto = h.id === "dakar" ? gt.autonomie : h.autonomie;
          return (
            <Panel key={h.id} accent={statutTone(h.statut) === "neutral" ? undefined : (statutTone(h.statut) as "ok")}>
              <div className="flex items-start justify-between">
                <div><div className="text-lg font-extrabold">🏨 {h.name}</div><div className="text-xs text-muted-foreground">{h.pays} · {h.elec} / {h.eau}</div></div>
                <Badge tone={statutTone(h.statut)}>{h.statut}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
                <div><div className="eyebrow">Alertes</div><div className={cn("kpi text-3xl", h.alertes ? "text-crit" : "text-ok")}>{h.alertes}</div></div>
                <div><div className="eyebrow">Rondes</div><div className={cn("kpi text-3xl", h.rondes < 90 ? "text-warn" : "text-ok")}>{h.rondes}%</div></div>
                <div><div className="eyebrow">Carburant</div><div className={cn("kpi text-3xl", fuel < 35 ? "text-warn" : "")}>{fuel}%</div><div className="text-xs text-muted-foreground">{auto} j</div></div>
                <div><div className="eyebrow">Énergie</div><div className="kpi text-3xl">{h.energie ? new Intl.NumberFormat("fr-FR").format(h.energie) : "—"}</div><div className="text-xs text-muted-foreground">kWh</div></div>
              </div>
              <div className="mt-4 flex justify-end"><GhostBtn onClick={() => go("directeur", "d-fiabilite")}>Voir le détail →</GhostBtn></div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

export function DComparaison() {
  const [k, setK] = useState<"dispo" | "pannes" | "cuve">("dispo");
  const labels = { dispo: "Disponibilité (%)", pannes: "Pannes actives", cuve: "Cuves gasoil (L)" };
  const rows = [...HOTELS].sort((a, b) => (k === "pannes" ? a[k] - b[k] : b[k] - a[k]));
  const max = Math.max(...HOTELS.map((h) => h[k])) || 1;
  return (
    <div>
      <PageHead title="Comparaison inter-sites" sub="Benchmark croisé des 4 hôtels" fiche="d-comparer" right={<GhostBtn onClick={() => window.print()}><Printer className="h-4 w-4" />Imprimer</GhostBtn>} />
      <div className="mb-4 flex gap-2">{(Object.keys(labels) as (keyof typeof labels)[]).map((x) => (
        <button key={x} onClick={() => setK(x)} className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold", k === x ? "border-gold bg-gold/15 text-accent-foreground" : "bg-card")}>{labels[x]}</button>))}
      </div>
      <Panel>
        {rows.map((h, i) => {
          const worst = i === rows.length - 1;
          return (
            <div key={h.id} className="grid grid-cols-[180px_1fr_110px] items-center gap-4 border-b py-3 last:border-0">
              <div className="font-semibold">{h.name}</div>
              <Bar pct={(h[k] / max) * 100} tone={worst ? "crit" : i === 0 ? "ok" : "gold"} />
              <div className={cn("text-right font-bold tabular-nums", worst && "text-crit")}>{k === "cuve" ? new Intl.NumberFormat("fr-FR").format(h[k]) + " L" : k === "dispo" ? h[k] + " %" : h[k]}</div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

export function DFiabilite() {
  const [p, setP] = useState(90);
  const f = p / 90;
  return (
    <div>
      <PageHead title="📊 Fiabilité équipements — Madame T Dakar" sub="MTBF · MTTR · Pannes sur la période sélectionnée" fiche="d-mtbf"
        right={<div className="flex gap-1 rounded-xl border bg-card p-1">{[30, 90, 180, 365].map((x) => <button key={x} onClick={() => setP(x)} className={cn("rounded-lg px-3 py-1 text-sm font-bold", p === x ? "bg-ink text-primary-foreground" : "")}>{x}j</button>)}</div>} />
      <div className="grid gap-4 md:grid-cols-4">
        <Kpi label={`Pannes (${p}j)`} value={Math.round(67 * f)} tone="crit" sub="signalements résolus" />
        <Kpi label="Équipements touchés" value="6" tone="warn" sub="sur 7 actifs" />
        <Kpi label="MTTR moyen" value="2,1" unit="j" sub="temps de résolution" />
        <Kpi label="Sans incident" value="1" tone="ok" sub="TGBT principal" />
      </div>
      <Panel className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left"><tr>{["Équipement", "Pannes", "MTBF", "MTTR moy.", "Dernier incident"].map((h) => <th key={h} className="eyebrow px-5 py-3">{h}</th>)}</tr></thead>
          <tbody>{FIABILITE.map((r) => {
            const pannes = Math.max(r.pannes > 0 ? 1 : 0, Math.round(r.pannes * f));
            const mtbf = Math.round(p / Math.max(1, pannes));
            return (
              <tr key={r.equip} className="border-t">
                <td className="px-5 py-3 font-bold">{r.equip}</td>
                <td className={cn("px-5 py-3 font-bold", pannes >= 5 ? "text-crit" : "text-warn")}>{pannes}</td>
                <td className={cn("px-5 py-3 font-bold", mtbf < 10 ? "text-crit" : mtbf < 30 ? "text-warn" : "text-ok")}>{mtbf}j</td>
                <td className="px-5 py-3">{r.mttr}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.last}</td>
              </tr>);
          })}</tbody>
        </table>
      </Panel>
      <p className="mt-4 text-sm text-muted-foreground">💡 <b>MTBF</b> (temps moyen entre pannes) = période / nb pannes. <b>MTTR</b> (temps moyen de résolution) = durée moyenne de traitement des signalements résolus.</p>
    </div>
  );
}

export function DMaintenance() {
  const contrats = [
    { n: "Groupes électrogènes CAT — Energie Services", fin: "15 déc. 2026", j: 22, tone: "warn" as const },
    { n: "Froid commercial — FroidTech SARL", fin: "30 mars 2027", j: 127, tone: "ok" as const },
    { n: "Ascenseurs — Otis", fin: "02 déc. 2026", j: 9, tone: "crit" as const },
  ];
  const vid = [{ n: "GE 1 — CAT 800 kVA", h: 12844, next: 13000 }, { n: "GE 2 — CAT 800 kVA", h: 9311, next: 9250 }, { n: "GE3 800 kVA", h: 4120, next: 4500 }];
  return (
    <div>
      <PageHead title="Maintenance portefeuille" sub="Préventif vs correctif · contrats · vidanges" fiche="d-maintenance" />
      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Préventif" value="3,8" unit="M XOF" tone="ok" sub="97,7 % du budget maintenance" />
        <Kpi label="Correctif" value="90" unit="k XOF" tone="warn" sub="2,3 % du budget" />
        <Kpi label="Interventions clôturées" value="39" tone="gold" sub="90 derniers jours" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Panel><div className="eyebrow mb-3">Contrats</div>{contrats.map((c) => <div key={c.n} className="flex items-center justify-between border-b py-2.5 last:border-0 text-sm"><span className="font-semibold">{c.n}</span><Badge tone={c.tone}>{c.fin} · J-{c.j}</Badge></div>)}</Panel>
        <Panel><div className="eyebrow mb-3">Vidanges groupes (toutes les 250 h)</div>{vid.map((v) => { const rest = v.next - v.h; return (
          <div key={v.n} className="border-b py-2.5 last:border-0 text-sm"><div className="flex justify-between"><span className="font-semibold">{v.n}</span><span className={cn("font-bold", rest < 0 ? "text-crit" : rest < 200 ? "text-warn" : "text-ok")}>{rest < 0 ? `Dépassée de ${-rest} h` : `${rest} h restantes`}</span></div><div className="mt-1.5"><Bar pct={100 - (rest / 250) * 100} tone={rest < 0 ? "crit" : rest < 200 ? "warn" : "ok"} /></div></div>); })}</Panel>
      </div>
    </div>
  );
}

export function DEquipe() {
  return (
    <div>
      <PageHead title="Équipe & prestataires" sub="Performance comparée sur 90 jours" fiche="d-equipe" />
      <Panel className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left"><tr>{["Intervenant", "Type", "Interventions", "Durée moyenne", "Coût total"].map((h) => <th key={h} className="eyebrow px-5 py-3">{h}</th>)}</tr></thead>
          <tbody>{TECHS.map((t) => (
            <tr key={t.name} className="border-t">
              <td className="px-5 py-3 font-bold">{t.name}</td>
              <td className="px-5 py-3"><Badge tone={t.kind === "interne" ? "gold" : "neutral"}>{t.kind === "interne" ? "Interne" : "Prestataire externe"}</Badge></td>
              <td className="px-5 py-3">{t.interventions}</td>
              <td className={cn("px-5 py-3 font-semibold", t.avgH > 24 ? "text-crit" : t.avgH > 6 ? "text-warn" : "text-ok")}>{String(t.avgH).replace(".", ",")} h</td>
              <td className="px-5 py-3 tabular-nums">{fcfa(t.cost)}</td>
            </tr>))}</tbody>
        </table>
      </Panel>
    </div>
  );
}

export function DEnergie() {
  const [m, setM] = useState("Nov. 26");
  const [obj, setObj] = useState({ k1: 42000, k2: 26000, bache: 320 });
  const [edit, setEdit] = useState(false);
  const fluides = [
    { l: "Électricité jour (K1) · Senelec", v: 18, u: "kWh", o: obj.k1 }, { l: "Électricité nuit (K2) · Senelec", v: 2005, u: "kWh", o: obj.k2 },
    { l: "Eau bâche potable · SDE", v: 310, u: "m³", o: obj.bache }, { l: "Électricité (CIE) · Abidjan", v: 0, u: "kWh", o: 38000 },
    { l: "Eau SODECI · Abidjan", v: 0, u: "m³", o: 290 }, { l: "Électricité (ENEO) · Douala", v: 0, u: "kWh", o: 45000 },
    { l: "Eau CDE · Douala", v: 0, u: "m³", o: 340 }, { l: "Électricité SBEE · Teben", v: 0, u: "kWh", o: 0 }, { l: "Eau SONEB · Teben", v: 0, u: "m³", o: 0 },
  ];
  const gt = useGt();
  return (
    <div>
      <PageHead title={`⚡ Énergie — ${m}`} sub="Distributeurs, fluides, cos φ, cuves" fiche="d-energie"
        right={<><div className="flex gap-1">{["Août 26", "Sept. 26", "Oct. 26", "Nov. 26"].map((x) => <button key={x} onClick={() => setM(x)} className={cn("rounded-full border px-3 py-1.5 text-sm", m === x ? "border-gold bg-gold/15 font-bold text-accent-foreground" : "bg-card")}>{x}</button>)}</div><GhostBtn onClick={() => setEdit((e) => !e)}><Target className="h-4 w-4" />Définir les objectifs</GhostBtn></>} />
      {edit && (
        <Panel accent="gold" className="mb-4 flex flex-wrap items-end gap-4">
          {(["k1", "k2", "bache"] as const).map((k) => <label key={k} className="text-sm"><div className="eyebrow mb-1">{k === "k1" ? "K1 (kWh)" : k === "k2" ? "K2 (kWh)" : "Bâche (m³)"}</div><input type="number" value={obj[k]} onChange={(e) => setObj({ ...obj, [k]: Number(e.target.value) })} className="w-32 rounded-lg border bg-background px-3 py-2" /></label>)}
          <GoldBtn onClick={() => { setEdit(false); toast.success("Objectifs enregistrés pour " + m); }}>Enregistrer</GoldBtn>
        </Panel>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {fluides.map((f) => { const pct = f.o ? Math.round((f.v / f.o) * 100) : 0; const tone = pct > 100 ? "crit" : pct >= 90 ? "warn" : "ok"; return (
          <Kpi key={f.l} label={f.l} value={new Intl.NumberFormat("fr-FR").format(f.v)} unit={f.u} tone={tone} sub={f.o ? `Objectif : ${new Intl.NumberFormat("fr-FR").format(f.o)} ${f.u} — ${pct} %` : "Objectif non défini"} />); })}
      </div>
      <SectionTitle>Niveaux actuels — Madame T Dakar</SectionTitle>
      <div className="grid gap-4 md:grid-cols-4">
        <Kpi label="Cos φ réseau" value="0,86" tone="warn" sub="Cible ≥ 0,90" />
        <Kpi label="Cuve gasoil (GE)" value={gt.fuelPct} unit="%" tone={gt.fuelPct < 30 ? "warn" : "ok"} sub={`${new Intl.NumberFormat("fr-FR").format(gt.fuelL)} L`} />
        <Kpi label="Bâche potable" value={gt.releves.bache_n ?? 0} unit="%" tone="ok" />
        <Kpi label="Gaz butane" value={gt.releves.butane ?? 0} unit="btl" sub="Seuil mini 4" />
      </div>
      <div className="mt-4 max-w-sm"><Kpi label="💰 Coût total énergie" value="868" unit="k XOF" tone="gold" sub="Budget non défini" /></div>
    </div>
  );
}

export function DRapport() {
  const months = ["Septembre 2026", "Octobre 2026", "Novembre 2026"];
  const [i, setI] = useState(2);
  const gt = useGt();
  const pannes = gt.signalements.filter((s) => s.status !== "resolu").length;
  const maint = gt.signalements.filter((s) => s.status === "resolu").reduce((a, s) => a + (s.cout ?? 0), 0) + 68000;
  return (
    <div>
      <PageHead title="Rapport conso" sub="Synthèse financière mensuelle" fiche="d-rapport" right={<GhostBtn onClick={() => window.print()}><Printer className="h-4 w-4" />Imprimer / PDF</GhostBtn>} />
      <div className="mb-5 flex items-center gap-2">
        <GhostBtn disabled={i === 0} onClick={() => setI(i - 1)}>←</GhostBtn>
        <span className="rounded-full border-2 border-gold px-5 py-1.5 font-bold text-accent-foreground">{months[i]}</span>
        <GhostBtn disabled={i === 2} onClick={() => setI(i + 1)}>→</GhostBtn>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Carburant livré" value={i === 2 ? "2 000" : "0"} unit="L" sub={i === 2 ? "1 380 000 FCFA" : "Coût non saisi"} />
        <Kpi label="Pannes actives" value={pannes} tone="crit" sub="50 000 FCFA engagés" />
        <Kpi label="Coût maintenance" value={new Intl.NumberFormat("fr-FR").format(maint)} sub="FCFA réalisés" />
      </div>
      <Panel className="mt-6 bg-ivory">
        <div className="eyebrow mb-3">📋 Référentiel de performance</div>
        <div className="grid gap-3 md:grid-cols-3">
          <Panel><div className="text-sm text-muted-foreground">Pannes actives (total)</div><div className="text-2xl font-extrabold">{pannes}</div><div className="text-sm font-bold text-crit">✗ Critique</div><div className="text-xs text-muted-foreground">Cible : 0 panne active</div></Panel>
          <Panel><div className="text-sm text-muted-foreground">Coût total (carb. + mnt. + pannes)</div><div className="text-2xl font-extrabold">130 500 FCFA</div><div className="text-xs text-muted-foreground">Madame T Dakar · hors livraison carburant</div></Panel>
          <Panel><div className="text-sm text-muted-foreground">Sites en alerte</div><div className="text-2xl font-extrabold">1 / 4</div><div className="text-sm font-bold text-warn">⚠ 1 site</div></Panel>
        </div>
      </Panel>
      <SectionTitle>Aperçu par hôtel</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2">{HOTELS.map((h) => (
        <Panel key={h.id}><div className="flex justify-between"><b>🏨 {h.name}</b><Badge tone={h.pannes ? "crit" : "ok"}>{h.pannes ? "Critique" : "Bon"}</Badge></div>
          <div className="mt-2 text-sm text-muted-foreground">{h.pannes} pannes · rondes {h.rondes} %</div></Panel>))}
      </div>
      <div className="mt-4"><FicheBtn id="d-rapport" label="Comment lire ce rapport" /></div>
    </div>
  );
}
