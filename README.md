# loan-simulator

## TODO

- [ ] Brancher `react-hook-form` sur les simulateurs (déjà en dépendance, pas utilisé)
- [ ] Couvrir les calculs par des tests unitaires (amortissement, PTZ, frais sur l’apport, assurance)
- [ ] Aligner `InvestmentSimulator` sur les composants `Card`, `Input`, `StatTile`
- [ ] Rendre les graphiques accessibles (aujourd’hui mockés dans les tests a11y)
- [ ] Installer le skill `better-accessibility` (cité par `better-interface`, absent du dépôt)
- [ ] Capturer le produit dans `PRODUCT.md` / `DESIGN.md` (`/impeccable init`)
- [ ] Persister tout le formulaire crédit (seul le taux et la durée le sont, via Zustand)

## Description

Simulateur financier immobilier dans le navigateur. Deux parcours :

- **Crédit immobilier** : valeur du bien, apport, PTZ, taux, assurance emprunteur, charges, frais (notaire, courtier, etc.) et plan d’amortissement.
- **Investissement Denormandie** : rentabilité d’un investissement locatif.

Les calculs sont indicatifs, pas un engagement contractuel.

## Stack

| | |
| --- | --- |
| UI | React 19, TypeScript, Vite 6 |
| Styles | Tailwind CSS 4 |
| Graphiques | Chart.js, react-chartjs-2 |
| État | Zustand (taux et durée) |
| Tests | Vitest, Testing Library, axe-core, happy-dom |
| Qualité | ESLint, `eslint-plugin-jsx-a11y`, Prettier |
| Package manager | Yarn 1.22 |

## Prérequis

- **Node.js** 20 ou plus (la CI utilise Node 20)
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

| Commande | Rôle |
| --- | --- |
| `yarn dev` | Serveur de développement |
| `yarn build` | Build de production |
| `yarn preview` | Prévisualiser le build |
| `yarn lint` | ESLint (dont jsx-a11y) |
| `yarn test` | Vitest en watch |
| `yarn test:run` | Vitest, une seule passe (CI) |

La CI a11y tourne sur chaque pull request (`.github/workflows/a11y.yml`) : lint puis tests.

## Skills (`.agents/skills/`)

| Skill | Rôle |
| --- | --- |
| `impeccable` | Conception et raffinage d’interface : direction, polish, audit, layout, typo, couleur, motion, copy. |
| `better-interface` | Revue transversale : orchestre les skills `better-*` (layout, writing, typography, color, UI). |
| `better-layout` | Groupement, alignement, ordre de lecture, structure responsive, place pour les traductions. |
| `better-writing` | Textes d’interface : libellés, erreurs, états vides, confirmations, voix du produit. |
| `better-typography` | Rendu du texte : échelle, espacement, césure, troncature, ponctuation. |
| `better-colors` | Système de couleur : palettes, tokens sémantiques, formats, contraste. |
| `better-ui` | Finition visuelle : rayons, ombres, icônes, alignement optique, motion. |
