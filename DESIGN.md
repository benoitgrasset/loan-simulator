---
name: Simulateur financier immobilier
description: Interface sobre et lisible pour décider d’une charge mensuelle réelle, sans posture commerciale.
colors:
  canvas: "#f9fafb"
  surface: "#ffffff"
  text-primary: "#111827"
  text-secondary: "#4b5563"
  text-muted: "#6b7280"
  border-default: "#d1d5db"
  accent-loan: "#1d4ed8"
  accent-loan-deep: "#1e40af"
  accent-loan-subtle: "#eff6ff"
  accent-investment: "#16a34a"
  accent-investment-deep: "#166534"
  accent-focus: "#2563eb"
  capital: "#059669"
  capital-strong: "#047857"
  interest: "#e11d48"
  interest-strong: "#be123c"
  chart-loan: "#1d4ed8"
  chart-insurance-monthly: "#93c5fd"
  chart-insurance-total: "#fda4af"
  chart-charges: "#f59e0b"
  chart-energy: "#14b8a6"
  chart-other: "#9ca3af"
  tooltip: "#111827"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  stat-value:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
rounded:
  control: "0.5rem"
  surface: "0.75rem"
  segment: "10px"
spacing:
  page-x: "1rem"
  page-x-sm: "1.5rem"
  page-x-lg: "2rem"
  section: "1.5rem"
  card: "1.25rem"
  control-y: "0.75rem"
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.surface}"
    padding: "{spacing.card}"
  button-tab-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent-loan}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
  stat-tile-accent:
    textColor: "{colors.accent-loan}"
    typography: "{typography.stat-value}"
---

# Design System : Simulateur financier immobilier

## Overview

**Creative North Star : « Le salon privé »**

Interface calme, factuelle, presque bancaire mais sans marketing : fond gris clair, surfaces blanches, chiffres en `tabular-nums`, accents bleus (crédit) ou verts (Denormandie) réservés aux en-têtes de parcours et aux montants clés. L’utilisateur doit lire une mensualité crédible en un coup d’œil, pas être « vendu » un produit.

**Caractéristiques clés :**

- Stack UI partagée (`Card`, `Input`, `StatTile`, `ValueRow`) sur le parcours crédit ; Denormandie reste partiellement legacy (voir Do's and Don'ts).
- Tokens sémantiques dans `src/index.css` (`@theme static`) ; le reste repose sur la palette Tailwind par défaut.
- Profondeur par ombre légère (`shadow-card`) et empilement blanc sur `gray-50`, pas de glassmorphism ni de dégradés hors bannières de parcours.
- Icônes **Lucide**, taille 16 px dans les contrôles, 32 px dans les héros.
- Motion courte (`150–200ms`, `ease-out`), scale au clic sur les boutons (`motion-safe`).

## Colors

Palette utilitaire : neutres Tailwind pour le texte et les bordures ; bleu pour le crédit et le focus ; vert pour l’investissement ; émeraude / rose pour capital vs intérêts dans les graphiques.

### Primary (parcours crédit & focus)

- **Bleu crédit** (`blue-700` / `#1d4ed8`) : titres de stats accent, radios sélectionnés, anneau de focus des champs, courbe « capital restant dû ».
- **Bleu profond** (`blue-800` / `#1e40af`) : dégradé de bannière crédit (`from-blue-700 to-blue-800`).
- **Bleu discret** (`blue-50` / `#eff6ff`) : fond des `ValueRow` en ton `accent`.

### Secondary (parcours investissement)

- **Vert Denormandie** (`green-600`–`green-800`) : bannière et onglet actif (`TabButton` `activeColor="green"`).

### Sémantique financière (graphiques & tuiles)

- **Capital** (`--color-capital` → `emerald-600`) : barres capital, parts « emprunt » dans les camemberts.
- **Intérêts** (`--color-interest` / `--color-interest-strong` → `rose-600` / `rose-700`) : barres intérêts, tuile « coût du crédit », parts assurance totale.
- **Séries camembert** : `--color-chart-*` dans `src/index.css` (prêt, assurance mensuelle, charges, énergie, autre).

### Neutral

- **Fond page** (`gray-50`) : `body` / `main`.
- **Surface** (`white`) : cartes, nav, footer, onglets actifs.
- **Texte** : `gray-900` (titres), `gray-800` (titres de cartes), `gray-700` (labels), `gray-600` (secondaire), `gray-500` (hints, symboles d’unité).
- **Bordures** : `gray-200` (nav, footer), `gray-300` (inputs, pagination tableau).

### Règle nommée

**La règle du parcours coloré.** Chaque simulateur a une seule couleur d’en-tête (bleu ou vert). Ne pas mélanger les deux sur un même écran hors navigation globale.

## Typography

**Display / corps :** pile système Tailwind (`ui-sans-serif, system-ui, sans-serif`) — pas de police web chargée.

**Caractère :** dense mais aéré ; titres serrés (`tracking-[-0.01em]` / `[-0.02em]` sur les gros chiffres) ; copy en français avec apostrophe typographique dans l’UI crédit.

### Hierarchy

- **Display** (700, `text-2xl`, ~1.25) : `h1` des bannières de parcours.
- **Title** (600, `text-lg`) : titres de `Card` / `Dialog`.
- **Stat** (600, `text-2xl`, tabular-nums) : valeurs dans `StatTile`.
- **Body** (400–500, `text-sm`) : paragraphes, hints, cellules de tableau.
- **Label** (500, `text-sm`, `mb-2`) : `Label` au-dessus des `Input`.
- **Table header** (500, `text-xs`, uppercase, `tracking-wider`) : `TableHeader`.

Utilitaires récurrents : `text-balance` sur les titres longs, `text-pretty` sur les hints et le footer.

## Layout

- **Conteneur** : `max-w-7xl`, centré, padding horizontal `px-4 sm:px-6 lg:px-8`, vertical `py-6` sur le `main`.
- **Rythme vertical** : `space-y-6` entre les blocs d’un simulateur.
- **Grilles** :
  - Stats : `grid` 1 → 2 (`sm`) → 4 (`xl`) colonnes, `gap-4`.
  - Formulaire + graphiques crédit : `lg:grid-cols-3` (1 col formulaires, 2 cols visualisations).
- **Nav** : barre blanche `border-b`, titre à gauche, segment d’onglets à droite (`flex-wrap` sur petits écrans).

## Elevation & Depth

Hybride : fond `gray-50` + surfaces blanches + ombre douce. Pas de élévation au survol des cartes.

### Shadow vocabulary

- **Carte** (`shadow-card`, `src/index.css`) : contour 1 px `oklch(0 0 0 / 0.06)` + ombres légères — `Card`, `StatTile`.
- **Nav / onglet actif** : `shadow-sm` sur la barre ou le segment actif.
- **Dialog** : `shadow-2xl`, backdrop `gray-950/40`.

### Focus & sélection (global, `src/index.css`)

- `outline` 2 px `blue-600`, offset 2 px sur `:focus-visible`.
- `accent-color` et caret `blue-600`.
- Sélection texte : fond `blue-100`, texte `blue-900`.

### Motion (hors frontmatter)

- Transitions 150 ms (`border`, `ring`, `color`, `background`) sur inputs et boutons.
- Dialog : opacity + scale 0.96 → 1, 200 ms, `motion-safe`.
- Bouton : `active:scale-[0.96]` sauf prop `static` sur `Button`.

## Shapes

- **Surfaces** : `rounded-xl` (12 px) cartes, bannières, dialog.
- **Champs & lignes** : `rounded-lg` (8 px) inputs, `ValueRow`, boutons de pagination tableau.
- **Segments** : `rounded-[10px]` pour `RadioButtonGroup` et le groupe d’onglets dans `App`.
- **Radios / onglets** : option active = pastille blanche `rounded-md` dans un rail `bg-gray-100 p-1`.
- **Bordures** : cartes `border-transparent` (l’ombre définit le contour) ; inputs `border-gray-300`.

## Components

Composants dans `src/components/ui/`. Préférer les réutiliser plutôt que recopier des classes Tailwind dans les écrans.

### Button (`Button`)

- Base : curseur pointeur, transition 150 ms, scale au clic si non `static`.
- Usage typique : icône seule (paramètres frais), fermeture dialog, pagination — styles passés via `className`.

### TabButton

- Segment : inactif `text-gray-600`, actif `bg-white` + texte selon `activeColor` (`blue` | `green` | …) + `shadow-sm`.
- Icône Lucide `h-4 w-4`, libellé `text-sm font-medium`.

### Card

- En-tête : titre + description optionnelle + slot `actions` (ex. radio type de bien + bouton réglages).
- Corps : slot `children` avec `mb-4` sous l’en-tête si présent.

### Input

- `type="number"`, `tabular-nums`, symbole d’unité en overlay à droite (`text-gray-500`).
- Focus : `ring-2 ring-blue-600`, bordure transparente ; hover bordure `gray-400`.

### StatTile / StatGroup

- `tone` : `neutral` (défaut), `accent` (`text-blue-700`), `interest` (`text-interest-strong`).
- `StatGroup` : `aria-label` + grille configurable via `className`.

### ValueRow

- Fond `gray-50` ou `blue-50` si `accent` ; valeur `strong` en `font-semibold text-gray-900`.

### RadioButtonGroup / Radio

- Rail gris ; option sélectionnée = même langage que l’onglet actif (blanc + bleu).
- Tooltip au survol/focus : `bg-gray-900`, `text-xs`, `whitespace-pre-line`.

### Dialog

- `<dialog>` natif, `max-w-md`, titre `text-lg font-semibold`.

### Graphiques

- **LoanChart** : lit les couleurs via `readCssColor()` (`src/utils/colors.ts`) pour compatibilité Chart.js.
- **CostPieChart** : tranches alimentées par les tokens `--color-chart-*`.

### Tableau d’amortissement

- Carte `Card` ; en-têtes `TableHeader` ; pagination avec boutons bordure `gray-300`.

## Do's and Don'ts

**Do**

- Réutiliser `Card`, `Input`, `StatTile`, `ValueRow`, `Button`, `Dialog` pour tout nouvel écran.
- Ajouter les couleurs de données dans `@theme` (`src/index.css`) et les consommer en CSS var ou via `readCssColor` dans Chart.js.
- Garder les montants en `tabular-nums` et le formatage via `formatCurrency` / utilitaires existants.
- Respecter `max-w-7xl` et le rythme `space-y-6` / `gap-4`–`gap-6`.
- Associer chaque parcours à une couleur de bannière cohérente (bleu crédit, vert investissement).

**Don't**

- Ne pas introduire une troisième couleur d’accent dominante sur un écran (pas de violet/orange en héros sans alignement produit).
- Ne pas charger de police display décorative : la lisibilité des chiffres prime.
- Ne pas dupliquer `shadow-card` : utiliser la classe Tailwind générée depuis `--shadow-card`.
- Ne pas étendre le style « cartes colorées empilées » d’`InvestmentSimulator` sans le refactor vers les composants UI partagés (dette connue, voir README TODO).
- Ne pas coder les couleurs Chart.js en dur si un token `--color-*` ou sémantique existe déjà.

## Références code

| Élément | Fichier |
| --- | --- |
| Tokens `@theme`, base, focus | `src/index.css` |
| Fusion classes | `src/utils/tailwind.ts` (`cn` + `tailwind-merge`) |
| Shell app | `src/App.tsx` |
| Parcours crédit (référence UI) | `src/components/LoanSimulator.tsx` |
| Parcours investissement (partiel) | `src/components/InvestmentSimulator.tsx` |
