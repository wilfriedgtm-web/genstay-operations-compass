import type { Role } from "./gt-data";

export type ViewId =
  | "d-accueil" | "d-comparaison" | "d-fiabilite" | "d-maintenance" | "d-equipe" | "d-energie" | "d-rapport"
  | "r-dashboard" | "r-signalements" | "r-commandes" | "r-releves" | "r-config"
  | "t-bot";

export type ActionSheet = {
  id: string; title: string; role: Role; who: string; view: ViewId; when: string;
  steps: string[]; result: string; tips: string[]; keywords: string;
};

export const ACTIONS: ActionSheet[] = [
  // Directeur
  { id: "d-lire-portefeuille", title: "Lire l'état du portefeuille multi-sites", role: "directeur", who: "Directeur Technique", view: "d-accueil",
    when: "Chaque matin avant 9 h, et à chaque notification « site Critique ».",
    steps: ["Ouvrez Accueil : une carte par hôtel affiche statut, alertes, conformité rondes, carburant et énergie.", "Repérez d'abord les cartes à bordure rouge (Critique) puis orange (À surveiller).", "Cliquez « Voir le détail » sur un hôtel pour ouvrir sa fiabilité équipements.", "Si l'autonomie carburant est < 7 jours, appelez le Responsable du site."],
    result: "Vous priorisez les sites en difficulté ; aucune donnée n'est modifiée.", tips: ["Un site « Bon » avec 0 % de rondes saisies n'est pas forcément sain : vérifiez la conformité.", "Comparez toujours l'autonomie, pas seulement le pourcentage de cuve : les consommations diffèrent par site."], keywords: "accueil hôtels statut portefeuille alerte" },
  { id: "d-comparer", title: "Comparer les 4 sites (benchmark)", role: "directeur", who: "Directeur Technique", view: "d-comparaison",
    when: "Revue hebdomadaire du lundi ou préparation d'un comité de direction.",
    steps: ["Ouvrez Comparaison.", "Choisissez l'indicateur : disponibilité, pannes ou cuves.", "Les barres sont triées du meilleur au moins bon ; le site le plus faible est surligné en rouge.", "Exportez via le bouton Imprimer pour le comité."],
    result: "Classement objectif des sites, base des plans d'action.", tips: ["Ne comparez pas des pannes brutes entre un hôtel de 330 zones et un plus petit : regardez la disponibilité (%)."], keywords: "comparaison benchmark disponibilité pannes cuves sites" },
  { id: "d-mtbf", title: "Analyser MTBF / MTTR d'un équipement", role: "directeur", who: "Directeur Technique", view: "d-fiabilite",
    when: "Quand un équipement dépasse 5 pannes sur 90 jours ou que le MTTR dépasse 24 h.",
    steps: ["Ouvrez Fiabilité et choisissez la période (30, 90, 180, 365 j).", "Lisez MTBF (temps moyen entre pannes = période / nb pannes) : rouge sous 10 j.", "Lisez MTTR (temps moyen de résolution) : un MTTR long signale un problème de pièces ou de prestataire.", "Décidez : contrat de maintenance, remplacement, ou formation."],
    result: "Décision de renouvellement ou de contrat ; la CF Cuisine Chaude (27 pannes, MTBF 3 j, MTTR 34,7 h) est le cas prioritaire.", tips: ["Un MTBF court + MTTR court = petites pannes répétées (cause racine non traitée).", "Un MTBF long + MTTR long (GE 1 : 45 j / 2,3 j) = attente de pièces : anticipez le stock."], keywords: "fiabilité mtbf mttr pannes équipement chambre froide" },
  { id: "d-maintenance", title: "Piloter le ratio préventif / correctif", role: "directeur", who: "Directeur Technique", view: "d-maintenance",
    when: "Clôture mensuelle et suivi des contrats.",
    steps: ["Ouvrez Maintenance portefeuille.", "Comparez préventif (3,8 M XOF) et correctif (90 k XOF).", "Vérifiez les vidanges groupes : heures restantes avant échéance.", "Relancez les contrats arrivant à échéance sous 30 jours."],
    result: "Budget maîtrisé et échéances contractuelles tenues.", tips: ["Cible hôtelière : au moins 70 % du budget en préventif.", "Une vidange dépassée annule souvent la garantie constructeur CAT."], keywords: "maintenance préventif correctif contrat vidange" },
  { id: "d-equipe", title: "Évaluer techniciens et prestataires", role: "directeur", who: "Directeur Technique", view: "d-equipe",
    when: "Entretien trimestriel ou renouvellement d'un prestataire.",
    steps: ["Ouvrez Équipe.", "Comparez nombre d'interventions, durée moyenne et coût.", "Repérez les prestataires externes au coût/heure élevé.", "Partagez le classement avec le Responsable de site."],
    result: "Base factuelle pour renégocier un contrat ou réaffecter les missions.", tips: ["Une durée longue chez un prestataire inclut souvent son délai de déplacement : exigez un SLA."], keywords: "équipe technicien prestataire performance coût" },
  { id: "d-energie", title: "Suivre l'énergie et les fluides", role: "directeur", who: "Directeur Technique", view: "d-energie",
    when: "Chaque semaine et à réception des factures distributeurs.",
    steps: ["Ouvrez Énergie et choisissez le mois.", "Lisez chaque fluide par distributeur (Senelec/SDE, CIE/SODECI, ENEO/CDE, SBEE/SONEB).", "Contrôlez le cos φ : sous 0,90 le distributeur peut pénaliser.", "Cliquez « Définir les objectifs » pour fixer les cibles mensuelles."],
    result: "Objectifs enregistrés ; les jauges passent orange à 90 % et rouge au-delà.", tips: ["Cos φ 0,86 à Dakar : prévoir une batterie de condensateurs.", "Rapportez la conso au nombre de chambres occupées pour comparer les mois."], keywords: "énergie électricité eau cos phi distributeur objectif gaz butane gasoil" },
  { id: "d-rapport", title: "Produire le rapport de consommation mensuel", role: "directeur", who: "Directeur Technique", view: "d-rapport",
    when: "Le 1er jour ouvré de chaque mois.",
    steps: ["Ouvrez Rapport conso et sélectionnez le mois avec les flèches.", "Vérifiez le référentiel : pannes actives, coût total, sites en alerte.", "Cliquez « Imprimer / PDF » pour transmettre à la direction générale."],
    result: "Synthèse financière (ex. 130 500 FCFA à Dakar) diffusée.", tips: ["« Coût non saisi » signifie que la livraison carburant n'a pas de prix : complétez-le dans Commandes."], keywords: "rapport conso mensuel synthèse financière pdf" },
  // Responsable
  { id: "r-fioul", title: "Surveiller la jauge fioul et l'autonomie", role: "responsable", who: "Responsable Technique (Dakar)", view: "r-dashboard",
    when: "Chaque jour ; obligatoirement sous 30 % de cuve.",
    steps: ["Ouvrez Tableau de bord : la jauge indique %, litres et jours d'autonomie.", "Sous 30 %, la jauge passe orange ; sous 15 %, rouge.", "Cliquez « Commander du gasoil » : un bon de commande Carburant urgent est pré-rempli.", "À la livraison, cliquez « Enregistrer une livraison » pour remonter le niveau."],
    result: "Bon de commande créé dans Commandes ; niveau et autonomie recalculés.", tips: ["Commandez à 8 jours d'autonomie : les délais fournisseurs à Dakar peuvent atteindre 72 h.", "Jaugez physiquement une fois par semaine pour recaler la sonde."], keywords: "fioul gasoil cuve jauge carburant autonomie" },
  { id: "r-affecter", title: "Affecter un signalement (interne ou prestataire)", role: "responsable", who: "Responsable Technique (Dakar)", view: "r-signalements",
    when: "Dès qu'une carte arrive dans la colonne Ouvert.",
    steps: ["Ouvrez Signalements & Kanban.", "Cliquez « Affecter » sur la carte.", "Choisissez Interne (technicien) ou Prestataire externe.", "Cliquez « Envoyer la mission WhatsApp » : le message prêt à envoyer s'ouvre dans WhatsApp."],
    result: "La carte passe En cours, le compteur MTTR démarre, le technicien reçoit la mission.", tips: ["Affectez en moins de 15 min : chaque minute compte dans le MTTR.", "Panne bloquante en cuisine : prévenez aussi le Chef pour transférer les denrées."], keywords: "signalement kanban affecter prestataire mission whatsapp" },
  { id: "r-commande", title: "Créer et valider un bon de commande", role: "responsable", who: "Responsable Technique (Dakar)", view: "r-commandes",
    when: "Besoin de pièce, carburant ou prestation.",
    steps: ["Cliquez « Nouvelle demande ».", "Renseignez catégorie, quantité, équipement, motif, coût et degré d'urgence.", "La demande apparaît « En attente » : cliquez Approuver (ou Annuler).", "À réception, cliquez « Marquer livré »."],
    result: "Numéro BC-2026-XXXX généré ; la synthèse mensuelle par catégorie est mise à jour.", tips: ["Indiquez toujours l'équipement : c'est ce qui alimente le coût par équipement.", "N'utilisez « Urgent » que pour un risque d'arrêt d'exploitation."], keywords: "commande achat bon approuver annuler livré" },
  { id: "r-releves", title: "Consulter les relevés et générer un lien sécurisé", role: "responsable", who: "Responsable Technique (Dakar)", view: "r-releves",
    when: "Chaque heure de ronde ou pour envoyer un relevé à un technicien.",
    steps: ["Ouvrez Relevés horaires : les 21 valeurs saisies s'affichent, hors seuil en rouge.", "Cliquez une ligne pour ouvrir le tiroir d'inspection (seuils, historique).", "Cliquez « Générer un lien sécurisé » : le lien est valide 4 h.", "Copiez-le ou envoyez-le par WhatsApp au technicien."],
    result: "Le technicien saisit les valeurs sur releve.html sans compte ; elles remontent ici.", tips: ["Un lien expiré ne fonctionne plus : régénérez-le au lieu de réutiliser l'ancien."], keywords: "relevé horaire lien sécurisé 4h valeurs seuil" },
  { id: "r-config", title: "Configurer zones, seuils, contacts et affiche QR", role: "responsable", who: "Responsable Technique (Dakar)", view: "r-config",
    when: "À l'ouverture du site, puis à chaque nouvel équipement.",
    steps: ["Zones & Lieux : vérifiez les 330 zones par étage.", "Seuils : ajustez min/max d'une mesure puis Enregistrer.", "Contacts & Alertes : indiquez qui reçoit les alertes WhatsApp.", "Affiche : téléchargez l'affiche QR Madame T Dakar et imprimez-la en A4."],
    result: "Alertes hors seuil et signalements clients redirigés vers les bons contacts.", tips: ["Affichez le QR dans chaque office et local technique, à hauteur d'yeux.", "Un seuil trop large masque les dérives : partez des valeurs constructeur."], keywords: "configuration zones seuils contacts affiche qr code" },
  // Technicien
  { id: "t-saisie", title: "Ouvrir le menu du bot (« Saisie »)", role: "technicien", who: "Technicien terrain", view: "t-bot",
    when: "En début de poste et pour toute saisie.",
    steps: ["Dans WhatsApp, ouvrez la conversation GenTrack.", "Tapez « Saisie ».", "Le bot répond avec les 6 options ; tapez le chiffre voulu."], result: "Le menu principal s'affiche.", tips: ["Tapez « menu » à tout moment pour revenir au début."], keywords: "saisie menu bot whatsapp" },
  { id: "t-ronde", title: "Réaliser la ronde journalière", role: "technicien", who: "Technicien terrain", view: "t-bot",
    when: "Une fois par poste, avant 10 h.",
    steps: ["Tapez « Saisie » puis « 1 ».", "Répondez à chaque question (valeur ou OK/NOK) : le bot vérifie le format.", "Une valeur hors seuil déclenche une alerte immédiate.", "À la fin, le bot récapitule la ronde."], result: "Ronde validée : la conformité rondes du site augmente.", tips: ["Lisez la valeur sur l'appareil, jamais de mémoire."], keywords: "ronde journalière questions validation" },
  { id: "t-releve", title: "Faire un relevé horaire (releve.html)", role: "technicien", who: "Technicien terrain", view: "t-bot",
    when: "Toutes les heures sur les équipements critiques.",
    steps: ["Tapez « Saisie » puis « 2 » : le bot envoie un lien sécurisé.", "Ouvrez le lien : 21 questions par équipement.", "Saisissez ; la barre de progression avance, un hors seuil s'affiche en rouge.", "Cliquez « Valider ce qui est renseigné »."], result: "Valeurs visibles par le Responsable dans Relevés horaires.", tips: ["Vous pouvez valider partiellement et compléter plus tard tant que le lien est valide."], keywords: "relevé horaire releve.html lien" },
  { id: "t-zones", title: "Faire une ronde de zones", role: "technicien", who: "Technicien terrain", view: "t-bot",
    when: "Selon le planning des zones (étages, locaux techniques).",
    steps: ["Tapez « Saisie » puis « 3 ».", "Choisissez la zone.", "Répondez OK ou NOK à chaque point ; NOK propose de déclarer une panne."], result: "Zone marquée contrôlée.", tips: ["Commencez par les locaux techniques, finissez par les étages clients."], keywords: "ronde zones étage" },
  { id: "t-panne", title: "Déclarer une panne (ticket REF)", role: "technicien", who: "Technicien terrain / personnel", view: "t-bot",
    when: "Dès constat d'un dysfonctionnement, fuite, odeur de gaz ou alarme.",
    steps: ["Tapez « Saisie » puis « 4 ».", "Choisissez l'équipement (1 à 7).", "Qualifiez la panne (arrêt total, dégradé, bruit/fuite, sécurité).", "Décrivez en une phrase, puis joignez une photo nette de l'équipement.", "Le bot crée le ticket REF-XXXX."], result: "Carte Ouvert créée dans le Kanban du Responsable, notification WhatsApp envoyée.", tips: ["Fuite de gaz : coupez la vanne, aérez, évacuez, PUIS déclarez en « Sécurité ».", "Photo : cadrez la plaque signalétique et le défaut, sans flou."], keywords: "déclarer panne fuite gaz ticket ref photo" },
  { id: "t-suivi", title: "Suivre et prendre en charge ses signalements", role: "technicien", who: "Technicien terrain", view: "t-bot",
    when: "Après une affectation ou en reprise de poste.",
    steps: ["Tapez « Saisie » puis « 5 » : la liste de vos tickets s'affiche.", "Tapez « OK TOUT » pour une prise en charge groupée, ou « OK REF-1326 » pour un seul.", "Ouvrez le lien unique d'intervention pour clôturer (rapport.html)."], result: "Tickets passés En cours ; le Responsable voit la prise en charge.", tips: ["« AFFECTER REF-1327 Willo » réaffecte un ticket à un collègue."], keywords: "suivi signalements pec ok ref affecter" },
  { id: "t-rapport", title: "Clôturer une intervention (rapport.html)", role: "technicien", who: "Technicien terrain", view: "t-bot",
    when: "Dès la fin des travaux.",
    steps: ["Ouvrez le lien d'intervention.", "Ajoutez la photo avant, décrivez les travaux, coût en FCFA et durée.", "Ajoutez la photo après.", "Cliquez « Clôturer l'intervention »."], result: "Ticket Résolu, MTTR calculé, accusé envoyé au Responsable.", tips: ["Indiquez le coût réel des pièces : il alimente la synthèse financière."], keywords: "rapport clôture intervention photo coût durée" },
  { id: "t-bilan", title: "Envoyer le bilan de fin de journée", role: "technicien", who: "Technicien terrain", view: "t-bot",
    when: "En fin de poste.",
    steps: ["Tapez « Saisie » puis « 6 ».", "Le bot résume vos interventions du jour.", "Indiquez les blocages (pièce manquante, accès refusé) ou « RAS »."], result: "Bilan transmis au Responsable ; blocages visibles le lendemain.", tips: ["Signalez toujours une pièce manquante : c'est ce qui déclenche la commande."], keywords: "bilan fin de journée blocage clôture" },
];

export const VIEW_LABELS: Record<ViewId, string> = {
  "d-accueil": "Accueil multi-sites", "d-comparaison": "Comparaison", "d-fiabilite": "Fiabilité & Métrologie", "d-maintenance": "Maintenance portefeuille",
  "d-equipe": "Équipe", "d-energie": "Énergie multi-sites", "d-rapport": "Rapport conso",
  "r-dashboard": "Tableau de bord", "r-signalements": "Signalements & Kanban", "r-commandes": "Commandes & Achats", "r-releves": "Relevés horaires", "r-config": "Configuration",
  "t-bot": "Bot WhatsApp & formulaires",
};

export const ROLE_VIEWS: Record<Role, ViewId[]> = {
  directeur: ["d-accueil", "d-comparaison", "d-fiabilite", "d-maintenance", "d-equipe", "d-energie", "d-rapport"],
  responsable: ["r-dashboard", "r-signalements", "r-commandes", "r-releves", "r-config"],
  technicien: ["t-bot"],
};

export const TOUR: { role: Role; view: ViewId; target: string; title: string; text: string }[] = [
  { role: "directeur", view: "d-accueil", target: "role-switch", title: "Choisissez votre profil", text: "Basculez entre Directeur, Responsable et Technicien : chaque profil a ses écrans et ses actions." },
  { role: "directeur", view: "d-accueil", target: "mode-switch", title: "Démonstration ou Guide", text: "En mode Guide, chaque écran affiche à droite ses Fiches Action : qui, quand, comment, résultat, pièges." },
  { role: "directeur", view: "d-accueil", target: "search", title: "Cherchez une procédure", text: "Tapez « approuver une commande » ou « fuite de gaz » pour ouvrir la bonne fiche." },
  { role: "directeur", view: "d-accueil", target: "hotels", title: "Portefeuille des 4 hôtels", text: "Chaque carte résume statut, alertes, rondes, carburant. Dakar est Critique : à traiter en premier." },
  { role: "responsable", view: "r-dashboard", target: "fuel", title: "Jauge fioul", text: "46 % · 4 600 L · 8,8 jours. Commandez du gasoil directement depuis la jauge." },
  { role: "responsable", view: "r-signalements", target: "kanban", title: "Kanban des signalements", text: "Ouvert → En cours → Résolu. Cliquez « Affecter » pour envoyer une mission WhatsApp." },
  { role: "responsable", view: "r-commandes", target: "cmd-new", title: "Bons de commande", text: "Créez une demande, approuvez-la, puis marquez-la livrée à réception." },
  { role: "technicien", view: "t-bot", target: "phone", title: "Bot WhatsApp GenTrack", text: "Tapez « Saisie » ou utilisez les boutons : le bot répond comme le vrai. Essayez « 4 » pour déclarer une panne." },
];
