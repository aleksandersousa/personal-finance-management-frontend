// Models matching API DTOs
export interface CashFlowForecastModel {
  forecastPeriod: ForecastPeriodModel;
  currentBalance: number; // em centavos
  monthlyProjections: MonthlyProjectionModel[];
  summary: ForecastSummaryModel;
  insights: ForecastInsightsModel;
}

export interface ForecastPeriodModel {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  monthsCount: number;
}

export interface MonthlyProjectionModel {
  month: string; // YYYY-MM
  projectedIncome: number; // em centavos
  projectedExpenses: number; // em centavos
  netFlow: number; // em centavos
  cumulativeBalance: number; // em centavos
  confidence: 'high' | 'medium' | 'low';
}

export interface ForecastSummaryModel {
  totalProjectedIncome: number; // em centavos
  totalProjectedExpenses: number; // em centavos
  totalNetFlow: number; // em centavos
  finalBalance: number; // em centavos
  averageMonthlyFlow: number; // em centavos
}

export interface ForecastInsightsModel {
  trend: 'positive' | 'negative' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}
