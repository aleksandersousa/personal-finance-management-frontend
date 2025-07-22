export interface MonthlySummaryModel {
  month: string; // YYYY-MM
  totalIncome: number; // em centavos
  totalExpenses: number; // em centavos
  balance: number; // em centavos
  entriesCount: number;
  categories: CategorySummaryModel[];
  comparison?: ComparisonModel;
}

export interface CategorySummaryModel {
  categoryId: string;
  categoryName: string;
  total: number; // em centavos
  count: number;
  type: 'INCOME' | 'EXPENSE';
}

export interface ComparisonModel {
  previousMonth: string; // YYYY-MM
  incomeChange: number; // percentual de mudança
  expenseChange: number; // percentual de mudança
  balanceChange: number; // percentual de mudança
}
