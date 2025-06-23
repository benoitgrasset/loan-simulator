import { LoanData, AmortizationRow, InvestmentData, InvestmentResult } from '../types';

export function calculateMonthlyPayment(amount: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) return amount / numberOfPayments;
  
  return (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
}

export function generateAmortizationSchedule(loanData: LoanData): AmortizationRow[] {
  const { amount, interestRate, duration } = loanData;
  const monthlyPayment = calculateMonthlyPayment(amount, interestRate, duration);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = duration * 12;
  
  const schedule: AmortizationRow[] = [];
  let remainingBalance = amount;
  
  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;
    
    // Correction pour le dernier mois
    if (month === numberOfPayments && remainingBalance < 0.01) {
      remainingBalance = 0;
    }
    
    schedule.push({
      month,
      monthlyPayment,
      interestPayment,
      principalPayment,
      remainingBalance: Math.max(0, remainingBalance)
    });
  }
  
  return schedule;
}

export function calculateInvestmentProfitability(data: InvestmentData): InvestmentResult {
  const {
    propertyPrice,
    loanAmount,
    interestRate,
    duration,
    monthlyRent,
    renovationCosts,
    notaryFees,
    loanFees,
    cabinetCommission,
    taxReduction,
    propertyTax
  } = data;
  
  // Calcul des mensualités d'emprunt
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, duration);
  
  // Calcul du cash-flow mensuel net
  const monthlyPropertyTax = propertyTax / 12;
  const monthlyNetCashFlow = monthlyRent - monthlyPayment - monthlyPropertyTax;
  
  // Calcul du cash-flow annuel net
  const annualNetCashFlow = monthlyNetCashFlow * 12;
  
  // Calcul de l'investissement initial
  const initialInvestment = propertyPrice - loanAmount + renovationCosts + notaryFees + loanFees + cabinetCommission - taxReduction;
  
  // Calcul du retour total sur la durée du prêt
  const totalReturn = annualNetCashFlow * duration;
  
  // Calcul du ROI
  const roi = initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;
  
  // Calcul du rendement net
  const netYield = initialInvestment > 0 ? (annualNetCashFlow / initialInvestment) * 100 : 0;
  
  return {
    monthlyNetCashFlow,
    annualNetCashFlow,
    totalReturn,
    roi,
    netYield
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}