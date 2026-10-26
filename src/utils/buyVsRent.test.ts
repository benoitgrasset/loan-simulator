import { describe, expect, it } from "vitest";
import { calculateBuyVsRent } from "./calculations";

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
    });

    expect(result.crossoverYear).not.toBeNull();
    expect(result.points[0].buyNetWorth).toBeLessThan(
      result.points[0].rentNetWorth,
    );
  });
});
