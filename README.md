# Genstay Operations Compass

Application web : Guide Interactif et Manuel Opérationnel GenTrack — Pilotage Équipements & Maintenance Hôtelière.

Demandes utilisateur :
"on peux commerc comme ca il faut ien resper les couelrud GenTrack"
"tout les partie whatsapa que je taie envoye sont cote tehcneicence la, change et met de svrais image dequopment"
"et decrire bien les actions"

### Locked (Spécifications strictes à respecter)

1. Charte graphique et couleurs officielles GenTrack :
- En-têtes, Sidebar et mode sombre technique : Brun/Anthracite profond `#1A1411` et `#121110`.
- Couleur d'accentuation or/ocre GenTrack : `#C9A84C` et or chaud `#D4AF37` pour le logo "GENTRACK PILOTAGE ÉQUIPEMENTS", les badges actifs, les icônes clés et les boutons d'action majeurs.
- Fond principal clair des tableaux de bord : Ivoire / Crème technique `#F9F6EE` / `#FAF7F2` avec bordures douces `#E6DFD5`.
- Indicateurs de statuts :
  * Vert `#16A34A` (Bon, Livré, Objectif tenu, Résolu, Rondes validées).
  * Orange `#EA580C` (À surveiller, Urgent, Dépassement modéré).
  * Rouge `#DC2626` (Critique, Hors seuil, Panne bloquante, Dépassement budget).
- Typographie : Sans-serif moderne, nette et technique (Inter ou Manrope) avec hiérarchie claire des chiffres (KPIs en grand avec unités précises).

2. Les 3 Espaces / Profils avec sélecteur de rôle interactif :
- **Directeur Technique (Multi-sites)** :
  * Supervision du portefeuille des 4 hôtels : Madame T Dakar, Madame T Abidjan, Madame T Douala, MADAMETEBEN.
  * Modules complets :
    - *Accueil multi-sites* : Cartes par hôtel avec statut, alertes, conformité rondes, carburant restant, énergie.
    - *Comparaison* : Benchmark croisé des 4 sites sur la disponibilité, les pannes et les cuves.
    - *Fiabilité & Métrologie* : Analyse MTBF / MTTR par équipement (ex. Chambre Froide Cuisine Chaude : 27 pannes en 90j, MTBF 3j, MTTR 34,7h ; GE 1 Cat : MTBF 45j, MTTR 2,3j).
    - *Maintenance portefeuille* : Ratios Préventif vs Correctif (3,8M vs 90k XOF), 39 interventions clôturées, suivi des contrats et vidanges.
    - *Équipe* : Performance comparée des techniciens et prestataires externes (durée moyenne, coûts).
    - *Énergie multi-sites* : Suivi des distributeurs (CIE/SODECI, ENEO/CDE, SBEE/SONEB, Senelec/SDE), bâche potable, cosinus phi (0,86), cuves gasoil et gaz butane.
    - *Rapport conso* : Synthèse financière mensuelle (130 500 FCFA total à Dakar, référentiel de performance avec statut Critique/Bon).
- **Responsable Technique (Site de Dakar)** :
  * Supervision locale et exploitation quotidienne :
    - *Tableau de bord* : Jauge fioul interactive (46% · 4 600 L · 8,8 jours d'autonomie), 7 alertes actives, équipements surveillés.
    - *Signalements & Kanban* : Flux Ouvert / En cours / Résolu avec modal d'affectation (Interne vs Prestataire externe) et envoi de mission WhatsApp.
    - *Commandes & Achats* : Gestion des bons de commande (BC-2026-XXXX), formulaire de demande avec degré d'urgence, validation financière (Approuver / Annuler), passage à "Marqué livré", synthèse mensuelle par catégorie.
    - *Relevés horaires* : Consultation des 21 valeurs saisies, génération de liens sécurisés valides 4h, tiroir latéral d'inspection.
    - *Configuration* : Zones & Lieux (330 zones réparties par étages), Équipements & Rondes, Seuils min/max, Contacts & Alertes, et affiche officielle de signalement Madame T Dakar avec QR code.
- **Technicien Terrain (Exécution Mobile & Bot WhatsApp)** :
  * Simulateur interactif de smartphone reproduisant le parcours réel :
    - *Bot WhatsApp officiel GenTrack* : Menu principal activé par le mot-clé "Saisie" avec les 6 options exactes :
      1. Ronde journalière (questions séquentielles avec validation).
      2. Relevé horaire (envoi du lien sécurisé vers `releve.html`).
      3. Ronde de zones.
      4. Déclarer une panne (choix de l'équipement 1 à 7, qualification de la panne, ajout de photo réelle et génération de ticket REF-XXXX).
      5. Suivi des signalements (PEC groupée, liens uniques d'intervention).
      6. Bilan de fin de journée (clôture des interventions, remontée des blocages).
    - *Commandes instantanées WhatsApp* : `OK REF-1326`, `AFFECTER REF-1327 Willo`.
    - *Formulaires web mobiles intégrés* :
      * `releve.html` : 21 questions réparties par équipement avec progression tactile en temps réel, alertes hors seuil, et bouton "Valider ce qui est renseigné".
      * `rapport.html` : Clôture d'intervention avec photo avant, saisie des travaux, coût en FCFA, durée, photo après et accusé de notification.
    - *Photos d'équipements* : Uniquement de VRAIES photos professionnelles d'équipements techniques hôteliers (groupe électrogène Caterpillar, compresseurs industriels, chambre froide, manomètres, tableaux électriques TGBT, bâche à eau, tuyauterie). Aucune photo de test floue ou de clavier.

3. "Décrire bien les actions" (Demande explicite) :
- Chaque écran, bouton, commande WhatsApp et formulaire doit intégrer un panneau ou un volet explicatif "Fiche Action Opérationnelle" détaillant :
  * **Qui effectue l'action** (Rôle).
  * **Quand la déclencher** (Fréquence, incident, seuil atteint).
  * **Procédure étape par étape** (Comment la réaliser concrètement).
  * **Résultat attendu / Impact système** (Notification envoyée, statut modifié, métrique MTTR impactée, bon de commande généré).
  * **Bonnes pratiques et pièges à éviter** (Conseils métier hôtellerie).
- Inclure un mode "Visite Guidée / Découverte des actions" pas-à-pas avec des bulles interactives explicatives.

### Open (Liberté de conception et d'ergonomie)

- Ajouter une barre de recherche globale d'actions/procédures (ex: "Comment approuver une commande", "Comment faire un relevé horaire", "Déclarer une fuite de gaz").
- Proposer un simulateur de bot WhatsApp interactif où l'utilisateur peut taper ou cliquer sur les options (1, 2, 4...) et voir le bot répondre dynamiquement avec les vraies réponses GenTrack.
- Intégrer un visualiseur et téléchargeur de l'Affiche QR Code officielle Madame T Dakar et des fiches d'intervention PDF imprimables.
- Permettre de basculer facilement entre vue "Démonstration immersive" (interface réelle de l'outil) et vue "Documentation & Guide pédagogique".

build a real working app, not a clickable prototype; the screen and kit files show layout, content and look (a wireframe's, structure only) and are never code to copy. The screens are the moments the user designed, not the whole product. Before building, walk through each flow as its user would and design what the pictures leave out, as a product designer would for this product: the steps a flow needs to finish and how the app responds to what the user does, including the moments its users will actually run into, like waiting on something or finding nothing yet. Add nothing a user of this product would never meet, and keep an app the user wants simple, simple. Never leave a step the product's core flows need as "coming soon", unless the brief says the user chose to. Where such a step needs an outside service, build every part up to it and say in your reply what's left to connect. Fill product gaps only, never a look the design set: an added step reuses the UI kit's tokens, chrome and parts and the nearest designed screen's layout, with no new visual direction. Look at every screen's picture before writing code; design.md says which picture or sheet holds each screen. Build and check each screen at the canvas it was drawn at: desktop 1280x832 and mobile 393x764. End your reply with "Changed from the mockups": each deliberate change and why, and "Added beyond the mockups": each step, state or interaction you built that no screen shows.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/92271bed-cf2e-48b8-80c4-7d8cceecabd9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
