export interface LoanData {
  amount: number;
  interestRate: number;
  duration: number; // en années
}

export interface AmortizationRow {
  month: number;
  monthlyPayment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
}

export interface InvestmentData {
  propertyPrice: number;
  loanAmount: number;
  interestRate: number;
  duration: number;
  monthlyRent: number;
  renovationCosts: number;
  notaryFees: number;
  loanFees: number;
  cabinetCommission: number;
  taxReduction: number;
  propertyTax: number;
}

export interface InvestmentResult {
  monthlyNetCashFlow: number;
  annualNetCashFlow: number;
  totalReturn: number;
  roi: number;
  netYield: number;
}