import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_INTEREST_RATE, DURATION } from "../constants";

interface FinancialState {
  duration: number;
  interestRate: number;
  setDuration: (duration: number) => void;
  setInterestRate: (interestRate: number) => void;
  resetDuration: () => void;
  resetInterestRate: () => void;
  resetAll: () => void;
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      duration: DURATION,
      interestRate: DEFAULT_INTEREST_RATE,
      setDuration: (duration: number) => set({ duration }),
      setInterestRate: (interestRate: number) => set({ interestRate }),
      resetDuration: () => set({ duration: DURATION }),
      resetInterestRate: () => set({ interestRate: DEFAULT_INTEREST_RATE }),
      resetAll: () =>
        set({ duration: DURATION, interestRate: DEFAULT_INTEREST_RATE }),
    }),
    {
      name: "financial-storage", // updated storage name
    }
  )
);
