import { MonthlySummaryModel } from '../models/monthly-summary';

export interface LoadMonthlySummary {
  load(params: LoadMonthlySummaryParams): Promise<MonthlySummaryModel>;
}

export interface LoadMonthlySummaryParams {
  month: string; // YYYY-MM
  includeCategories?: boolean; // Incluir breakdown de categorias
  userId: string; // User ID para autenticação
}
