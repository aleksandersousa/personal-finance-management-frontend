export interface CashFlowForecast {
  id: string;
  userId: string;
  forecastPeriod: ForecastPeriod;
  monthlyData: MonthlyForecastData[];
  generatedAt: Date;
  basedOnDataUntil: Date;
}

export interface MonthlyForecastData {
  month: Date;
  projectedIncome: number; // Em centavos
  projectedExpenses: number; // Em centavos
  projectedBalance: number; // Em centavos
  cumulativeBalance: number; // Em centavos
  fixedIncomes: ForecastEntry[];
  fixedExpenses: ForecastEntry[];
  projectedVariableIncomes: number; // Em centavos
  projectedVariableExpenses: number; // Em centavos
  confidence: ConfidenceLevel;
}

export interface ForecastEntry {
  id: string;
  description: string;
  amount: number; // Em centavos
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  categoryName: string;
  isFixed: true; // Apenas entradas fixas aparecem na previsão
}

export type ForecastPeriod = 3 | 6 | 12; // Meses

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ForecastFilters {
  period: ForecastPeriod;
  includeVariableProjections: boolean;
  confidenceThreshold: ConfidenceLevel;
}
