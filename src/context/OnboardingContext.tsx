import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface OnboardingData {
  householdSize: number;
  region: string;
  age: number;
  earnedIncome: number;
  businessIncome: number;
  financialAssets: number;
  residentialProperty: number;
}

interface OnboardingContextValue {
  data: OnboardingData | null;
  completed: boolean;
  complete: (data: OnboardingData) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [completed, setCompleted] = useState(false);

  function complete(newData: OnboardingData) {
    setData(newData);
    setCompleted(true);
  }

  return (
    <OnboardingContext.Provider value={{ data, completed, complete }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
