import { Scale } from "lucide-react";
import { useMemo, useState } from "react";
import {
  BUY_VS_RENT_HORIZON_YEARS,
  DEFAULT_DOWN_PAYMENT,
  DEFAULT_MONTHLY_CHARGES,
  DEFAULT_MONTHLY_RENT,
  DEFAULT_PROPERTY_APPRECIATION_RATE,
  DEFAULT_PROPERTY_TAX,
  DEFAULT_PROPERTY_VALUE,
  DEFAULT_SAVINGS_RETURN_RATE,
  NOTARY_RATE,
  PropertyType,
} from "../constants";
import { useFinancialStore } from "../stores/useFinancialStore";
import {
  calculateBuyVsRent,
  formatCurrency,
  formatRate,
  formatYears,
} from "../utils/calculations";
import BuyVsRentChart from "./BuyVsRentChart";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { StatGroup, StatTile } from "./ui/StatTile";
import { ValueRow } from "./ui/ValueRow";

const DEFAULT_PROPERTY_TYPE: PropertyType = "Ancien";

const BuyVsRentSimulator = () => {
  const { duration, setDuration, interestRate, setInterestRate } =
    useFinancialStore();

  const [propertyPrice, setPropertyPrice] = useState(DEFAULT_PROPERTY_VALUE);
  const [downPayment, setDownPayment] = useState(DEFAULT_DOWN_PAYMENT);
  const [propertyType] = useState<PropertyType>(DEFAULT_PROPERTY_TYPE);
  const [monthlyRent, setMonthlyRent] = useState(DEFAULT_MONTHLY_RENT);
  const [monthlyCharges, setMonthlyCharges] = useState(DEFAULT_MONTHLY_CHARGES);
  const [propertyTax, setPropertyTax] = useState(DEFAULT_PROPERTY_TAX);
  const [savingsReturnRate, setSavingsReturnRate] = useState(
    DEFAULT_SAVINGS_RETURN_RATE,
  );
  const [propertyAppreciationRate, setPropertyAppreciationRate] = useState(
    DEFAULT_PROPERTY_APPRECIATION_RATE,
  );
  const [horizonYears, setHorizonYears] = useState(BUY_VS_RENT_HORIZON_YEARS);

  const notaryFees = (propertyPrice * NOTARY_RATE[propertyType]) / 100;
  const monthlyOwnerCosts = monthlyCharges + propertyTax / 12;

  const simulation = useMemo(
    () =>
      calculateBuyVsRent({
        propertyPrice,
        downPayment,
        upfrontFees: notaryFees,
        interestRate,
        loanDurationYears: duration,
        horizonYears,
        monthlyRent,
        monthlyOwnerCosts,
        savingsReturnRate,
        propertyAppreciationRate,
      }),
    [
      propertyPrice,
      downPayment,
      notaryFees,
      interestRate,
      duration,
      horizonYears,
      monthlyRent,
      monthlyOwnerCosts,
      savingsReturnRate,
      propertyAppreciationRate,
    ],
  );

  const lastPoint = simulation.points[simulation.points.length - 1];
  const monthlyGap = simulation.monthlyOwnerTotal - simulation.monthlyRent;

  const crossoverHint =
    simulation.crossoverYear !== null
      ? `L’achat devient plus avantageux en patrimoine net à partir de l’année ${simulation.crossoverYear}`
      : `Pas de croisement sur ${formatYears(horizonYears)}`;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 p-6 text-white">
        <div className="mb-2 flex items-center gap-3">
          <Scale className="h-8 w-8 shrink-0" />
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-balance">
            Acheter ou louer ?
          </h1>
        </div>
        <p className="text-teal-100">
          Comparez le patrimoine net selon que vous achetez ou restez locataire
        </p>
      </div>

      <StatGroup
        label="Synthèse de la comparaison"
        className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatTile
          label="Croisement des courbes"
          value={
            simulation.crossoverYear !== null
              ? formatYears(simulation.crossoverYear)
              : "—"
          }
          hint={crossoverHint}
          tone="accent"
        />
        <StatTile
          label="Coût logement acheteur"
          value={formatCurrency(simulation.monthlyOwnerTotal)}
          hint={`Mensualité crédit + charges et taxe foncière (${formatCurrency(monthlyGap)} vs loyer)`}
        />
        <StatTile
          label={`Patrimoine achat (an ${lastPoint?.year ?? horizonYears})`}
          value={formatCurrency(lastPoint?.buyNetWorth ?? 0)}
          hint={`Revalorisation ${formatRate(propertyAppreciationRate)} / an`}
        />
        <StatTile
          label={`Patrimoine location (an ${lastPoint?.year ?? horizonYears})`}
          value={formatCurrency(lastPoint?.rentNetWorth ?? 0)}
          hint={`Épargne placée à ${formatRate(savingsReturnRate)} / an`}
          tone="interest"
        />
      </StatGroup>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card title="Logement">
            <div className="space-y-4">
              <Input
                label="Valeur du bien"
                value={propertyPrice}
                onChange={setPropertyPrice}
                symbol="€"
                step={1000}
              />
              <Input
                label="Apport"
                value={downPayment}
                onChange={setDownPayment}
                symbol="€"
                step={1000}
              />
              <Input
                label="Loyer mensuel (alternative location)"
                value={monthlyRent}
                onChange={setMonthlyRent}
                symbol="€/mois"
                step={50}
              />
              <Input
                label="Revalorisation annuelle du bien"
                value={propertyAppreciationRate}
                onChange={setPropertyAppreciationRate}
                symbol="%"
                step={0.1}
              />
            </div>
            <div className="mt-4 space-y-2">
              <ValueRow
                label="Frais de notaire estimés"
                hint={`Bien ${propertyType.toLowerCase()}, ${formatRate(NOTARY_RATE[propertyType])}`}
                value={formatCurrency(notaryFees)}
              />
              <ValueRow
                label="Montant emprunté"
                value={formatCurrency(simulation.loanAmount)}
                tone="accent"
              />
            </div>
          </Card>

          <Card title="Crédit & horizon">
            <div className="space-y-4">
              <Input
                label="Taux d’intérêt"
                value={interestRate}
                onChange={setInterestRate}
                symbol="%"
                step={0.05}
              />
              <Input
                label="Durée du prêt"
                value={duration}
                onChange={setDuration}
                symbol="ans"
                step={1}
              />
              <Input
                label="Horizon de comparaison"
                value={horizonYears}
                onChange={setHorizonYears}
                symbol="ans"
                step={1}
                min={1}
              />
            </div>
          </Card>

          <Card title="Épargne & charges propriétaire">
            <div className="space-y-4">
              <Input
                label="Rémunération de l’épargne"
                value={savingsReturnRate}
                onChange={setSavingsReturnRate}
                symbol="%"
                step={0.1}
              />
              <Input
                label="Charges mensuelles (hors crédit)"
                value={monthlyCharges}
                onChange={setMonthlyCharges}
                symbol="€/mois"
              />
              <Input
                label="Taxe foncière annuelle"
                value={propertyTax}
                onChange={setPropertyTax}
                symbol="€/an"
                step={50}
              />
            </div>
          </Card>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-2">
          <BuyVsRentChart
            points={simulation.points}
            crossoverYear={simulation.crossoverYear}
          />
          <Card
            title="Hypothèses du modèle"
            description="Simulation indicative : pas de fiscalité, frais de revente ni assurance emprunteur."
          >
            <ul className="list-disc space-y-2 ps-5 text-sm text-gray-600 text-pretty">
              <li>
                L’acheteur finance le bien avec l’apport net (après frais de
                notaire) ; le locataire place l’apport initial au taux indiqué.
              </li>
              <li>
                L’apport est rémunéré chaque mois ; s’ajoute l’écart mensuel
                entre le coût propriétaire (crédit + charges) et le loyer.
              </li>
              <li>
                Le patrimoine acheteur est l’équité du bien (valeur revalorisée
                − capital restant dû).
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyVsRentSimulator;
