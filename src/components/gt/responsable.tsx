import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, Fuel, Link2, Plus, Printer, Send } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, EQUIPMENTS, RELEVE_QUESTIONS, TECHS, ZONES, fcfa, fmtDate, outOfRange, type Question, type Signalement } from "@/lib/gt-data";
import { useGt } from "@/lib/gt-store";
import { cn } from "@/lib/utils";
import { Badge, DarkBtn, FicheBtn, GhostBtn, GoldBtn, Kpi, PageHead, Panel, SectionTitle } from "./ui";
import { useApp } from "./app-ctx";
import { printFiche } from "./print";

export function useSeuil() {
  const gt = useGt();
  return (q: Question): Question => ({ ...q, ...(gt.seuils[q.id] ?? {}) });
}
export function useAlerts() {
  const gt = useGt(); const s = useSeuil();
  return RELEVE_QUESTIONS.map(s).filter((q) => outOfRange(q, gt.releves[q.id]));
}

function FuelGauge() {
  const gt = useGt(); const { go } = useApp();
  const pct = gt.fuelPct; const tone = pct < 15 ? "crit" : pct < 30 ? "warn" : "ok";
  const color = { ok: "var(--ok)", warn: "var(--warn)", crit: "var(--crit)" }[tone];
  const [add, setAdd] = useState(2000);
  const order = () => {
    const bc = gt.createCommande({ categorie: "Carburant", qte: 2000, unite: "litres", equip: "Cuve Carburant Principale", motif: `Autonomie ${gt.autonomie} j`, urgent: pct < 30, cout: 1380000 });
    toast.success(`${bc} créé — en attente d'approbation`); go("responsable", "r-commandes");
  };
  return (
    <Panel data-tour="fuel" className="md:col-span-2">
      <div className="flex items-start justify-between"><div className="eyebrow">⛽ Cuve gasoil principale</div><FicheBtn id="r-fioul" /></div>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="relative h-36 w-36 rounded-full" style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, var(--border) 0)` }}>
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card"><span className="kpi text-4xl">{pct}%</span><span className="text-xs text-muted-foreground">de {gt.capacity / 1000} 000 L</span></div>
        </div>
        <div className="space-y-1">
          <div className="kpi text-4xl">{new Intl.NumberFormat("fr-FR").format(gt.fuelL)} <span className="text-2xl">L</span></div>
          <div className={cn("text-lg font-bold", `text-${tone}`)}>{String(gt.autonomie).replace(".", ",")} jours d'autonomie</div>
          <div className="text-xs text-muted-foreground">Base {gt.daily} L/jour (moyenne 30 j)</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <GoldBtn onClick={order}><Fuel className="h-4 w-4" />Commander du gasoil</GoldBtn>
        <input type="number" value={add} onChange={(e) => setAdd(Number(e.target.value))} className="w-24 rounded-lg border bg-background px-2 py-2 text-sm" aria-label="Litres livrés" />
        <GhostBtn onClick={() => { gt.setFuel(gt.fuelL + add); toast.success(`Livraison de ${add} L enregistrée`); }}>Enregistrer une livraison</GhostBtn>
        <GhostBtn onClick={() => { gt.setFuel(gt.fuelL - gt.daily); toast("Consommation d'une journée déduite"); }}>− 1 jour de conso</GhostBtn>
      </div>
    </Panel>
  );
}

export function RDashboard() {
  const gt = useGt(); const alerts = useAlerts(); const { go } = useApp();
  const open = gt.signalements.filter((s) => s.status === "ouvert").length;
  return (
    <div>
      <PageHead title="Madame T Dakar — Tableau de bord" sub="Exploitation du jour · lundi 23 novembre 2026" />
      <div className="grid gap-4 md:grid-cols-4">
        <FuelGauge />
        <Kpi label="Alertes actives" value={alerts.length} tone={alerts.length ? "crit" : "ok"} sub="mesures hors seuil" />
        <Kpi label="Signalements ouverts" value={open} tone={open ? "warn" : "ok"} sub={<button className="underline" onClick={() => go("responsable", "r-signalements")}>Ouvrir le Kanban</button>} />
      </div>
      <SectionTitle>Alertes hors seuil</SectionTitle>
      <Panel className="p-0">{alerts.length === 0 ? <div className="p-5 text-sm text-muted-foreground">Aucune alerte : toutes les mesures sont dans les seuils. ✅</div> : alerts.map((q) => (
        <div key={q.id} className="flex items-center justify-between border-b px-5 py-3 text-sm last:border-0"><div><b>{q.equip}</b> · {q.label}</div><div className="flex items-center gap-3"><span className="font-bold text-crit">{gt.releves[q.id]} {q.unit}</span><span className="text-xs text-muted-foreground">seuil {q.min ?? "—"} – {q.max ?? "—"}</span></div></div>))}
      </Panel>
      <SectionTitle>Équipements surveillés</SectionTitle>
      <div className="grid gap-4 md:grid-cols-4">{EQUIPMENTS.map((e) => {
        const n = gt.signalements.filter((s) => s.equipId === e.id && s.status !== "resolu").length;
        return (
          <div key={e.id} className="overflow-hidden rounded-2xl border bg-card">
            <img src={e.photo} alt={e.name} loading="lazy" width={1024} height={768} className="h-32 w-full object-cover" />
            <div className="p-3"><div className="text-sm font-bold">{e.name}</div><div className="text-xs text-muted-foreground">{e.zone}</div>
              <div className="mt-2">{n ? <Badge tone="crit">{n} signalement{n > 1 ? "s" : ""}</Badge> : <Badge tone="ok">Bon</Badge>}</div></div>
          </div>);
      })}</div>
    </div>
  );
}

function waLink(phone: string, s: Signalement, who: string) {
  const eq = EQUIPMENTS.find((e) => e.id === s.equipId);
  const txt = `🛠️ Mission GenTrack — ${s.ref}\n🏨 Madame T Dakar\n⚡ ${eq?.name}\n📍 ${s.lieu}\n📝 ${s.desc}\n👤 Affecté à : ${who}\n\nRépondre OK ${s.ref} pour prise en charge.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(txt)}`;
}

function AssignDialog({ sig, onClose }: { sig: Signalement | null; onClose: () => void }) {
  const gt = useGt();
  const [kind, setKind] = useState<"interne" | "externe">("interne");
  const list = TECHS.filter((t) => t.kind === kind);
  const [who, setWho] = useState<string>(list[0]?.name ?? "");
  useEffect(() => { setWho(TECHS.find((t) => t.kind === kind)?.name ?? ""); }, [kind]);
  if (!sig) return null;
  const tech = TECHS.find((t) => t.name === who);
  const send = () => {
    if (!tech) return;
    gt.assign(sig.ref, tech.name, kind);
    window.open(waLink(tech.phone, sig, tech.name), "_blank", "noopener");
    toast.success(`${sig.ref} affecté à ${tech.name} — mission WhatsApp prête`);
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Affecter {sig.ref}</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">{EQUIPMENTS.find((e) => e.id === sig.equipId)?.name} — {sig.desc}</p>
        <div className="grid grid-cols-2 gap-2">{(["interne", "externe"] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={cn("rounded-xl border p-3 text-left text-sm", kind === k && "border-gold bg-gold/10")}><b>{k === "interne" ? "Technicien interne" : "Prestataire externe"}</b><div className="text-xs text-muted-foreground">{k === "interne" ? "Intervention immédiate, coût main d'œuvre interne" : "Devis / contrat, délai de déplacement"}</div></button>))}
        </div>
        <select value={who} onChange={(e) => setWho(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2">{list.map((t) => <option key={t.name}>{t.name}</option>)}</select>
        <div className="flex justify-between gap-2"><FicheBtn id="r-affecter" /><GoldBtn onClick={send}><Send className="h-4 w-4" />Envoyer la mission WhatsApp</GoldBtn></div>
      </DialogContent>
    </Dialog>
  );
}

export function RSignalements() {
  const gt = useGt();
  const [assign, setAssign] = useState<Signalement | null>(null);
  const [detail, setDetail] = useState<Signalement | null>(null);
  const cols = [{ id: "ouvert", l: "Ouvert", t: "crit" }, { id: "en_cours", l: "En cours", t: "warn" }, { id: "resolu", l: "Résolu", t: "ok" }] as const;
  return (
    <div>
      <PageHead title="Signalements & Kanban" sub="Flux Ouvert → En cours → Résolu" fiche="r-affecter" />
      <div data-tour="kanban" className="grid gap-4 md:grid-cols-3">
        {cols.map((c) => { const items = gt.signalements.filter((s) => s.status === c.id); return (
          <div key={c.id} className="rounded-2xl border bg-muted/40 p-3">
            <div className="mb-3 flex items-center justify-between px-1"><b>{c.l}</b><Badge tone={c.t}>{items.length}</Badge></div>
            <div className="space-y-3">
              {items.length === 0 && <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">Aucun signalement</div>}
              {items.map((s) => { const eq = EQUIPMENTS.find((e) => e.id === s.equipId); return (
                <div key={s.ref} className={cn("rounded-xl border border-l-4 bg-card p-3", `border-l-${c.t}`)}>
                  <div className="flex items-center justify-between text-xs"><span className="font-mono font-bold">{s.ref}</span><span className="text-muted-foreground">{fmtDate(s.createdAt)}</span></div>
                  <div className="mt-1 font-bold">{eq?.name}</div>
                  <div className="line-clamp-2 text-sm text-muted-foreground">{s.desc}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5"><Badge tone={s.qualif === "Arrêt total" || s.qualif === "Sécurité" ? "crit" : "warn"}>{s.qualif}</Badge>{s.assignee && <Badge tone="gold">👤 {s.assignee}</Badge>}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.id === "ouvert" && <GoldBtn className="px-3 py-1.5 text-xs" onClick={() => setAssign(s)}>Affecter</GoldBtn>}
                    {c.id === "en_cours" && <GhostBtn className="px-3 py-1.5 text-xs" onClick={() => setAssign(s)}>Réaffecter</GhostBtn>}
                    <GhostBtn className="px-3 py-1.5 text-xs" onClick={() => setDetail(s)}>Détail</GhostBtn>
                    {c.id === "resolu" && <GhostBtn className="px-3 py-1.5 text-xs" onClick={() => printFiche(s)}><Printer className="h-3.5 w-3.5" />Fiche PDF</GhostBtn>}
                  </div>
                </div>); })}
            </div>
          </div>); })}
      </div>
      <AssignDialog key={assign?.ref} sig={assign} onClose={() => setAssign(null)} />
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="overflow-y-auto">
          {detail && (() => { const eq = EQUIPMENTS.find((e) => e.id === detail.equipId); return (<>
            <SheetHeader><SheetTitle>{detail.ref} · {eq?.name}</SheetTitle></SheetHeader>
            <div className="space-y-3 px-4 pb-6 text-sm">
              <img src={detail.photoAvant ?? eq?.photo} alt={eq?.name} className="w-full rounded-xl" />
              <p><b>Lieu :</b> {detail.lieu}</p><p><b>Déclaré par :</b> {detail.reporter} · {fmtDate(detail.createdAt)}</p><p>{detail.desc}</p>
              {detail.status === "resolu" && <><p><b>Travaux :</b> {detail.travaux}</p><p><b>Coût :</b> {fcfa(detail.cout ?? 0)} · <b>Durée :</b> {detail.dureeH} h</p>{detail.photoApres && <img src={detail.photoApres} alt="Après" className="w-full rounded-xl" />}
                <GhostBtn onClick={() => { gt.reopen(detail.ref); setDetail(null); toast("Signalement rouvert"); }}>Rouvrir</GhostBtn></>}
            </div></>); })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function RCommandes() {
  const gt = useGt();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ categorie: "Pièce détachée", qte: 1, unite: "unités", equip: EQUIPMENTS[0]!.name, motif: "", cout: 0, urgent: false });
  const [filter, setFilter] = useState<"tous" | "en_attente" | "approuvee" | "livree" | "annulee">("tous");
  const submit = () => {
    if (!f.motif.trim() || f.qte <= 0) { toast.error("Indiquez une quantité et un motif"); return; }
    const bc = gt.createCommande({ ...f, motif: f.motif.trim().slice(0, 200) });
    toast.success(`${bc} créé — en attente de validation`); setOpen(false); setF({ ...f, motif: "", cout: 0, urgent: false });
  };
  const month = gt.commandes.filter((c) => c.status !== "annulee" && c.date.startsWith("2026-11"));
  const recap = CATEGORIES.map((c) => ({ ...c, n: month.filter((x) => x.categorie === c.id).length, total: month.filter((x) => x.categorie === c.id).reduce((a, x) => a + x.cout, 0) })).filter((c) => c.n);
  const list = gt.commandes.filter((c) => filter === "tous" || c.status === filter);
  const st = { en_attente: ["En attente", "warn"], approuvee: ["Approuvée", "gold"], livree: ["Livré ✅", "ok"], annulee: ["Annulée", "neutral"] } as const;
  return (
    <div>
      <PageHead title="Commandes & Achats" sub="Bons de commande BC-2026-XXXX" fiche="r-commande" right={<GoldBtn data-tour="cmd-new" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Nouvelle demande</GoldBtn>} />
      <div className="mb-4 flex flex-wrap gap-2">{(["tous", "en_attente", "approuvee", "livree", "annulee"] as const).map((x) => <button key={x} onClick={() => setFilter(x)} className={cn("rounded-full border px-3 py-1 text-sm", filter === x ? "border-gold bg-gold/15 font-bold" : "bg-card")}>{x === "tous" ? "Toutes" : st[x][0]}</button>)}</div>
      <div className="space-y-3">
        {list.length === 0 && <Panel className="text-center text-sm text-muted-foreground">Aucune commande dans ce filtre.</Panel>}
        {list.map((c) => { const cat = CATEGORIES.find((x) => x.id === c.categorie); return (
          <Panel key={c.bc} accent={c.urgent ? "warn" : undefined} className="flex flex-wrap items-start gap-4">
            <div className="text-3xl">{cat?.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><b className="text-lg">{c.categorie}</b><span>· {new Intl.NumberFormat("fr-FR").format(c.qte)} {c.unite}</span>{c.urgent && <Badge tone="warn">Urgent 🔶</Badge>}</div>
              <div className="text-accent-foreground">🔧 {c.equip}</div><div>{c.motif}</div>
              <div className="font-mono text-xs text-muted-foreground">{fmtDate(c.date)} · {c.bc}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.status === "en_attente" && <><button onClick={() => { gt.setCmdStatus(c.bc, "approuvee"); toast.success(`${c.bc} approuvé`); }} className="rounded-xl border-2 border-ok px-3 py-1.5 text-sm font-bold text-ok">✅ Approuver</button>
                  <button onClick={() => { gt.setCmdStatus(c.bc, "annulee"); toast(`${c.bc} annulé`); }} className="rounded-xl border-2 border-crit px-3 py-1.5 text-sm font-bold text-crit">❌ Annuler</button></>}
                {c.status === "approuvee" && <DarkBtn className="py-1.5" onClick={() => { gt.setCmdStatus(c.bc, "livree"); toast.success(c.categorie === "Carburant" ? `Livré — ${c.qte} L ajoutés à la cuve` : `${c.bc} marqué livré`); }}>📦 Marquer livré</DarkBtn>}
              </div>
            </div>
            <div className="text-right"><Badge tone={st[c.status][1]}>{st[c.status][0]}</Badge><div className="eyebrow mt-3">Coût</div><div className={cn("text-xl font-extrabold", c.status === "livree" && "text-ok")}>{fcfa(c.cout)}</div></div>
          </Panel>); })}
      </div>
      <SectionTitle>Récap ce mois par catégorie</SectionTitle>
      <div className="flex flex-wrap gap-3">{recap.length === 0 ? <span className="text-sm text-muted-foreground">Aucune commande ce mois.</span> : recap.map((c) => <Panel key={c.id} className="w-44 text-center"><div className="text-2xl">{c.icon}</div><b>{c.n} cmd</b><div>{fcfa(c.total)}</div><div className="text-xs text-muted-foreground">{c.id}</div></Panel>)}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvelle demande d'achat</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="col-span-2">Catégorie<select value={f.categorie} onChange={(e) => setF({ ...f, categorie: e.target.value, unite: e.target.value === "Carburant" ? "litres" : "unités" })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2">{CATEGORIES.map((c) => <option key={c.id}>{c.id}</option>)}</select></label>
            <label>Quantité<input type="number" min={1} value={f.qte} onChange={(e) => setF({ ...f, qte: Number(e.target.value) })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2" /></label>
            <label>Unité<input value={f.unite} onChange={(e) => setF({ ...f, unite: e.target.value.slice(0, 20) })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2" /></label>
            <label className="col-span-2">Équipement<select value={f.equip} onChange={(e) => setF({ ...f, equip: e.target.value })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2">{[...EQUIPMENTS.map((e) => e.name), "Cuve Carburant Principale"].map((n) => <option key={n}>{n}</option>)}</select></label>
            <label className="col-span-2">Motif<input value={f.motif} maxLength={200} onChange={(e) => setF({ ...f, motif: e.target.value })} placeholder="ex. Sonde de température HS" className="mt-1 w-full rounded-lg border bg-background px-3 py-2" /></label>
            <label>Coût estimé (FCFA)<input type="number" min={0} value={f.cout} onChange={(e) => setF({ ...f, cout: Number(e.target.value) })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2" /></label>
            <label>Urgence<select value={f.urgent ? "1" : "0"} onChange={(e) => setF({ ...f, urgent: e.target.value === "1" })} className="mt-1 w-full rounded-lg border bg-background px-3 py-2"><option value="0">Normale</option><option value="1">Urgente — risque d'arrêt</option></select></label>
          </div>
          <GoldBtn onClick={submit}>Envoyer la demande</GoldBtn>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function RReleves() {
  const gt = useGt(); const s = useSeuil();
  const [insp, setInsp] = useState<Question | null>(null);
  const [tech, setTech] = useState("Willo");
  const [now, setNow] = useState(0);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  const filled = RELEVE_QUESTIONS.filter((q) => gt.releves[q.id] !== undefined).length;
  const gen = () => { const l = gt.createLink(tech); const url = `${location.origin}/?releve=${l.token}`; navigator.clipboard?.writeText(url).catch(() => {}); toast.success("Lien sécurisé copié — valide 4 h"); };
  return (
    <div>
      <PageHead title="Relevés horaires" sub={`${filled} / 21 valeurs saisies · dernière saisie ${fmtDate(gt.relevesAt)}`} fiche="r-releves" />
      <Panel accent="gold" className="mb-4 flex flex-wrap items-center gap-3">
        <Link2 className="h-5 w-5 text-gold" /><b>Lien sécurisé releve.html</b>
        <select value={tech} onChange={(e) => setTech(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">{TECHS.filter((t) => t.kind === "interne").map((t) => <option key={t.name}>{t.name}</option>)}</select>
        <GoldBtn onClick={gen}>Générer un lien (4 h)</GoldBtn>
        <div className="w-full space-y-1">{gt.links.map((l) => { const left = l.expiresAt - now; const valid = left > 0; const url = `/?releve=${l.token}`; return (
          <div key={l.token} className="flex flex-wrap items-center gap-2 text-sm"><code className="rounded bg-muted px-2 py-0.5">releve.html?t={l.token}</code><span>· {l.tech}</span>
            <Badge tone={valid ? "ok" : "neutral"}>{valid ? `expire dans ${Math.floor(left / 3600000)} h ${Math.floor((left % 3600000) / 60000)} min` : "Expiré"}</Badge>
            {valid && <><button className="text-xs underline" onClick={() => { navigator.clipboard?.writeText(location.origin + url); toast("Copié"); }}><Copy className="inline h-3 w-3" /> Copier</button>
              <a className="text-xs underline" href={`https://wa.me/${TECHS.find((t) => t.name === l.tech)?.phone}?text=${encodeURIComponent("Relevé horaire GenTrack : " + location.origin + url)}`} target="_blank" rel="noreferrer">Envoyer WhatsApp</a></>}
          </div>); })}</div>
      </Panel>
      <Panel className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left"><tr>{["Équipement", "Mesure", "Valeur", "Seuil", "État"].map((h) => <th key={h} className="eyebrow px-5 py-3">{h}</th>)}</tr></thead>
          <tbody>{RELEVE_QUESTIONS.map((q0) => { const q = s(q0); const v = gt.releves[q.id]; const bad = outOfRange(q, v); return (
            <tr key={q.id} onClick={() => setInsp(q)} className="cursor-pointer border-t hover:bg-muted/40">
              <td className="px-5 py-2.5 font-semibold">{q.equip}</td><td className="px-5 py-2.5">{q.label}</td>
              <td className={cn("px-5 py-2.5 font-bold tabular-nums", bad && "text-crit")}>{v ?? "—"} {q.unit}</td>
              <td className="px-5 py-2.5 text-muted-foreground">{q.min ?? "—"} – {q.max ?? "—"}</td>
              <td className="px-5 py-2.5">{v === undefined ? <Badge>Non saisi</Badge> : bad ? <Badge tone="crit">Hors seuil</Badge> : <Badge tone="ok">OK</Badge>}</td>
            </tr>); })}</tbody>
        </table>
      </Panel>
      <Sheet open={!!insp} onOpenChange={(o) => !o && setInsp(null)}>
        <SheetContent>
          {insp && <><SheetHeader><SheetTitle>{insp.equip}</SheetTitle></SheetHeader>
            <div className="space-y-3 px-4 text-sm">
              <img src={EQUIPMENTS.find((e) => insp.equip.startsWith(e.name.split(" —")[0]!))?.photo ?? EQUIPMENTS[0]!.photo} alt="" className="w-full rounded-xl" />
              <div className="eyebrow">{insp.label}</div>
              <div className={cn("kpi text-5xl", outOfRange(insp, gt.releves[insp.id]) && "text-crit")}>{gt.releves[insp.id] ?? "—"} <span className="text-2xl">{insp.unit}</span></div>
              <p>Seuil configuré : {insp.min ?? "—"} à {insp.max ?? "—"} {insp.unit}</p>
              <p className="text-muted-foreground">Saisi le {fmtDate(gt.relevesAt)}. Si la valeur est hors seuil, une alerte WhatsApp a été envoyée au Responsable et la valeur apparaît sur le tableau de bord.</p>
            </div></>}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Affiche() {
  const url = "https://gen-track.vercel.app/signalement.html?site=bbbbbbbb-0000-0000-000000000001";
  const [qr, setQr] = useState("");
  useEffect(() => { QRCode.toDataURL(url, { width: 520, margin: 1, color: { dark: "#1A1411", light: "#FFFFFF" } }).then(setQr); }, []);
  const download = () => { const a = document.createElement("a"); a.href = qr; a.download = "QR-Madame-T-Dakar.png"; a.click(); };
  const print = () => {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<html><head><title>Affiche Madame T Dakar</title><style>@page{size:A4;margin:14mm}body{font-family:Manrope,Arial,sans-serif;color:#1A1411;text-align:center}h1{font-size:40px;margin:10px 0}.s{display:flex;gap:12px;text-align:left;margin:14px 40px}.n{background:#C9A84C;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-weight:800;flex:none}.b{border-top:4px solid #C9A84C;padding-top:16px;margin-top:20px}</style></head><body><div style="font-weight:800;letter-spacing:2px">GEN<span style="color:#C9A84C">TRACK</span></div><h1>📌 Signaler un problème</h1><p>Scannez le QR code pour nous informer de tout dysfonctionnement ou incident</p><div class="b"></div><div class="s"><div class="n">1</div><div><b>Scannez le QR code</b><br>Ouvrez l'appareil photo et pointez-le vers le code</div></div><div class="s"><div class="n">2</div><div><b>Décrivez le problème</b><br>Type de problème, équipement concerné et photo si possible</div></div><div class="s"><div class="n">3</div><div><b>Envoyez le signalement</b><br>L'équipe technique est immédiatement notifiée</div></div><p style="font-weight:800;letter-spacing:2px;margin-top:20px">SCANNEZ POUR SIGNALER</p><img src="${qr}" style="width:260px"/><h2>Madame T Dakar</h2><small>${url}</small><script>onload=()=>print()</script></body></html>`);
    w.document.close();
  };
  return (
    <div className="grid gap-6 md:grid-cols-[320px_1fr]">
      <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
        <div className="text-sm font-extrabold tracking-[0.2em]">GEN<span className="text-gold">TRACK</span></div>
        <div className="mt-3 text-2xl font-extrabold">📌 Signaler un problème</div>
        <p className="mt-1 text-xs text-muted-foreground">Scannez le QR code pour nous informer de tout dysfonctionnement ou incident</p>
        <ol className="mt-4 space-y-2 border-t-4 border-gold pt-4 text-left text-xs">
          {["Scannez le QR code", "Décrivez le problème", "Envoyez le signalement"].map((t, i) => <li key={t} className="flex gap-2"><span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gold font-bold text-ink">{i + 1}</span><b className="pt-0.5">{t}</b></li>)}
        </ol>
        <div className="eyebrow mt-4">Scannez pour signaler</div>
        {qr ? <img src={qr} alt="QR code de signalement Madame T Dakar" className="mx-auto mt-2 w-48" /> : <div className="mx-auto mt-2 h-48 w-48 animate-pulse rounded bg-muted" />}
        <div className="mt-2 font-extrabold">Madame T Dakar</div>
      </div>
      <div className="space-y-3 text-sm">
        <p>Affiche officielle à placer dans chaque office, local technique et back-office. Le QR ouvre le formulaire de signalement du site Madame T Dakar.</p>
        <code className="block break-all rounded-lg bg-muted p-2 text-xs">{url}</code>
        <div className="flex flex-wrap gap-2"><GoldBtn onClick={print}><Printer className="h-4 w-4" />Imprimer l'affiche A4</GoldBtn><GhostBtn onClick={download} disabled={!qr}><Download className="h-4 w-4" />Télécharger le QR (PNG)</GhostBtn></div>
      </div>
    </div>
  );
}

export function RConfig() {
  const gt = useGt(); const s = useSeuil();
  const [tab, setTab] = useState("zones");
  const [draft, setDraft] = useState<Record<string, { min?: string; max?: string }>>({});
  const [contacts, setContacts] = useState([{ n: "Responsable technique", p: "+221 77 000 00 00", a: "Toutes alertes" }, { n: "Willo (astreinte)", p: "+221 77 000 00 01", a: "Pannes bloquantes" }, { n: "Directeur technique", p: "+221 77 000 00 09", a: "Critique uniquement" }]);
  const total = useMemo(() => ZONES.reduce((a, z) => a + z.n, 0), []);
  const tabs = [["zones", "Zones & Lieux"], ["equip", "Équipements & Rondes"], ["seuils", "Seuils min/max"], ["contacts", "Contacts & Alertes"], ["affiche", "Affiche QR"]];
  return (
    <div>
      <PageHead title="Configuration — Madame T Dakar" fiche="r-config" />
      <div className="mb-5 flex flex-wrap gap-2">{tabs.map(([id, l]) => <button key={id} onClick={() => setTab(id!)} className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold", tab === id ? "border-gold bg-gold/15 text-accent-foreground" : "bg-card")}>{l}</button>)}</div>
      {tab === "zones" && <><p className="mb-3 text-sm text-muted-foreground"><b className="text-foreground">{total} zones</b> réparties sur {ZONES.length} niveaux.</p>
        <div className="grid gap-3 md:grid-cols-3">{ZONES.map((z) => <Panel key={z.f} className="flex items-center justify-between"><b>{z.f}</b><span className="kpi text-3xl">{z.n}</span></Panel>)}</div></>}
      {tab === "equip" && <div className="grid gap-4 md:grid-cols-3">{EQUIPMENTS.map((e) => <div key={e.id} className="overflow-hidden rounded-2xl border bg-card"><img src={e.photo} alt={e.name} loading="lazy" className="h-36 w-full object-cover" /><div className="p-3 text-sm"><b>{e.id}. {e.name}</b><div className="text-muted-foreground">{e.kind} · {e.zone}</div><div className="mt-1 text-xs">Ronde journalière ✓ · Relevé horaire {RELEVE_QUESTIONS.filter((q) => q.equip.startsWith(e.name.split(" —")[0]!)).length} mesures</div></div></div>)}</div>}
      {tab === "seuils" && <Panel className="overflow-x-auto p-0"><table className="w-full text-sm"><thead className="bg-muted/60 text-left"><tr>{["Mesure", "Min", "Max", ""].map((h) => <th key={h} className="eyebrow px-4 py-3">{h}</th>)}</tr></thead><tbody>
        {RELEVE_QUESTIONS.filter((q) => q.min !== undefined || q.max !== undefined).map((q0) => { const q = s(q0); const d = draft[q.id] ?? {}; return (
          <tr key={q.id} className="border-t"><td className="px-4 py-2"><b>{q.equip}</b> · {q.label} <span className="text-muted-foreground">({q.unit})</span></td>
            <td className="px-4 py-2"><input type="number" value={d.min ?? q.min ?? ""} onChange={(e) => setDraft({ ...draft, [q.id]: { ...d, min: e.target.value } })} className="w-20 rounded border bg-background px-2 py-1" /></td>
            <td className="px-4 py-2"><input type="number" value={d.max ?? q.max ?? ""} onChange={(e) => setDraft({ ...draft, [q.id]: { ...d, max: e.target.value } })} className="w-20 rounded border bg-background px-2 py-1" /></td>
            <td className="px-4 py-2">{draft[q.id] && <GhostBtn className="py-1 text-xs" onClick={() => { const mn = d.min !== undefined ? Number(d.min) : q.min; const mx = d.max !== undefined ? Number(d.max) : q.max; if (mn !== undefined && mx !== undefined && mn > mx) { toast.error("Le min doit être ≤ au max"); return; } gt.setSeuil(q.id, mn, mx); const n = { ...draft }; delete n[q.id]; setDraft(n); toast.success("Seuil enregistré"); }}>Enregistrer</GhostBtn>}</td></tr>); })}
      </tbody></table></Panel>}
      {tab === "contacts" && <Panel>{contacts.map((c, i) => <div key={i} className="grid grid-cols-3 gap-3 border-b py-2.5 text-sm last:border-0"><b>{c.n}</b><span>{c.p}</span><select value={c.a} onChange={(e) => { const n = [...contacts]; n[i] = { ...c, a: e.target.value }; setContacts(n); toast.success("Règle d'alerte mise à jour"); }} className="rounded border bg-background px-2 py-1">{["Toutes alertes", "Pannes bloquantes", "Critique uniquement", "Aucune"].map((o) => <option key={o}>{o}</option>)}</select></div>)}</Panel>}
      {tab === "affiche" && <Affiche />}
    </div>
  );
}
