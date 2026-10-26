# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usage personnel : le titulaire du dépôt simule un achat immobilier réel (ménage, souvent à deux — l’assurance couple est le défaut). Pas un outil pour conseillers ni un produit grand public.

## Product Purpose

Décider si la **charge mensuelle réelle** est tenable : mensualité du crédit **avec assurance**, plus charges, électricité et taxe foncière. Le plan d’amortissement et le coût du projet servent cette décision, ils ne sont pas le job principal.

Succès : en quelques secondes, un montant mensuel unique et crédible, recalculé dès qu’un paramètre change.

## Positioning

Simulation **privée, dans le navigateur**, calée sur un scénario réel (neuf/ancien, PTZ, frais prélevés sur l’apport, assurance ×2). Ce n’est pas un comparateur de banques ni un devis courtier.

## Operating Context

Application Vite locale (ou hébergée), sans compte. Taux et durée sont partagés avec l’onglet Denormandie et persistés dans le navigateur (`localStorage`, clé `financial-storage`). Le reste du formulaire crédit est encore local à la session. Les calculs sont indicatifs, pas un engagement contractuel.

## Capabilities and Constraints

Confirmé :

- Crédit : bien, apport, type neuf/ancien, PTZ, taux, durée, assurance, charges, frais (notaire, courtier, garantie, dossier, travaux).
- Les frais diminuent l’apport ; le reliquat seul réduit l’emprunt.
- Assurance : taux annuel sur le capital emprunté, prime constante, ×2 pour un couple.
- Investissement Denormandie : second parcours ; formulaires via `Card` et `Input`, indicateurs et détail des calculs au style d’origine (icônes, couleurs).
- Acheter vs louer : comparaison du patrimoine net (équité du bien vs épargne placée), loyer, rémunération de l’épargne, revalorisation du bien, croisement des courbes sur un horizon donné ; taux et durée partagés avec les autres onglets.
- Pas de backend, pas d’auth, pas d’offre bancaire.

Non décidé : i18n, comptes, export PDF, comparaison multi-scénarios.

## Brand Commitments

Nom d’interface : « Simulateur financier immobilier ». Voix directe, sentence case, français. Aucune charte externe.

## Evidence on Hand

Le code et les constantes (`src/constants/index.ts`) sont la source des montants par défaut. Pas de témoignages, de benchmarks ni d’identité visuelle hors de l’app. Ne pas en inventer.

## Product Principles

1. La mensualité tout compris est le chiffre à croire en premier.
2. Les hypothèses du ménage (apport, frais, assurance, PTZ) restent visibles et éditables.
3. Recalcul immédiat, sans inscription.
4. Les chiffres sont indicatifs ; le produit ne se fait pas passer pour un prêteur.
5. Recalculer à partir d’hypothèses honnêtes (frais sur l’apport, assurance couple) plutôt que d’un taux unique « tout compris » opaque.

## Accessibility & Inclusion

Filet actuel : ESLint jsx-a11y, tests axe-core, CI sur les PR. Pas de niveau WCAG contractuel. Usage clavier et noms accessibles attendus sur les contrôles. Graphiques encore exclus des tests a11y.
