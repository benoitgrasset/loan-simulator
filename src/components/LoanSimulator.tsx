import { Calculator, EuroIcon, Home, Settings2, TrendingUp } from "lucide-react";
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
  generateAmortizationSchedule,
} from "../utils/calculations";
import AmortizationTable from "./AmortizationTable";
import LoanChart from "./LoanChart";
import { PropertyFeesSettings } from "./PropertyFeesSettings";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { RadioButtonGroup } from "./ui/RadioGroup";

const DEFAULT_PROPERTY_TYPE: PropertyType = "Neuf";

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

  // Calcul des mensualités
  const monthlyPayment = amortizationSchedule[0]?.monthlyPayment || 0;
  const monthlyPropertyTax = propertyTax / 12;
  const totalMonthlyCost =
    monthlyPayment + monthlyPropertyTax + monthlyCharges + edf;

  // Calcul des frais
  const notaryRate = notaryRates[propertyType];
  const brokerFees = brokerFeesByType[propertyType];
  const propertyTypeHints: Record<PropertyType, string> = {
    Neuf: `Frais de notaire : ${notaryRates.Neuf} %\nFrais de courtier : ${formatCurrency(brokerFeesByType.Neuf)}`,
    Ancien: `Frais de notaire : ${notaryRates.Ancien} %\nFrais de courtier : ${formatCurrency(brokerFeesByType.Ancien)}`,
  };
  const notaryFees = (propertyValue * notaryRate) / 100;

  // Calcul du total des frais
  const totalFees =
    works +
    guaranteeFees +
    applicationFees +
    notaryFees +
    brokerFees;
  const totalProjectCost = propertyValue + totalFees;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h1 className="text-2xl font-bold">
            Simulation de Crédit Immobilier
          </h1>
        </div>
        <p className="text-blue-100">
          Calculez votre plan d'amortissement détaillé
        </p>
      </div>

      {/* Switch neuf / ancien */}
      <div className="relative z-10 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 flex flex-wrap items-center justify-between gap-3 w-1/2 overflow-visible">
        <h2 className="text-base font-semibold text-gray-800">Type de bien</h2>
        <div className="flex items-center gap-1">
          <RadioButtonGroup
            name="propertyType"
            options={["Neuf", "Ancien"]}
            value={propertyType}
            onChange={(value) => setPropertyType(value)}
            hints={propertyTypeHints}
          />
          <button
            type="button"
            onClick={() => setFeesSettingsOpen(true)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
            aria-label="Paramétrer les frais de notaire et de courtier"
            title="Paramétrer les frais"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
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
      </div>

      {/* Valeur du bien et apport */}
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Valeur du bien et apport
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="font-bold">
            <Label>Valeur du bien</Label>
            <Input
              value={propertyValue}
              onChange={(value) => setPropertyValue(value)}
              symbol="€"
              step={1000}
            />
          </div>
          <div>
            <Label>Apport</Label>
            <Input
              value={downPayment}
              onChange={(value) => setDownPayment(value)}
              symbol="€"
              step={1000}
            />
          </div>
          <div className="md:col-span-1 flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Montant à financer
            </span>
            <span className="font-bold text-blue-600">
              {formatCurrency(amountToFinance)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de saisie */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Paramètres du prêt
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Montant à emprunter (hors PTZ)</Label>
                <Input value={loanAmount} symbol="€" disabled />
              </div>

              <div>
                <Label>Taux d'intérêt annuel</Label>
                <Input
                  value={interestRate}
                  onChange={(value) => setInterestRate(value)}
                  symbol="%"
                  step={0.05}
                />
              </div>

              <div>
                <Label>Durée du prêt</Label>
                <Input
                  value={duration}
                  onChange={(value) => setDuration(value)}
                  symbol="ans"
                  step={1}
                />
              </div>
              <div>
                <Label>Montant PTZ</Label>
                <Input
                  value={ptz}
                  onChange={(value) => setPtz(value)}
                  symbol="€"
                  step={5000}
                />
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé (Prêt + intérêts)</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <EuroIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Mensualité
                  </span>
                </div>
                <span className="font-bold text-blue-600">
                  {formatCurrency(monthlyPayment)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Coût total du crédit
                  </span>
                </div>
                <span className="font-bold text-green-600">
                  {formatCurrency(totalInterest)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">
                  Montant total remboursé
                </span>
                <span className="font-bold text-gray-500">
                  {formatCurrency(loanAmount + totalInterest + ptzAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Charges et mensualités */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Charges et mensualités
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Charges mensuelles</Label>
                <Input
                  value={monthlyCharges}
                  onChange={setMonthlyCharges}
                  symbol="€/mois"
                />
              </div>

              <div>
                <Label>EDF</Label>
                <Input
                  value={edf}
                  onChange={setEdf}
                  symbol="€/mois"
                  step={25}
                />
              </div>

              <div>
                <Label>Taxe foncière annuelle</Label>
                <Input
                  value={propertyTax}
                  onChange={setPropertyTax}
                  symbol="€/an"
                  step={50}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Mensualités totales
                  </span>
                </div>
                <span className="font-bold text-indigo-600">
                  {formatCurrency(totalMonthlyCost)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Coût du projet
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Travaux</Label>
                <Input
                  value={works}
                  onChange={(value) => setWorks(value)}
                  symbol="€"
                  step={500}
                />
              </div>

              <div>
                <Label>Frais de notaire ({notaryRate}% - {propertyType === "Neuf" ? "neuf" : "ancien"})</Label>
                <span className="inline-block px-4">{formatCurrency(notaryFees)}</span>
              </div>

              <div>
                <Label>Frais de garantie</Label>
                <Input
                  value={guaranteeFees}
                  onChange={(value) => setGuaranteeFees(value)}
                  symbol="€"
                  step={500}
                />
              </div>

              <div>
                <Label>Frais de dossier</Label>
                <Input
                  value={applicationFees}
                  onChange={(value) => setApplicationFees(value)}
                  symbol="€"
                  step={500}
                />
              </div>

              <div>
                <Label>Frais de courtier ({propertyType === "Neuf" ? "neuf" : "ancien"})</Label>
                <span className="inline-block px-4">{formatCurrency(brokerFees)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label className="mb-0">Total des frais</Label>
                <span className="text-gray-700">
                  {formatCurrency(totalFees)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <EuroIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Coût total du projet
                </span>
                </div>
                <span className="font-bold text-blue-600">
                  {formatCurrency(totalProjectCost)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique et tableau */}
        <div className="lg:col-span-2 space-y-6">
          <LoanChart schedule={amortizationSchedule} />
          <AmortizationTable schedule={amortizationSchedule} />
        </div>
      </div>
    </div>
  );
};

export default LoanSimulator;
