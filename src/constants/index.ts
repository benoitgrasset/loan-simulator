export const DURATION = 25; // Durée du crédit en années
export const DEFAULT_INTEREST_RATE = 3.7; // Taux d'intérêt en %
export const DEFAULT_PROPERTY_VALUE = 337000; // Valeur du bien en €
export const DEFAULT_DOWN_PAYMENT = 140000; // Apport en €
export const DEFAULT_MONTHLY_CHARGES = 360; // Frais mensuels en €
export const DEFAULT_PROPERTY_TAX = 1650; // Taxes foncières en €
export const DEFAULT_EDF = 50; // Frais EDF en €
export const DEFAULT_WORKS = 42000; // Frais de travaux en €

// Frais
export const DEFAULT_GUARANTEE_FEES = 2427; // Frais de garantie en €
export const DEFAULT_APPLICATION_FEES = 1200; // Frais d'application en €

export type PropertyType = "Neuf" | "Ancien"; // Type de bien

export const NOTARY_RATE: Record<PropertyType, number> = { Neuf: 2, Ancien: 8 };
export const BROKER_FEES: Record<PropertyType, number> = {
  Neuf: 0,
  Ancien: 4000,
};
