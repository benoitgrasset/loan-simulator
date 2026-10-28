/** Texte légal affiché une seule fois dans le footer (tous les onglets). */
export const APP_DISCLAIMER =
  "Les calculs sont donnés à titre indicatif et n’ont pas de valeur contractuelle. " +
  "Ils ne remplacent pas un conseil financier, fiscal ou juridique personnalisé " +
  "et ne constituent pas une offre de prêt ni un engagement d’un établissement bancaire.";

const AppDisclaimer = () => (
  <p id="app-disclaimer" className="mt-2 text-xs text-gray-500 text-pretty">
    {APP_DISCLAIMER}
  </p>
);

export default AppDisclaimer;
