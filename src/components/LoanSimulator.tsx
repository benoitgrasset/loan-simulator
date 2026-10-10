import { Calculator, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  BROKER_FEES,
  DEFAULT_APPLICATION_FEES,
  DEFAULT_DOWN_PAYMENT,
  DEFAULT_EDF,
  DEFAULT_GUARANTEE_FEES,
  DEFAULT_MONTHLY_CHARGES,
  DEFAULT_PROPERTY_TAX,
  DEFAULT_PROPERTY_VALUE,
  DEFAULT_WORKS,
  NOTARY_RATE,
  PropertyType,
} from "../constants";
import { useFinancialStore } from "../stores/useFinancialStore";
import {
  formatCurrency,
  formatRate,
  formatYears,
  generateAmortizationSchedule,
} from "../utils/calculations";
import AmortizationTable from "./AmortizationTable";
import LoanChart from "./LoanChart";
import { PropertyFeesSettings } from "./PropertyFeesSettings";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { RadioButtonGroup } from "./ui/RadioGroup";
import { StatGroup, StatTile } from "./ui/StatTile";
import { ValueRow } from "./ui/ValueRow";

const DEFAULT_PROPERTY_TYPE: PropertyType = "Ancien";

const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  Neuf: "neuf",
  Ancien: "ancien",
};

const LoanSimulator = () => {
  const { duration, setDuration, interestRate, setInterestRate } =
    useFinancialStore();

  const [propertyValue, setPropertyValue] = useState(DEFAULT_PROPERTY_VALUE);
  const [downPayment, setDownPayment] = useState(DEFAULT_DOWN_PAYMENT);
  const [monthlyCharges, setMonthlyCharges] = useState(DEFAULT_MONTHLY_CHARGES);
  const [propertyTax, setPropertyTax] = useState(DEFAULT_PROPERTY_TAX);
  const [edf, setEdf] = useState(DEFAULT_EDF);
  const [ptz, setPtz] = useState(0);
  const [propertyType, setPropertyType] = useState<PropertyType>(
    DEFAULT_PROPERTY_TYPE,
  );
  const [guaranteeFees, setGuaranteeFees] = useState(DEFAULT_GUARANTEE_FEES);
  const [applicationFees, setApplicationFees] = useState(DEFAULT_APPLICATION_FEES);
  const [works, setWorks] = useState(DEFAULT_WORKS);
  const [notaryRates, setNotaryRates] = useState<Record<PropertyType, number>>(
    () => ({ ...NOTARY_RATE }),
  );
  const [brokerFeesByType, setBrokerFeesByType] = useState<
    Record<PropertyType, number>
  >(() => ({ ...BROKER_FEES }));
  const [feesSettingsOpen, setFeesSettingsOpen] = useState(false);

  // Montant à financer (hors apport), emprunté en totalité
  const amountToFinance = Math.max(propertyValue - downPayment, 0);
  // Part empruntée à 0 % (PTZ), plafonnée au montant à financer
  const ptzAmount = Math.min(amountToFinance, ptz);
  // Part empruntée au taux du crédit
  const loanAmount = amountToFinance - ptzAmount;

  // Le PTZ est remboursé sur la même durée, sans intérêts
  const amortizationSchedule = useMemo(
    () =>
      generateAmortizationSchedule({
        interestRate,
        duration,
        amount: loanAmount,
        interestFreeAmount: ptzAmount,
      }),
    [interestRate, duration, loanAmount, ptzAmount],
  );

  // Calcul du total des intérêts
  const totalInterest = useMemo(
    () =>
      amortizationSchedule.reduce((sum, row) => sum + row.interestPayment, 0),
    [amortizationSchedule],
  );
  const totalRepaid = loanAmount + totalInterest + ptzAmount;

  // Calcul des mensualités
  const monthlyPayment = amortizationSchedule[0]?.monthlyPayment || 0;
  const monthlyPropertyTax = propertyTax / 12;
  const totalMonthlyCost =
    monthlyPayment + monthlyPropertyTax + monthlyCharges + edf;

  // Calcul des frais
  const notaryRate = notaryRates[propertyType];
  const brokerFees = brokerFeesByType[propertyType];
  const propertyTypeHints: Record<PropertyType, string> = {
    Neuf: `Frais de notaire : ${formatRate(notaryRates.Neuf)}\nFrais de courtier : ${formatCurrency(brokerFeesByType.Neuf)}`,
    Ancien: `Frais de notaire : ${formatRate(notaryRates.Ancien)}\nFrais de courtier : ${formatCurrency(brokerFeesByType.Ancien)}`,
  };
  const notaryFees = (propertyValue * notaryRate) / 100;

  // Calcul du total des frais
  const totalFees =
    works + guaranteeFees + applicationFees + notaryFees + brokerFees;
  const totalProjectCost = propertyValue + totalFees;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-white">
        <div className="mb-2 flex items-center gap-3">
          <Calculator className="h-8 w-8 shrink-0" />
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-balance">
            Simulation de crédit immobilier
          </h1>
        </div>
        <p className="text-blue-100">
          Calculez votre plan d’amortissement détaillé
        </p>
      </div>

      <StatGroup
        label="Résultats de la simulation"
        className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatTile
          label="Mensualité"
          value={formatCurrency(monthlyPayment)}
          hint={`Sur ${formatYears(duration)}`}
          tone="accent"
        />
        <StatTile
          label="Coût mensuel total"
          value={formatCurrency(totalMonthlyCost)}
          hint="Mensualité, charges, électricité et taxe foncière"
        />
        <StatTile
          label="Coût total du crédit"
          value={formatCurrency(totalInterest)}
          hint={`Total remboursé : ${formatCurrency(totalRepaid)}`}
          tone="interest"
        />
        <StatTile
          label="Coût total du projet"
          value={formatCurrency(totalProjectCost)}
          hint={`Dont ${formatCurrency(totalFees)} de frais`}
        />
      </StatGroup>

      <Card
        title="Le bien"
        className="relative z-10"
        actions={
          <>
            <RadioButtonGroup
              name="propertyType"
              label="Type de bien"
              options={["Neuf", "Ancien"]}
              value={propertyType}
              onChange={(value) => setPropertyType(value)}
              hints={propertyTypeHints}
            />
            <Button
              onClick={() => setFeesSettingsOpen(true)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Paramétrer les frais de notaire et de courtier"
              title="Paramétrer les frais"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Valeur du bien"
            value={propertyValue}
            onChange={(value) => setPropertyValue(value)}
            symbol="€"
            step={1000}
          />
          <Input
            label="Apport"
            value={downPayment}
            onChange={(value) => setDownPayment(value)}
            symbol="€"
            step={1000}
          />
        </div>
        <ValueRow
          className="mt-4"
          label="Montant à financer"
          value={formatCurrency(amountToFinance)}
          tone="accent"
        />
      </Card>
      <PropertyFeesSettings
        open={feesSettingsOpen}
        onClose={() => setFeesSettingsOpen(false)}
        notaryRates={notaryRates}
        brokerFees={brokerFeesByType}
        onNotaryRateChange={(type, value) =>
          setNotaryRates((prev) => ({ ...prev, [type]: value }))
        }
        onBrokerFeesChange={(type, value) =>
          setBrokerFeesByType((prev) => ({ ...prev, [type]: value }))
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card title="Paramètres du prêt">
            <div className="space-y-4">
              <Input
                label="Taux d’intérêt annuel"
                value={interestRate}
                onChange={(value) => setInterestRate(value)}
                symbol="%"
                step={0.05}
              />
              <Input
                label="Durée du prêt"
                value={duration}
                onChange={(value) => setDuration(value)}
                symbol="ans"
                step={1}
              />
              <Input
                label="Prêt à taux zéro (PTZ)"
                value={ptz}
                onChange={(value) => setPtz(value)}
                symbol="€"
                step={5000}
              />
            </div>
            <ValueRow
              className="mt-6"
              label="Montant à emprunter (hors PTZ)"
              value={formatCurrency(loanAmount)}
              tone="strong"
            />
          </Card>

          <Card title="Charges du logement">
            <div className="space-y-4">
              <Input
                label="Charges mensuelles"
                value={monthlyCharges}
                onChange={setMonthlyCharges}
                symbol="€/mois"
              />
              <Input
                label="Électricité"
                value={edf}
                onChange={setEdf}
                symbol="€/mois"
                step={25}
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

          <Card title="Coût du projet">
            <div className="space-y-4">
              <Input
                label="Travaux"
                value={works}
                onChange={(value) => setWorks(value)}
                symbol="€"
                step={500}
              />
              <Input
                label="Frais de garantie"
                value={guaranteeFees}
                onChange={(value) => setGuaranteeFees(value)}
                symbol="€"
                step={500}
              />
              <Input
                label="Frais de dossier"
                value={applicationFees}
                onChange={(value) => setApplicationFees(value)}
                symbol="€"
                step={500}
              />
            </div>
            <div className="mt-6 space-y-2">
              <ValueRow
                label="Frais de notaire"
                hint={`${PROPERTY_TYPE_LABEL[propertyType]}, ${formatRate(notaryRate)}`}
                value={formatCurrency(notaryFees)}
              />
              <ValueRow
                label="Frais de courtier"
                hint={PROPERTY_TYPE_LABEL[propertyType]}
                value={formatCurrency(brokerFees)}
              />
              <ValueRow
                label="Total des frais"
                value={formatCurrency(totalFees)}
                tone="strong"
              />
            </div>
          </Card>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-2">
          {amortizationSchedule.length > 0 && amountToFinance > 0 ? (
            <>
              <LoanChart schedule={amortizationSchedule} />
              <AmortizationTable schedule={amortizationSchedule} />
            </>
          ) : (
            <Card
              title="Aucun emprunt à simuler"
              description={
                amountToFinance === 0
                  ? "Votre apport couvre la valeur du bien. Réduisez l’apport pour afficher le plan d’amortissement."
                  : "Indiquez une durée de prêt d’au moins 1 an pour afficher le plan d’amortissement."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanSimulator;
