import { MonthlySummaryModel } from '../models/monthly-summary';

export interface LoadMonthlySummary {
  load(params: LoadMonthlySummaryParams): Promise<MonthlySummaryModel>;
}

export interface LoadMonthlySummaryParams {
  month: string; // YYYY-MM
  includeComparison?: boolean; // Incluir comparação com mês anterior
}
