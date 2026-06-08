export type MonthKey = '1' | '2' | '3' | '4';

export interface MonthReport {
  label: string;
  chartValueLabel: string;
  chartHeight: number;
  reportTitle: string;
  summary: string;
  composition: {
    earnedIncome: number;
    earnedIncomeAssessment: number;
    financialAssets: number;
    financialConversion: number;
    generalAssets: number;
    generalConversion: number;
  };
}

export const monthOrder: MonthKey[] = ['1', '2', '3', '4'];

export const monthData: Record<MonthKey, MonthReport> = {
  '1': {
    label: '2월',
    chartValueLabel: '62만원',
    chartHeight: 54,
    reportTitle: '2월 리포트',
    summary: '1월보다 근로소득이 약 3만원 감소했어요',
    composition: {
      earnedIncome: 820_000,
      earnedIncomeAssessment: 550_000,
      financialAssets: 1_800_000,
      financialConversion: 3_200,
      generalAssets: 4_800_000,
      generalConversion: 6_200,
    },
  },
  '2': {
    label: '3월',
    chartValueLabel: '64만원',
    chartHeight: 58,
    reportTitle: '3월 리포트',
    summary: '2월보다 근로 소득이 약 5만원 정도 증가했어요',
    composition: {
      earnedIncome: 870_000,
      earnedIncomeAssessment: 580_000,
      financialAssets: 1_900_000,
      financialConversion: 3_400,
      generalAssets: 4_900_000,
      generalConversion: 6_300,
    },
  },
  '3': {
    label: '4월',
    chartValueLabel: '53만원',
    chartHeight: 49,
    reportTitle: '4월 리포트',
    summary: '3월보다 근로 소득이 약 11만원 정도 감소했어요',
    composition: {
      earnedIncome: 760_000,
      earnedIncomeAssessment: 510_000,
      financialAssets: 2_000_000,
      financialConversion: 3_500,
      generalAssets: 5_000_000,
      generalConversion: 6_400,
    },
  },
  '4': {
    label: '5월',
    chartValueLabel: '61만원',
    chartHeight: 55,
    reportTitle: '5월 리포트',
    summary: '4월보다 근로 소득이 약 14만원 정도 증가했어요',
    composition: {
      earnedIncome: 890_000,
      earnedIncomeAssessment: 599_000,
      financialAssets: 2_050_000,
      financialConversion: 3_600,
      generalAssets: 5_000_000,
      generalConversion: 6_500,
    },
  },
};

export function formatCurrency(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}
