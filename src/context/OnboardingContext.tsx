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

const STORAGE_KEY = 'mo_re_onboarding';

function loadFromStorage(): { data: OnboardingData; completed: boolean } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  const [data, setData] = useState<OnboardingData | null>(stored?.data ?? null);
  const [completed, setCompleted] = useState(stored?.completed ?? false);

  function complete(newData: OnboardingData) {
    setData(newData);
    setCompleted(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: newData, completed: true }));
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
