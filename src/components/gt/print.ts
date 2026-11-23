import { EQUIPMENTS, fcfa, type Signalement } from "@/lib/gt-data";
export function printFiche(s: Signalement) {
  const w = window.open("", "_blank"); if (!w) return;
  const eq = EQUIPMENTS.find((e) => e.id === s.equipId);
  w.document.write(`<html><head><title>Fiche ${s.ref}</title></head><body style="font-family:Arial;color:#1A1411"><h1>Fiche d'intervention ${s.ref}</h1><p><b>${eq?.name ?? ""}</b> — ${s.lieu}</p><p>${s.desc}</p><p>Travaux : ${s.travaux ?? "—"}</p><p>Coût : ${fcfa(s.cout ?? 0)} · Durée : ${s.dureeH ?? "—"} h</p><script>onload=()=>print()</script></body></html>`);
  w.document.close();
}
