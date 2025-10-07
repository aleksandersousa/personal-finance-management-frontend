export interface MonthlySummaryModel {
  month: string; // YYYY-MM
  summary: MonthlySummaryDataModel;
  categoryBreakdown?: CategoryBreakdownItemModel[];
  comparisonWithPrevious: PreviousMonthComparisonModel;
}

export interface MonthlySummaryDataModel {
  totalIncome: number; // em centavos
  totalExpenses: number; // em centavos
  balance: number; // em centavos
  fixedIncome: number; // em centavos
  dynamicIncome: number; // em centavos
  fixedExpenses: number; // em centavos
  dynamicExpenses: number; // em centavos
  entriesCount: {
    total: number;
    income: number;
    expenses: number;
  };
}

export interface CategoryBreakdownItemModel {
  categoryId: string;
  categoryName: string;
  type: 'INCOME' | 'EXPENSE';
  total: number; // em centavos
  count: number;
}

export interface PreviousMonthComparisonModel {
  incomeChange: number; // valor absoluto
  expenseChange: number; // valor absoluto
  balanceChange: number; // valor absoluto
  percentageChanges: {
    income: number;
    expense: number;
    balance: number;
  };
}
