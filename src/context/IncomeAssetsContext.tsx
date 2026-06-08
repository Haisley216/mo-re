import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { OnboardingData } from './OnboardingContext';

export type ItemCategory = '소득' | '금융 재산' | '일반 재산';

export interface AssetRow {
  label: string;
  amount: number;
  category: ItemCategory;
}

interface IncomeAssetsContextValue {
  rows: AssetRow[];
  initRows: (rows: AssetRow[]) => void;
  addRow: (row: AssetRow) => void;
  updateAmount: (label: string, amount: number) => void;
  deleteRow: (label: string) => void;
}

const STORAGE_KEY = 'mo_re_income_assets';
const ONBOARDING_KEY = 'mo_re_onboarding';

export function buildInitialRows(data: OnboardingData): AssetRow[] {
  const rows: AssetRow[] = [];
  if (data.earnedIncome > 0)
    rows.push({ label: '근로 소득', amount: data.earnedIncome, category: '소득' });
  if (data.businessIncome > 0)
    rows.push({ label: '사업 소득', amount: data.businessIncome, category: '소득' });
  if (data.financialAssets > 0)
    rows.push({ label: '예금', amount: data.financialAssets, category: '금융 재산' });
  if (data.residentialProperty > 0)
    rows.push({ label: '주거용 재산', amount: data.residentialProperty, category: '일반 재산' });
  return rows;
}

function loadRows(): AssetRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    // No saved rows — try to seed from onboarding data (handles app reload after onboarding)
    const onboardingRaw = localStorage.getItem(ONBOARDING_KEY);
    if (onboardingRaw) {
      const stored = JSON.parse(onboardingRaw);
      if (stored?.data) {
        const seeded = buildInitialRows(stored.data);
        if (seeded.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
          return seeded;
        }
      }
    }
    return [];
  } catch {
    return [];
  }
}

function persist(rows: AssetRow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

const IncomeAssetsContext = createContext<IncomeAssetsContextValue | null>(null);

export function IncomeAssetsProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<AssetRow[]>(loadRows);

  function update(next: AssetRow[]) {
    setRows(next);
    persist(next);
  }

  return (
    <IncomeAssetsContext.Provider
      value={{
        rows,
        initRows: (r) => update(r),
        addRow: (row) => update([...rows, row]),
        updateAmount: (label, amount) =>
          update(rows.map((r) => (r.label === label ? { ...r, amount } : r))),
        deleteRow: (label) => update(rows.filter((r) => r.label !== label)),
      }}
    >
      {children}
    </IncomeAssetsContext.Provider>
  );
}

export function useIncomeAssets() {
  const ctx = useContext(IncomeAssetsContext);
  if (!ctx) throw new Error('useIncomeAssets must be used within IncomeAssetsProvider');
  return ctx;
}
