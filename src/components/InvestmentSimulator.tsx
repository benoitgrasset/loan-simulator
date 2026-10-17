import { Building2, DollarSign, PieChart, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useFinancialStore } from "../stores/useFinancialStore";
import { InvestmentData, InvestmentFormData } from "../types";
import {
  calculateInvestmentProfitability,
  formatCurrency,
  formatPercentage,
} from "../utils/calculations";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

const propertyPrice = 140000;

const formCardClassName = "border-gray-100 p-6 shadow-lg";

const InvestmentSimulator = () => {
  const { duration, setDuration, interestRate, setInterestRate } =
    useFinancialStore();

  const [form, setForm] = useState<InvestmentFormData>({
    propertyPrice,
    loanAmount: 130000,
    monthlyRent: 490,
    renovationCosts: (25 * propertyPrice) / 100,
    notaryFees: 8500,
    loanFees: 2500,
    cabinetCommission: 1500,
    taxReduction: 12000,
    propertyTax: 2400,
  });

  const investmentData = { ...form, interestRate, duration };

  const profitability = useMemo(
    () =>
      calculateInvestmentProfitability({
        ...form,
        interestRate,
        duration,
      }),
    [form, interestRate, duration],
  );

  const handleInputChange = (field: keyof InvestmentData, value: number) => {
    if (field === "duration") {
      setDuration(value);
      return;
    }
    if (field === "interestRate") {
      setInterestRate(value);
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
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
      <div className="rounded-xl bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
        <div className="mb-2 flex items-center gap-3">
          <Building2 className="h-8 w-8 shrink-0" />
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-balance">
            Simulation Investissement De Normandie
          </h1>
        </div>
        <p className="text-green-100">
          Analysez la rentabilité de votre investissement immobilier
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card title="Bien immobilier" className={formCardClassName}>
            <div className="space-y-4">
              <Input
                label="Prix du bien"
                value={investmentData.propertyPrice}
                onChange={(value) => handleInputChange("propertyPrice", value)}
                symbol="€"
              />
              <Input
                label="Loyer mensuel"
                value={investmentData.monthlyRent}
                onChange={(value) => handleInputChange("monthlyRent", value)}
                symbol="€/mois"
              />
              <Input
                label="Taxe foncière annuelle"
                value={investmentData.propertyTax}
                onChange={(value) => handleInputChange("propertyTax", value)}
                symbol="€/an"
              />
            </div>
          </Card>

          <Card title="Financement" className={formCardClassName}>
            <div className="space-y-4">
              <Input
                label="Montant emprunté"
                value={investmentData.loanAmount}
                onChange={(value) => handleInputChange("loanAmount", value)}
                symbol="€"
              />
              <Input
                label="Taux d’intérêt"
                value={investmentData.interestRate}
                onChange={(value) => handleInputChange("interestRate", value)}
                symbol="%"
                step={0.05}
              />
              <Input
                label="Durée"
                value={investmentData.duration}
                onChange={(value) => handleInputChange("duration", value)}
                symbol="ans"
              />
            </div>
          </Card>

          <Card title="Frais & Avantages" className={formCardClassName}>
            <div className="space-y-4">
              <Input
                label="Travaux"
                value={investmentData.renovationCosts}
                onChange={(value) =>
                  handleInputChange("renovationCosts", value)
                }
                symbol="€"
              />
              <Input
                label="Frais de notaire"
                value={investmentData.notaryFees}
                onChange={(value) => handleInputChange("notaryFees", value)}
                symbol="€"
              />
              <Input
                label="Frais de dossier"
                value={investmentData.loanFees}
                onChange={(value) => handleInputChange("loanFees", value)}
                symbol="€"
              />
              <Input
                label="Commission cabinet / Frais de courtage"
                value={investmentData.cabinetCommission}
                onChange={(value) =>
                  handleInputChange("cabinetCommission", value)
                }
                symbol="€"
              />
              <Input
                label="Réduction d’impôts"
                value={investmentData.taxReduction}
                onChange={(value) => handleInputChange("taxReduction", value)}
                symbol="€"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Cash-flow mensuel
                </h3>
              </div>
              <div className="mb-2 text-3xl font-bold text-green-600">
                {formatCurrency(profitability.monthlyNetCashFlow)}
              </div>
              <p className="text-sm text-gray-600">
                Revenus nets après charges mensuelles
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Rendement net
                </h3>
              </div>
              <div className="mb-2 text-3xl font-bold text-blue-600">
                {formatPercentage(profitability.netYield)}
              </div>
              <p className="text-sm text-gray-600">
                Rentabilité annuelle nette
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <PieChart className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  ROI total
                </h3>
              </div>
              <div className="mb-2 text-3xl font-bold text-purple-600">
                {formatPercentage(profitability.roi)}
              </div>
              <p className="text-sm text-gray-600">
                Retour sur investissement sur {investmentData.duration} ans
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Investissement initial
                </h3>
              </div>
              <div className="mb-2 text-3xl font-bold text-orange-600">
                {formatCurrency(initialInvestment)}
              </div>
              <p className="text-sm text-gray-600">
                Apport personnel nécessaire
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Détail des calculs
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-medium text-gray-700">
                  Revenus mensuels
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loyers mensuels</span>
                    <span className="font-medium">
                      {formatCurrency(investmentData.monthlyRent)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-medium text-gray-700">
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
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Total charges</span>
                    <span>
                      {formatCurrency(
                        profitability.monthlyPayment +
                          investmentData.propertyTax / 12,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="mb-3 font-medium text-gray-700">
                  Investissement initial
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Apport personnel</span>
                    <span className="font-medium">
                      {formatCurrency(
                        investmentData.propertyPrice -
                          investmentData.loanAmount,
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
                    <span>Réduction d’impôts</span>
                    <span className="font-medium">
                      -{formatCurrency(investmentData.taxReduction)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-medium">
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
