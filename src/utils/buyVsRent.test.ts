import { describe, expect, it } from "vitest";
import {
  calculateBuyVsRent,
  formatDurationYearsMonths,
} from "./calculations";

describe("formatDurationYearsMonths", () => {
  it("formate années et mois", () => {
    expect(formatDurationYearsMonths(77)).toBe("6 ans et 5 mois");
    expect(formatDurationYearsMonths(12)).toBe("1 an");
    expect(formatDurationYearsMonths(5)).toBe("5 mois");
  });
});

describe("calculateBuyVsRent", () => {
  it("fait croître le patrimoine locataire avec un taux d’épargne positif sans loyer", () => {
    const result = calculateBuyVsRent({
      propertyPrice: 200_000,
      downPayment: 50_000,
      upfrontFees: 10_000,
      interestRate: 0,
      loanDurationYears: 20,
      horizonYears: 10,
      monthlyRent: 0,
      monthlyOwnerCosts: 0,
      savingsReturnRate: 12,
      propertyAppreciationRate: 0,
      rentAppreciationRate: 0,
    });

    const year10 = result.points.find((p) => p.year === 10);
    expect(year10).toBeDefined();
    expect(year10!.rentNetWorth).toBeGreaterThan(50_000);
  });

  it("repère un croisement lorsque le bien se revalorise fortement", () => {
    const result = calculateBuyVsRent({
      propertyPrice: 300_000,
      downPayment: 60_000,
      upfrontFees: 15_000,
      interestRate: 2,
      loanDurationYears: 25,
      horizonYears: 30,
      monthlyRent: 900,
      monthlyOwnerCosts: 200,
      savingsReturnRate: 1,
      propertyAppreciationRate: 4,
      rentAppreciationRate: 0,
    });

    expect(result.crossoverMonth).not.toBeNull();
    expect(result.points[0].buyNetWorth).toBeLessThan(
      result.points[0].rentNetWorth,
    );
  });

  it("épargne le surplus lorsque l’effort acheteur dépasse le loyer", () => {
    const base = {
      propertyPrice: 200_000,
      downPayment: 50_000,
      upfrontFees: 10_000,
      interestRate: 0,
      loanDurationYears: 20,
      horizonYears: 5,
      monthlyOwnerCosts: 0,
      savingsReturnRate: 0,
      propertyAppreciationRate: 0,
      rentAppreciationRate: 0,
    };
    const loanMonthly = (200_000 - 40_000) / (20 * 12);
    const withRent = calculateBuyVsRent({ ...base, monthlyRent: 1_000 });
    const withoutRent = calculateBuyVsRent({ ...base, monthlyRent: 0 });

    const year5With = withRent.points.find((p) => p.year === 5)!.rentNetWorth;
    const year5Without = withoutRent.points.find((p) => p.year === 5)!
      .rentNetWorth;
    expect(year5With).toBeLessThan(year5Without);
    expect(year5With).toBeCloseTo(
      50_000 + 5 * 12 * (loanMonthly - 1_000),
      0,
    );
  });

  it("fait croître le patrimoine locataire quand l’effort acheteur dépasse le loyer", () => {
    const result = calculateBuyVsRent({
      propertyPrice: 337_000,
      downPayment: 190_000,
      upfrontFees: 26_960,
      interestRate: 3.75,
      loanDurationYears: 25,
      horizonYears: 30,
      monthlyRent: 1_600,
      monthlyOwnerCosts: 360 + 1_650 / 12,
      savingsReturnRate: 3,
      propertyAppreciationRate: 1,
      rentAppreciationRate: 1,
    });

    const year30 = result.points.find((p) => p.year === 30)!.rentNetWorth;
    expect(year30).toBeGreaterThan(190_000);
  });

  it("continue de faire croître le patrimoine acheteur après la fin du crédit", () => {
    const result = calculateBuyVsRent({
      propertyPrice: 337_000,
      downPayment: 190_000,
      upfrontFees: 26_960,
      interestRate: 3.75,
      loanDurationYears: 25,
      horizonYears: 30,
      monthlyRent: 1600,
      monthlyOwnerCosts: 360 + 1650 / 12,
      savingsReturnRate: 3,
      propertyAppreciationRate: 1,
      rentAppreciationRate: 1,
    });

    const y24 = result.points.find((p) => p.year === 24)!.buyNetWorth;
    const y25 = result.points.find((p) => p.year === 25)!.buyNetWorth;
    const y30 = result.points.find((p) => p.year === 30)!.buyNetWorth;
    const gain2425 = y25 - y24;
    const gain2930 =
      y30 - result.points.find((p) => p.year === 29)!.buyNetWorth;
    expect(y30).toBeGreaterThan(y25);
    expect(gain2930).toBeGreaterThanOrEqual(gain2425 * 0.9);
  });

  it("ne plonge pas le patrimoine locataire à la fin du crédit (effort figé)", () => {
    const result = calculateBuyVsRent({
      propertyPrice: 337_000,
      downPayment: 190_000,
      upfrontFees: 26_960,
      interestRate: 3.75,
      loanDurationYears: 25,
      horizonYears: 30,
      monthlyRent: 1600,
      monthlyOwnerCosts: 360 + 1650 / 12,
      savingsReturnRate: 3,
      propertyAppreciationRate: 1,
      rentAppreciationRate: 1,
    });

    const y24 = result.points.find((p) => p.year === 24)!.rentNetWorth;
    const y30 = result.points.find((p) => p.year === 30)!.rentNetWorth;
    expect(y30).toBeGreaterThan(y24 * 0.95);
  });
});
