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
