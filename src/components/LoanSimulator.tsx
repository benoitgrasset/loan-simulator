import { Calculator, EuroIcon, Home, TrendingUp } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  DEFAULT_APPLICATION_FEES,
  DEFAULT_BROKER_FEES,
  DEFAULT_DOWN_PAYMENT,
  DEFAULT_GUARANTEE_FEES,
  DEFAULT_MONTHLY_CHARGES,
  DEFAULT_NOTARY_FEES,
  DEFAULT_PROPERTY_TAX,
  DEFAULT_PROPERTY_VALUE,
} from "../constants";
import { useFinancialStore } from "../stores/useFinancialStore";
import { LoanData } from "../types";
import {
  formatCurrency,
  generateAmortizationSchedule,
} from "../utils/calculations";
import AmortizationTable from "./AmortizationTable";
import LoanChart from "./LoanChart";
import { Input } from "./ui/input";
import Label from "./ui/Label";

const LoanSimulator: React.FC = () => {
  const { duration, setDuration, interestRate, setInterestRate } =
    useFinancialStore();

  const [loanData, setLoanData] = useState<LoanData>({
    amount: DEFAULT_PROPERTY_VALUE,
    interestRate,
    duration,
  });
  const [propertyValue, setPropertyValue] = useState(DEFAULT_PROPERTY_VALUE);
  const [downPayment, setDownPayment] = useState(DEFAULT_DOWN_PAYMENT);
  const [monthlyCharges, setMonthlyCharges] = useState(DEFAULT_MONTHLY_CHARGES);
  const [propertyTax, setPropertyTax] = useState(DEFAULT_PROPERTY_TAX);
  const [projectCosts, setProjectCosts] = useState({
    notaryFees: DEFAULT_NOTARY_FEES,
    guaranteeFees: DEFAULT_GUARANTEE_FEES,
    applicationFees: DEFAULT_APPLICATION_FEES,
    brokerFees: DEFAULT_BROKER_FEES,
  });

  // Update loanData when duration from store changes
  React.useEffect(() => {
    setLoanData((prev) => ({ ...prev, duration }));
  }, [duration]);

  // Update loanData when interestRate from store changes
  React.useEffect(() => {
    setLoanData((prev) => ({ ...prev, interestRate }));
  }, [interestRate]);

  const loanAmount = propertyValue - downPayment;
  const amortizationSchedule = useMemo(
    () => generateAmortizationSchedule({ ...loanData, amount: loanAmount }),
    [loanData, loanAmount],
  );

  const totalInterest = useMemo(
    () =>
      amortizationSchedule.reduce((sum, row) => sum + row.interestPayment, 0),
    [amortizationSchedule],
  );

  const monthlyPayment = amortizationSchedule[0]?.monthlyPayment || 0;
  const monthlyPropertyTax = propertyTax / 12;
  const totalMonthlyCost = monthlyPayment + monthlyPropertyTax + monthlyCharges;
  const totalFees = Object.values(projectCosts).reduce(
    (total, cost) => total + cost,
    0,
  );
  const totalProjectCost = propertyValue + totalFees;

  const handleInputChange = (field: keyof LoanData, value: number) => {
    setLoanData((prev) => ({ ...prev, [field]: value }));
    if (field === "duration") {
      setDuration(value);
    }
    if (field === "interestRate") {
      setInterestRate(value);
    }
  };

  const handlePropertyValueChange = (value: number) => {
    setPropertyValue(value);
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
  };

  const handleNotaryFeesChange = (value: number) => {
    setProjectCosts((costs) => ({ ...costs, notaryFees: value }));
  };

  const handleGuaranteeFeesChange = (value: number) => {
    setProjectCosts((costs) => ({ ...costs, guaranteeFees: value }));
  };

  const handleApplicationFeesChange = (value: number) => {
    setProjectCosts((costs) => ({ ...costs, applicationFees: value }));
  };

  const handleBrokerFeesChange = (value: number) => {
    setProjectCosts((costs) => ({ ...costs, brokerFees: value }));
  };

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

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Valeur du bien et apport
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="font-bold">
            <Label>Valeur du bien</Label>
            <Input
              value={propertyValue}
              onChange={handlePropertyValueChange}
              symbol="€"
              step={1000}
            />
          </div>
          <div>
            <Label>Apport</Label>
            <Input
              value={downPayment}
              onChange={handleDownPaymentChange}
              symbol="€"
              step={1000}
            />
          </div>
          <div className="md:col-span-1 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Montant à emprunter
            </span>
            <span className="font-bold text-blue-600">
              {formatCurrency(loanAmount)}
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
                <Label>Montant à emprunter</Label>
                <Input
                  value={loanAmount}
                  onChange={() => {}}
                  symbol="€"
                  disabled
                />
              </div>

              <div>
                <Label>Taux d'intérêt annuel</Label>
                <Input
                  value={loanData.interestRate}
                  onChange={(value) => handleInputChange("interestRate", value)}
                  symbol="%"
                  step={0.05}
                />
              </div>

              <div>
                <Label>Durée du prêt</Label>
                <Input
                  value={loanData.duration}
                  onChange={(value) => handleInputChange("duration", value)}
                  symbol="ans"
                />
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé</h3>
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
                <span className="text-sm font-medium text-gray-700">
                  Montant total remboursé
                </span>
                <span className="font-bold text-gray-700">
                  {formatCurrency(loanAmount + totalInterest)}
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
                <Label>Frais de notaire</Label>
                <Input
                  value={projectCosts.notaryFees}
                  onChange={handleNotaryFeesChange}
                  symbol="€"
                />
              </div>

              <div>
                <Label>Frais de garantie</Label>
                <Input
                  value={projectCosts.guaranteeFees}
                  onChange={handleGuaranteeFeesChange}
                  symbol="€"
                />
              </div>

              <div>
                <Label>Frais de dossier</Label>
                <Input
                  value={projectCosts.applicationFees}
                  onChange={handleApplicationFeesChange}
                  symbol="€"
                />
              </div>

              <div>
                <Label>Frais de courtier</Label>
                <Input
                  value={projectCosts.brokerFees}
                  onChange={handleBrokerFeesChange}
                  symbol="€"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label>Total des frais</Label>
                <span className="text-gray-700">
                  {formatCurrency(totalFees)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Coût total du projet
                </span>
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
