import groupe from "@/assets/eq-groupe.jpg";
import froid from "@/assets/eq-chambre-froide.jpg";
import tgbt from "@/assets/eq-tgbt.jpg";
import mano from "@/assets/eq-manometre.jpg";
import compr from "@/assets/eq-compresseur.jpg";
import bache from "@/assets/eq-bache.jpg";

export type Role = "directeur" | "responsable" | "technicien";
export const ROLES: { id: Role; label: string; scope: string }[] = [
  { id: "directeur", label: "Directeur Technique", scope: "Multi-sites · 4 hôtels" },
  { id: "responsable", label: "Responsable Technique", scope: "Madame T Dakar" },
  { id: "technicien", label: "Technicien Terrain", scope: "Mobile & WhatsApp" },
];

export const PHOTOS = { groupe, froid, tgbt, mano, compr, bache };

export type Equipment = { id: number; name: string; zone: string; photo: string; kind: string };
export const EQUIPMENTS: Equipment[] = [
  { id: 1, name: "GE 1 — CAT 800 kVA", zone: "Local groupes · Sous-sol -1", photo: groupe, kind: "Groupe électrogène" },
  { id: 2, name: "GE 2 — CAT 800 kVA", zone: "Local groupes · Sous-sol -1", photo: groupe, kind: "Groupe électrogène" },
  { id: 3, name: "CF Cuisine Chaude", zone: "Cuisine principale · RDC", photo: froid, kind: "Chambre froide" },
  { id: 4, name: "CF Pâtisserie & Desserts", zone: "Pâtisserie · RDC", photo: froid, kind: "Chambre froide" },
  { id: 5, name: "Climatisation Lobby & Hall", zone: "Terrasse technique · Toit", photo: compr, kind: "Groupe froid / compresseur" },
  { id: 6, name: "TGBT Principal", zone: "Local TGBT · Sous-sol -1", photo: tgbt, kind: "Tableau électrique" },
  { id: 7, name: "Bâche à eau potable & surpresseur", zone: "Local pompes · Sous-sol -2", photo: bache, kind: "Bâche à eau / pompes" },
];

export const TECHS = [
  { name: "Willo", kind: "interne", phone: "221770000001", interventions: 14, avgH: 3.2, cost: 45000 },
  { name: "Magya", kind: "interne", phone: "221770000002", interventions: 11, avgH: 4.1, cost: 22000 },
  { name: "Ousmane", kind: "interne", phone: "221770000003", interventions: 8, avgH: 2.6, cost: 13500 },
  { name: "FroidTech SARL", kind: "externe", phone: "221770000010", interventions: 4, avgH: 26.5, cost: 1850000 },
  { name: "Energie Services CAT", kind: "externe", phone: "221770000011", interventions: 2, avgH: 8.0, cost: 1950000 },
] as const;

export type SigStatus = "ouvert" | "en_cours" | "resolu";
export type Signalement = {
  ref: string; equipId: number; lieu: string; desc: string; qualif: string; reporter: string;
  status: SigStatus; assignee?: string; assignKind?: "interne" | "externe"; createdAt: string;
  photoAvant?: string; photoApres?: string; travaux?: string; cout?: number; dureeH?: number; resolvedAt?: string;
};

export type CmdStatus = "en_attente" | "approuvee" | "livree" | "annulee";
export type Commande = {
  bc: string; categorie: string; qte: number; unite: string; equip: string; motif: string;
  urgent: boolean; status: CmdStatus; cout: number; date: string;
};

export const CATEGORIES = [
  { id: "Pièce détachée", icon: "🔩" }, { id: "Carburant", icon: "⛽" }, { id: "Consommable", icon: "🧴" },
  { id: "Prestation", icon: "🛠️" }, { id: "Autre", icon: "📝" },
];

export const SEED_SIGNALEMENTS: Signalement[] = [
  { ref: "REF-1326", equipId: 3, lieu: "Stock appoint cuisine principale · Sous-sol -1", desc: "Ligne ou bac de condensats bouché, problème de dégivrage, humidité excessive liée à une porte mal étanche", qualif: "Fonctionnement dégradé", reporter: "Magya", status: "ouvert", createdAt: "2026-11-23T11:16:00" },
  { ref: "REF-1327", equipId: 5, lieu: "Lobby & Hall · RDC", desc: "Température soufflage 19°C au lieu de 14°C, compresseur 2 en défaut HP", qualif: "Fonctionnement dégradé", reporter: "Réception", status: "ouvert", createdAt: "2026-11-23T09:42:00" },
  { ref: "REF-1321", equipId: 2, lieu: "Local groupes · Sous-sol -1", desc: "Alarme basse pression huile au démarrage test hebdomadaire", qualif: "Arrêt total", reporter: "Ousmane", status: "en_cours", assignee: "Energie Services CAT", assignKind: "externe", createdAt: "2026-11-22T16:05:00" },
  { ref: "REF-1318", equipId: 4, lieu: "Pâtisserie · RDC", desc: "Sonde de température défectueuse, affichage erratique", qualif: "Fonctionnement dégradé", reporter: "Chef pâtissier", status: "en_cours", assignee: "Willo", assignKind: "interne", createdAt: "2026-11-22T08:30:00" },
  { ref: "REF-1312", equipId: 7, lieu: "Local pompes · Sous-sol -2", desc: "Fuite au presse-étoupe pompe surpresseur n°2", qualif: "Bruit / fuite", reporter: "Willo", status: "resolu", assignee: "Willo", assignKind: "interne", createdAt: "2026-11-21T10:00:00", travaux: "Remplacement tresse presse-étoupe, resserrage, test pression 4 bar OK", cout: 12500, dureeH: 2.5, resolvedAt: "2026-11-21T13:10:00", photoAvant: mano, photoApres: bache },
];

export const SEED_COMMANDES: Commande[] = [
  { bc: "BC-2026-2645", categorie: "Autre", qte: 1, unite: "lot", equip: "CF Pâtisserie & Desserts", motif: "Problème fréquent", urgent: false, status: "approuvee", cout: 50000, date: "2026-10-06T14:17:00" },
  { bc: "BC-2026-3507", categorie: "Pièce détachée", qte: 500, unite: "unités", equip: "CF Cuisine Chaude", motif: "BESOIN SONDE", urgent: false, status: "en_attente", cout: 20000, date: "2026-11-23T12:24:00" },
  { bc: "BC-2026-6327", categorie: "Carburant", qte: 2000, unite: "litres", equip: "Cuve Carburant Principale", motif: "Besoin", urgent: true, status: "livree", cout: 1380000, date: "2026-11-23T12:22:00" },
];

export type Question = { id: string; equip: string; label: string; unit: string; min?: number | undefined; max?: number | undefined; kind?: "num" | "ok" };
export const RELEVE_QUESTIONS: Question[] = [
  { id: "ge1_h", equip: "GE 1 — CAT 800 kVA", label: "Compteur horaire", unit: "h" },
  { id: "ge1_huile", equip: "GE 1 — CAT 800 kVA", label: "Pression huile", unit: "bar", min: 3, max: 6 },
  { id: "ge1_temp", equip: "GE 1 — CAT 800 kVA", label: "Température eau moteur", unit: "°C", min: 70, max: 95 },
  { id: "ge1_batt", equip: "GE 1 — CAT 800 kVA", label: "Tension batterie", unit: "V", min: 24, max: 28 },
  { id: "ge2_h", equip: "GE 2 — CAT 800 kVA", label: "Compteur horaire", unit: "h" },
  { id: "ge2_huile", equip: "GE 2 — CAT 800 kVA", label: "Pression huile", unit: "bar", min: 3, max: 6 },
  { id: "ge2_temp", equip: "GE 2 — CAT 800 kVA", label: "Température eau moteur", unit: "°C", min: 70, max: 95 },
  { id: "ge2_batt", equip: "GE 2 — CAT 800 kVA", label: "Tension batterie", unit: "V", min: 24, max: 28 },
  { id: "cuve", equip: "Cuve gasoil principale", label: "Niveau cuve", unit: "%", min: 25, max: 100 },
  { id: "cfc_t", equip: "CF Cuisine Chaude", label: "Température intérieure", unit: "°C", min: 0, max: 4 },
  { id: "cfc_porte", equip: "CF Cuisine Chaude", label: "Joint de porte étanche (1=oui, 0=non)", unit: "", min: 1, max: 1 },
  { id: "cfp_t", equip: "CF Pâtisserie & Desserts", label: "Température intérieure", unit: "°C", min: 0, max: 4 },
  { id: "clim_souf", equip: "Climatisation Lobby & Hall", label: "Température soufflage", unit: "°C", min: 12, max: 16 },
  { id: "clim_hp", equip: "Climatisation Lobby & Hall", label: "Haute pression circuit 1", unit: "bar", min: 14, max: 24 },
  { id: "clim_bp", equip: "Climatisation Lobby & Hall", label: "Basse pression circuit 1", unit: "bar", min: 4, max: 7 },
  { id: "tgbt_v", equip: "TGBT Principal", label: "Tension L1-L2", unit: "V", min: 380, max: 420 },
  { id: "tgbt_a", equip: "TGBT Principal", label: "Intensité phase max", unit: "A", min: 0, max: 1200 },
  { id: "tgbt_cos", equip: "TGBT Principal", label: "Cosinus phi", unit: "", min: 0.85, max: 1 },
  { id: "bache_n", equip: "Bâche à eau potable", label: "Niveau bâche", unit: "%", min: 40, max: 100 },
  { id: "bache_p", equip: "Bâche à eau potable", label: "Pression refoulement surpresseur", unit: "bar", min: 3, max: 5 },
  { id: "butane", equip: "Stock gaz butane", label: "Bouteilles pleines en stock", unit: "u", min: 4, max: 40 },
];

export const SEED_RELEVES: Record<string, number> = {
  ge1_h: 12844, ge1_huile: 4.2, ge1_temp: 82, ge1_batt: 26.1, ge2_h: 9311, ge2_huile: 2.4, ge2_temp: 84, ge2_batt: 25.8,
  cuve: 46, cfc_t: 7.5, cfc_porte: 0, cfp_t: 3.2, clim_souf: 19, clim_hp: 26, clim_bp: 5.1, tgbt_v: 402, tgbt_a: 860,
  tgbt_cos: 0.86, bache_n: 72, bache_p: 4.1, butane: 9,
};

export function outOfRange(q: Question, v: number | undefined) {
  if (v === undefined || Number.isNaN(v)) return false;
  return (q.min !== undefined && v < q.min) || (q.max !== undefined && v > q.max);
}

export const HOTELS = [
  { id: "dakar", name: "Madame T Dakar", pays: "Sénégal", elec: "Senelec", eau: "SDE", statut: "Critique", alertes: 7, pannes: 18, rondes: 82, carburant: 46, autonomie: 8.8, energie: 2023, dispo: 94.1, cuve: 4600, cosphi: 0.86 },
  { id: "abidjan", name: "Madame T Abidjan", pays: "Côte d'Ivoire", elec: "CIE", eau: "SODECI", statut: "Bon", alertes: 0, pannes: 0, rondes: 100, carburant: 78, autonomie: 14.2, energie: 0, dispo: 99.6, cuve: 7800, cosphi: 0.93 },
  { id: "douala", name: "Madame T Douala", pays: "Cameroun", elec: "ENEO", eau: "CDE", statut: "À surveiller", alertes: 2, pannes: 3, rondes: 91, carburant: 34, autonomie: 6.1, energie: 0, dispo: 97.8, cuve: 3400, cosphi: 0.89 },
  { id: "teben", name: "MADAMETEBEN", pays: "Bénin", elec: "SBEE", eau: "SONEB", statut: "Bon", alertes: 1, pannes: 1, rondes: 96, carburant: 61, autonomie: 11.0, energie: 0, dispo: 98.9, cuve: 6100, cosphi: 0.91 },
] as const;

export const FIABILITE = [
  { equip: "CF Cuisine Chaude", pannes: 27, mtbf: 3, mttr: "34,7 h", last: "18 nov." },
  { equip: "CF Pâtisserie & Desserts", pannes: 20, mtbf: 5, mttr: "26,6 h", last: "17 nov." },
  { equip: "Climatisation Lobby & Hall", pannes: 11, mtbf: 8, mttr: "2,3 j", last: "29 oct." },
  { equip: "GE 2 — CAT 800 kVA", pannes: 6, mtbf: 15, mttr: "4,3 h", last: "20 nov." },
  { equip: "GE 1 — CAT 800 kVA", pannes: 2, mtbf: 45, mttr: "2,3 j", last: "17 oct." },
  { equip: "GE3 800 kVA", pannes: 1, mtbf: 90, mttr: "5,0 j", last: "22 oct." },
];

export const ZONES = (() => {
  const floors = [
    { f: "Sous-sol -2", n: 18 }, { f: "Sous-sol -1", n: 32 }, { f: "RDC", n: 46 }, { f: "Étage 1", n: 38 },
    { f: "Étage 2", n: 38 }, { f: "Étage 3", n: 38 }, { f: "Étage 4", n: 38 }, { f: "Étage 5", n: 38 }, { f: "Terrasse technique", n: 44 },
  ];
  return floors; // total 330
})();

export const fcfa = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F";
export const fmtDate = (iso: string) => new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
