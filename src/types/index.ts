export interface LoanData {
  /** Taux d'intérêt annuel */
  interestRate: number;
  /** Durée de l'emprunt en années */
  duration: number; // en années
}

export interface AmortizationRow {
  month: number;
  monthlyPayment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
  cumulativePayment: number;
}

export interface InvestmentFormData {
  propertyPrice: number;
  loanAmount: number;
  monthlyRent: number;
  renovationCosts: number;
  notaryFees: number;
  loanFees: number;
  cabinetCommission: number;
  taxReduction: number;
  propertyTax: number;
}

export interface InvestmentData extends InvestmentFormData, LoanData {}

export interface InvestmentResult {
  monthlyNetCashFlow: number;
  monthlyPayment: number;
  annualNetCashFlow: number;
  totalReturn: number;
  roi: number;
  netYield: number;
}

export interface BuyVsRentInputs {
  propertyPrice: number;
  downPayment: number;
  upfrontFees: number;
  interestRate: number;
  loanDurationYears: number;
  horizonYears: number;
  monthlyRent: number;
  monthlyOwnerCosts: number;
  savingsReturnRate: number;
  propertyAppreciationRate: number;
  rentAppreciationRate: number;
}

export interface BuyVsRentYearPoint {
  year: number;
  buyNetWorth: number;
  rentNetWorth: number;
}

export interface BuyVsRentResult {
  points: BuyVsRentYearPoint[];
  crossoverYear: number | null;
  monthlyOwnerTotal: number;
  monthlyRent: number;
  loanAmount: number;
}
