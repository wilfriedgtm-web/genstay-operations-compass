import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_COMMANDES, SEED_RELEVES, SEED_SIGNALEMENTS, type Commande, type Signalement } from "./gt-data";

type State = {
  signalements: Signalement[];
  commandes: Commande[];
  releves: Record<string, number>;
  relevesAt: string;
  fuelL: number;
  links: { token: string; expiresAt: number; tech: string }[];
  seuils: Record<string, { min?: number | undefined; max?: number | undefined }>;
  bilans: { at: string; text: string }[];
};
const CAPACITY = 10000;
const DAILY = 523; // L/jour → 4600 L ≈ 8,8 j

const initial = (): State => ({
  signalements: SEED_SIGNALEMENTS, commandes: SEED_COMMANDES, releves: SEED_RELEVES, relevesAt: "2026-11-23T15:00:00",
  fuelL: 4600, links: [], seuils: {}, bilans: [],
});

const KEY = "gentrack-v1";
function nextNum(prefix: string, used: string[]) {
  let n = 1328;
  while (used.includes(`${prefix}${n}`)) n++;
  return `${prefix}${n}`;
}

function useGtState() {
  const [s, setS] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...initial(), ...JSON.parse(raw) }); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(s)); }, [s, ready]);

  return useMemo(() => {
    const now = () => new Date().toISOString();
    return {
      ...s, capacity: CAPACITY, daily: DAILY,
      fuelPct: Math.round((s.fuelL / CAPACITY) * 100), autonomie: Math.round((s.fuelL / DAILY) * 10) / 10,
      reset: () => setS(initial()),
      createSignalement(p: Omit<Signalement, "ref" | "status" | "createdAt">) {
        const ref = nextNum("REF-", s.signalements.map((x) => x.ref));
        setS((st) => ({ ...st, signalements: [{ ...p, ref, status: "ouvert", createdAt: now() }, ...st.signalements] }));
        return ref;
      },
      assign(ref: string, assignee: string, kind: "interne" | "externe") {
        setS((st) => ({ ...st, signalements: st.signalements.map((x) => x.ref === ref ? { ...x, assignee, assignKind: kind, status: "en_cours" } : x) }));
      },
      takeCharge(ref: string, who: string) {
        let found = false;
        setS((st) => ({ ...st, signalements: st.signalements.map((x) => { if (x.ref === ref && x.status !== "resolu") { found = true; return { ...x, status: "en_cours", assignee: x.assignee ?? who, assignKind: x.assignKind ?? "interne" }; } return x; }) }));
        return found || s.signalements.some((x) => x.ref === ref && x.status !== "resolu");
      },
      resolve(ref: string, r: Pick<Signalement, "travaux" | "cout" | "dureeH" | "photoAvant" | "photoApres">) {
        setS((st) => ({ ...st, signalements: st.signalements.map((x) => x.ref === ref ? { ...x, ...r, status: "resolu", resolvedAt: now() } : x) }));
      },
      reopen(ref: string) { setS((st) => ({ ...st, signalements: st.signalements.map((x) => x.ref === ref ? { ...x, status: "ouvert", assignee: undefined } : x) })); },
      createCommande(c: Omit<Commande, "bc" | "status" | "date">) {
        const used = s.commandes.map((x) => x.bc);
        let bc = ""; do { bc = `BC-2026-${1000 + Math.floor(Math.random() * 9000)}`; } while (used.includes(bc));
        setS((st) => ({ ...st, commandes: [{ ...c, bc, status: "en_attente", date: now() }, ...st.commandes] }));
        return bc;
      },
      setCmdStatus(bc: string, status: Commande["status"]) {
        setS((st) => {
          const c = st.commandes.find((x) => x.bc === bc);
          const addFuel = status === "livree" && c?.categorie === "Carburant" && c.status !== "livree" ? c.qte : 0;
          return { ...st, fuelL: Math.min(CAPACITY, st.fuelL + addFuel), commandes: st.commandes.map((x) => x.bc === bc ? { ...x, status } : x) };
        });
      },
      setFuel(l: number) { setS((st) => ({ ...st, fuelL: Math.max(0, Math.min(CAPACITY, l)) })); },
      saveReleves(v: Record<string, number>) { setS((st) => ({ ...st, releves: { ...st.releves, ...v }, relevesAt: now() })); },
      createLink(tech: string) {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(6))).map((b) => b.toString(16).padStart(2, "0")).join("");
        const link = { token, tech, expiresAt: Date.now() + 4 * 3600 * 1000 };
        setS((st) => ({ ...st, links: [link, ...st.links].slice(0, 5) }));
        return link;
      },
      setSeuil(id: string, min?: number, max?: number) { setS((st) => ({ ...st, seuils: { ...st.seuils, [id]: { min, max } } })); },
      addBilan(text: string) { setS((st) => ({ ...st, bilans: [{ at: now(), text }, ...st.bilans] })); },
    };
  }, [s]);
}

export type GtStore = ReturnType<typeof useGtState>;
const Ctx = createContext<GtStore | null>(null);
export function GtProvider({ children }: { children: ReactNode }) {
  const v = useGtState();
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export function useGt() { const v = useContext(Ctx); if (!v) throw new Error("GtProvider missing"); return v; }
