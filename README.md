# loan-simulator

## TODO

- [ ] Brancher `react-hook-form` sur les simulateurs (déjà en dépendance, pas utilisé)
- [ ] Couvrir les calculs par des tests unitaires (amortissement, PTZ, frais sur l’apport, assurance)
- [x] Aligner `InvestmentSimulator` sur `Card` et `Input` (KPI et détail : style d’origine)
- [ ] Rendre les graphiques accessibles (aujourd’hui mockés dans les tests a11y)
- [x] Capturer le produit dans `PRODUCT.md`
- [x] Capturer le système visuel dans `DESIGN.md`
- [ ] Persister tout le formulaire crédit (seul le taux et la durée le sont, via Zustand)

## Idées / non décidé

Pistes évoquées dans [`PRODUCT.md`](PRODUCT.md), **sans engagement** de livraison (pas de cases à cocher) :

- **i18n** — autre langue que le français
- **Comptes** — authentification, sauvegarde cloud
- **Export PDF** — partage ou archivage d’une simulation
- **Comparaison multi-scénarios** — plusieurs hypothèses côte à côte

**Qualité & confiance**

- **Golden files** — un ou deux jeux de chiffres figés (crédit + acheter vs louer) pour détecter les régressions de modèle
- **Constantes documentées** — bloc « d’où viennent les défauts » (ex. 337 k€, 190 k€) dans ce README ou dans `PRODUCT.md`, en lien avec `src/constants/index.ts`

## Description

Simulateur financier immobilier dans le navigateur. Deux parcours :

- **Crédit immobilier** : valeur du bien, apport, PTZ, taux, assurance emprunteur, charges, frais (notaire, courtier, etc.) et plan d’amortissement.
- **Investissement Denormandie** : rentabilité d’un investissement locatif.
- **Acheter vs louer** : patrimoine net acheteur / locataire, croisement des courbes.

Les calculs sont indicatifs, pas un engagement contractuel.

## Stack

|                 |                                              |
| --------------- | -------------------------------------------- |
| UI              | React 19, TypeScript, Vite 6                 |
| Styles          | Tailwind CSS 4                               |
| Graphiques      | Chart.js, react-chartjs-2                    |
| État            | Zustand (taux et durée)                      |
| Tests           | Vitest, Testing Library, axe-core, happy-dom |
| Qualité         | ESLint, `eslint-plugin-jsx-a11y`, Prettier   |
| Package manager | Yarn 1.22                                    |

## Prérequis

- **Node.js** 22 ou plus (la CI utilise Node 22)
- **Yarn** 1.22 (`yarn --version`)

## Lancer le projet

```bash
yarn install
yarn dev
```

L’app est servie par Vite, en général sur [http://localhost:5173](http://localhost:5173).

Build de production :

```bash
yarn build
yarn preview
```

## Scripts

| Commande            | Rôle                               |
| ------------------- | ---------------------------------- |
| `yarn dev`          | Serveur de développement           |
| `yarn build`        | Build de production                |
| `yarn typecheck`    | Vérification TypeScript (`tsc -b`) |
| `yarn preview`      | Prévisualiser le build             |
| `yarn lint`         | ESLint (dont jsx-a11y)             |
| `yarn format`       | Prettier (réécrit les fichiers)    |
| `yarn format:check` | Prettier en mode vérification (CI) |
| `yarn test`         | Vitest en watch                    |
| `yarn test:run`     | Vitest, une seule passe (CI)       |

La CI tourne sur chaque pull request (`.github/workflows/a11y.yml`) : lint, Prettier, typecheck, build, puis tests.

## Skills (`.agents/skills/`)

| Skill               | Rôle                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `impeccable`        | Conception et raffinage d’interface : direction, polish, audit, layout, typo, couleur, motion, copy. |
| `better-interface`  | Revue transversale : orchestre les skills `better-*` (layout, writing, typography, color, UI).       |
| `better-layout`     | Groupement, alignement, ordre de lecture, structure responsive, place pour les traductions.          |
| `better-writing`    | Textes d’interface : libellés, erreurs, états vides, confirmations, voix du produit.                 |
| `better-typography` | Rendu du texte : échelle, espacement, césure, troncature, ponctuation.                               |
| `better-colors`     | Système de couleur : palettes, tokens sémantiques, formats, contraste.                               |
| `better-ui`         | Finition visuelle : rayons, ombres, icônes, alignement optique, motion.                              |
