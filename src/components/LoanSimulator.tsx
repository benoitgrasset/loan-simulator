import { Calculator, EuroIcon, TrendingUp } from "lucide-react";
import React, { useMemo, useState } from "react";
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
    amount: 220000,
    interestRate,
    duration,
  });

  // Surface (m²) for the "Appartement" card
  const [area, setArea] = useState<number>(45);

  // Apport (down payment)
  const [apport, setApport] = useState<number>(20000);

  // Update loanData when duration from store changes
  React.useEffect(() => {
    setLoanData((prev) => ({ ...prev, duration }));
  }, [duration]);

  // Update loanData when interestRate from store changes
  React.useEffect(() => {
    setLoanData((prev) => ({ ...prev, interestRate }));
  }, [interestRate]);

  const amortizationSchedule = useMemo(
    () => generateAmortizationSchedule(loanData),
    [loanData]
  );

  const totalInterest = useMemo(
    () =>
      amortizationSchedule.reduce((sum, row) => sum + row.interestPayment, 0),
    [amortizationSchedule]
  );

  const monthlyPayment = amortizationSchedule[0]?.monthlyPayment || 0;

  const costTotal = useMemo(() => loanData.amount + apport, [loanData.amount, apport]);

  const pricePerSqm = useMemo(() => {
    return area > 0 ? costTotal / area : 0;
  }, [area, costTotal]);

  const handleInputChange = (field: keyof LoanData, value: number) => {
    setLoanData((prev) => ({ ...prev, [field]: value }));
    if (field === "duration") {
      setDuration(value);
    }
    if (field === "interestRate") {
      setInterestRate(value);
    }
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
                  value={loanData.amount}
                  onChange={(value) => handleInputChange("amount", value)}
                  symbol="€"
                  step="2000"
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

          {/* Appartement card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Appartement
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Surface (m²)</Label>
                <Input
                  value={area}
                  onChange={(value) => setArea(value)}
                  symbol="m²"
                  step={1}
                />
              </div>

              <div>
                <Label>Apport (€)</Label>
                <Input
                  value={apport}
                  onChange={(value) => setApport(value)}
                  symbol="€"
                  step="2000"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Coût total
                </span>
                <span className="font-bold text-gray-700">
                  {formatCurrency(costTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Prix au m²
                </span>
                <span className="font-bold text-gray-700">
                  {area > 0 ? `${formatCurrency(pricePerSqm)} /m²` : "—"}
                </span>
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
                  {formatCurrency(loanData.amount + totalInterest)}
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
