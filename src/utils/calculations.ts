import {
  AmortizationRow,
  BuyVsRentInputs,
  BuyVsRentResult,
  BuyVsRentYearPoint,
  InvestmentData,
  InvestmentResult,
  LoanData,
} from "../types";

export function calculateMonthlyPayment(
  amount: number,
  annualRate: number,
  years: number,
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) return amount / numberOfPayments;

  return (
    (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

interface AmortizationData extends LoanData {
  /** Montant à financer (hors apport), emprunté en totalité (hors PTZ) */
  amount: number;
  /** Part empruntée à 0 %, remboursée sur la même durée. */
  interestFreeAmount?: number;
}

function buildAmortizationSchedule({
  amount,
  interestRate,
  duration,
}: AmortizationData): AmortizationRow[] {
  const monthlyPayment = calculateMonthlyPayment(
    amount,
    interestRate,
    duration,
  );
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
      remainingBalance: Math.max(0, remainingBalance),
      cumulativePayment: monthlyPayment * month,
    });
  }

  return schedule;
}

export function generateAmortizationSchedule({
  amount,
  interestRate,
  duration,
  interestFreeAmount = 0,
}: AmortizationData): AmortizationRow[] {
  const interestBearing = buildAmortizationSchedule({
    amount,
    interestRate,
    duration,
  });

  if (interestFreeAmount <= 0) return interestBearing;

  const interestFree = buildAmortizationSchedule({
    amount: interestFreeAmount,
    interestRate: 0,
    duration,
  });

  return interestBearing.map((row, index) => {
    const freeRow = interestFree[index];
    return {
      month: row.month,
      monthlyPayment: row.monthlyPayment + freeRow.monthlyPayment,
      interestPayment: row.interestPayment,
      principalPayment: row.principalPayment + freeRow.principalPayment,
      remainingBalance: row.remainingBalance + freeRow.remainingBalance,
      cumulativePayment: row.cumulativePayment + freeRow.cumulativePayment,
    };
  });
}

export function calculateInvestmentProfitability(
  data: InvestmentData,
): InvestmentResult {
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
    propertyTax,
  } = data;

  // Calcul des mensualités d'emprunt
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    interestRate,
    duration,
  );

  // Calcul du cash-flow mensuel net
  const monthlyPropertyTax = propertyTax / 12;
  const monthlyNetCashFlow = monthlyRent - monthlyPayment - monthlyPropertyTax;

  // Calcul du cash-flow annuel net
  const annualNetCashFlow = monthlyNetCashFlow * 12;

  // Calcul de l'investissement initial
  const initialInvestment =
    propertyPrice -
    loanAmount +
    renovationCosts +
    notaryFees +
    loanFees +
    cabinetCommission -
    taxReduction;

  // Calcul du retour total sur la durée du prêt
  const totalReturn = annualNetCashFlow * duration;

  // Calcul du ROI
  const roi =
    initialInvestment > 0 ? (totalReturn / initialInvestment) * 100 : 0;

  // Calcul du rendement net
  const netYield =
    initialInvestment > 0 ? (annualNetCashFlow / initialInvestment) * 100 : 0;

  return {
    monthlyNetCashFlow,
    monthlyPayment,
    annualNetCashFlow,
    totalReturn,
    roi,
    netYield,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

const rateFormatter = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 2,
});

/** Formats a rate expressed in percent, such as `2.5` for 2,5 %. */
export function formatRate(value: number): string {
  return rateFormatter.format(value / 100);
}

const yearsFormatter = new Intl.NumberFormat("fr-FR", {
  style: "unit",
  unit: "year",
  unitDisplay: "long",
});

export function formatYears(value: number): string {
  return yearsFormatter.format(value);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

function monthlyRateFromAnnual(annualPercent: number): number {
  return annualPercent / 100 / 12;
}

/**
 * Compare le patrimoine net acheteur (équité du bien) vs locataire (épargne placée).
 * L’apport est brut (avant frais de notaire) : les frais sont déduits de l’apport pour
 * le financement, comme sur le simulateur crédit. Le locataire place l’apport initial.
 * Chaque mois, le locataire a le même effort logement que l’acheteur au départ
 * (mensualité + charges, figé sur toute la durée) : loyer payé sur ce budget,
 * surplus épargné (ou prélevé si le loyer dépasse cet effort).
 * Loyer et valeur du bien peuvent être revalorisés (taux annuels optionnels,
 * capitalisation mensuelle). Charges propriétaires constantes. Côté acheteur,
 * le surplus d’effort (mensualité + charges figées moins coût réel du mois) est
 * placé comme l’épargne locataire.
 */
export function calculateBuyVsRent(params: BuyVsRentInputs): BuyVsRentResult {
  const {
    propertyPrice,
    downPayment,
    upfrontFees,
    interestRate,
    loanDurationYears,
    horizonYears,
    monthlyRent,
    monthlyOwnerCosts,
    savingsReturnRate,
    propertyAppreciationRate,
    rentAppreciationRate,
  } = params;

  const netDownPayment = downPayment - upfrontFees;
  const loanAmount = Math.max(propertyPrice - netDownPayment, 0);
  const schedule =
    loanAmount > 0
      ? generateAmortizationSchedule({
          amount: loanAmount,
          interestRate,
          duration: loanDurationYears,
        })
      : [];

  const savingsMonthly = monthlyRateFromAnnual(savingsReturnRate);
  const propertyAppreciationMonthly = monthlyRateFromAnnual(
    propertyAppreciationRate,
  );
  const rentAppreciationMonthly = monthlyRateFromAnnual(rentAppreciationRate);

  const firstMortgage = schedule[0]?.monthlyPayment ?? 0;
  const monthlyOwnerTotal = firstMortgage + monthlyOwnerCosts;
  /** Effort logement figé (comme sur les outils type breakeven). */
  const monthlyHousingEffort = monthlyOwnerTotal;

  const totalMonths = Math.max(1, Math.round(horizonYears * 12));
  const points: BuyVsRentYearPoint[] = [];

  let propertyValue = propertyPrice;
  let renterPortfolio = downPayment;
  let ownerCashPortfolio = 0;
  let currentMonthlyRent = monthlyRent;
  let crossoverYear: number | null = null;

  const pushYearPoint = (year: number, buyNetWorth: number) => {
    points.push({
      year,
      buyNetWorth,
      rentNetWorth: renterPortfolio,
    });
    if (crossoverYear === null && year > 0 && buyNetWorth > renterPortfolio) {
      crossoverYear = year;
    }
  };

  pushYearPoint(0, propertyValue - loanAmount);

  for (let month = 1; month <= totalMonths; month++) {
    propertyValue *= 1 + propertyAppreciationMonthly;

    const scheduleRow = schedule[month - 1];
    const mortgagePayment = scheduleRow?.monthlyPayment ?? 0;
    const remainingLoan = scheduleRow?.remainingBalance ?? 0;
    const actualOwnerMonthly = mortgagePayment + monthlyOwnerCosts;
    const monthlyEffortSurplus = monthlyHousingEffort - actualOwnerMonthly;

    renterPortfolio *= 1 + savingsMonthly;
    renterPortfolio += monthlyHousingEffort - currentMonthlyRent;

    ownerCashPortfolio *= 1 + savingsMonthly;
    ownerCashPortfolio += monthlyEffortSurplus;

    const buyNetWorth =
      propertyValue - remainingLoan + ownerCashPortfolio;

    if (month % 12 === 0) {
      pushYearPoint(month / 12, buyNetWorth);
    }

    currentMonthlyRent *= 1 + rentAppreciationMonthly;
  }

  return {
    points,
    crossoverYear,
    monthlyOwnerTotal,
    monthlyRent,
    loanAmount,
  };
}
