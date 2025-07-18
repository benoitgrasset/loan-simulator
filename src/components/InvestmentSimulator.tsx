import { Building2, DollarSign, PieChart, TrendingUp } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useFinancialStore } from "../stores/useFinancialStore";
import { InvestmentData } from "../types";
import {
  calculateInvestmentProfitability,
  formatCurrency,
  formatPercentage,
} from "../utils/calculations";
import { Input } from "./ui/input";
import Label from "./ui/Label";

const propertyPrice = 140000;

const InvestmentSimulator: React.FC = () => {
  const { duration, setDuration, interestRate, setInterestRate } =
    useFinancialStore();

  const [investmentData, setInvestmentData] = useState<InvestmentData>({
    propertyPrice,
    loanAmount: 130000,
    interestRate,
    duration,
    monthlyRent: 490,
    renovationCosts: (25 * propertyPrice) / 100,
    notaryFees: 8500,
    loanFees: 2500,
    cabinetCommission: 1500,
    taxReduction: 12000,
    propertyTax: 2400,
  });

  // Update investmentData when duration from store changes
  React.useEffect(() => {
    setInvestmentData((prev) => ({ ...prev, duration }));
  }, [duration]);

  // Update investmentData when interestRate from store changes
  React.useEffect(() => {
    setInvestmentData((prev) => ({ ...prev, interestRate }));
  }, [interestRate]);

  const profitability = useMemo(
    () => calculateInvestmentProfitability(investmentData),
    [investmentData]
  );

  const handleInputChange = (field: keyof InvestmentData, value: number) => {
    setInvestmentData((prev) => ({ ...prev, [field]: value }));
    if (field === "duration") {
      setDuration(value);
    }
    if (field === "interestRate") {
      setInterestRate(value);
    }
  };

  const initialInvestment =
    investmentData.propertyPrice -
    investmentData.loanAmount +
    investmentData.renovationCosts +
    investmentData.notaryFees +
    investmentData.loanFees +
    investmentData.cabinetCommission -
    investmentData.taxReduction;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-8 h-8" />
          <h1 className="text-2xl font-bold">
            Simulation Investissement De Normandie
          </h1>
        </div>
        <p className="text-green-100">
          Analysez la rentabilité de votre investissement immobilier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaires de saisie */}
        <div className="lg:col-span-1 space-y-6">
          {/* Bien immobilier */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Bien immobilier
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Prix du bien</Label>
                <Input
                  value={investmentData.propertyPrice}
                  onChange={(value) =>
                    handleInputChange("propertyPrice", value)
                  }
                  symbol="€"
                />
              </div>

              <div>
                <Label>Loyer mensuel</Label>
                <Input
                  value={investmentData.monthlyRent}
                  onChange={(value) => handleInputChange("monthlyRent", value)}
                  symbol="€/mois"
                />
              </div>

              <div>
                <Label>Taxe foncière annuelle</Label>
                <Input
                  value={investmentData.propertyTax}
                  onChange={(value) => handleInputChange("propertyTax", value)}
                  symbol="€/an"
                />
              </div>
            </div>
          </div>

          {/* Financement */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Financement
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Montant emprunté</Label>
                <Input
                  value={investmentData.loanAmount}
                  onChange={(value) => handleInputChange("loanAmount", value)}
                  symbol="€"
                />
              </div>

              <div>
                <Label>Taux d'intérêt</Label>
                <Input
                  value={investmentData.interestRate}
                  onChange={(value) => handleInputChange("interestRate", value)}
                  symbol="%"
                  step={0.05}
                />
              </div>

              <div>
                <Label>Durée</Label>
                <Input
                  value={investmentData.duration}
                  onChange={(value) => handleInputChange("duration", value)}
                  symbol="ans"
                />
              </div>
            </div>
          </div>

          {/* Frais et avantages */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Frais & Avantages
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Travaux</Label>
                <Input
                  value={investmentData.renovationCosts}
                  onChange={(value) =>
                    handleInputChange("renovationCosts", value)
                  }
                  symbol="€"
                />
              </div>

              <div>
                <Label>Frais de notaire</Label>
                <Input
                  value={investmentData.notaryFees}
                  onChange={(value) => handleInputChange("notaryFees", value)}
                  symbol="€"
                />
              </div>

              <div>
                <Label>Frais de dossier</Label>
                <Input
                  value={investmentData.loanFees}
                  onChange={(value) => handleInputChange("loanFees", value)}
                  symbol="€"
                />
              </div>

              <div>
                <Label>Commission cabinet / Frais de courtage</Label>
                <Input
                  value={investmentData.cabinetCommission}
                  onChange={(value) =>
                    handleInputChange("cabinetCommission", value)
                  }
                  symbol="€"
                />
              </div>

              <div>
                <Label>Réduction d'impôts</Label>
                <Input
                  value={investmentData.taxReduction}
                  onChange={(value) => handleInputChange("taxReduction", value)}
                  symbol="€"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Indicateurs clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Cash-flow mensuel
                </h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(profitability.monthlyNetCashFlow)}
              </div>
              <p className="text-sm text-gray-600">
                Revenus nets après charges mensuelles
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Rendement net
                </h3>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPercentage(profitability.netYield)}
              </div>
              <p className="text-sm text-gray-600">
                Rentabilité annuelle nette
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <PieChart className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  ROI total
                </h3>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatPercentage(profitability.roi)}
              </div>
              <p className="text-sm text-gray-600">
                Retour sur investissement sur {investmentData.duration} ans
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Investissement initial
                </h3>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {formatCurrency(initialInvestment)}
              </div>
              <p className="text-sm text-gray-600">
                Apport personnel nécessaire
              </p>
            </div>
          </div>

          {/* Détail des calculs */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Détail des calculs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Revenus mensuels
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loyers mensuels</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.monthlyRent)}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Réduction d'impôts</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.taxReduction / 12)}
                    </span>
                  </div> */}
                </div>

                {/* <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {formatCurrency(
                      investmentData.monthlyRent -
                        profitability.monthlyPayment -
                        investmentData.propertyTax / 12
                    )}
                  </span>
                </div> */}
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Charges mensuelles
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mensualités emprunt</span>
                    <span className="font-medium">
                      {formatCurrency(profitability.monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxe foncière</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.propertyTax / 12)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total charges</span>
                    <span>
                      {formatCurrency(
                        profitability.monthlyPayment +
                          investmentData.propertyTax / 12
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700 mb-3">
                  Investissement initial
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    {/* prix du bien - montant emprunté */}
                    <span className="text-gray-600">Apport personnel</span>
                    <span className="font-medium">
                      {formatCurrency(
                        investmentData.propertyPrice - investmentData.loanAmount
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travaux</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.renovationCosts)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de notaire</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.notaryFees)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de dossier</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.loanFees)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission cabinet</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.cabinetCommission)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Réduction d'impôts</span>
                    <span className="font-medium">
                      -{formatCurrency(investmentData.taxReduction)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium text-lg">
                    <span>Total investissement</span>
                    <span>{formatCurrency(initialInvestment)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulator;
