export interface CategoryBreakdownResultModel {
  items: CategoryBreakdownItemModel[];
  incomeTotal: number;
  expenseTotal: number;
}

export interface MonthlySummaryModel {
  month: string; // YYYY-MM
  summary: MonthlySummaryDataModel;
  categoryBreakdown?: CategoryBreakdownResultModel;
  comparisonWithPrevious: PreviousMonthComparisonModel;
}

export interface MonthlySummaryDataModel {
  totalIncome: number; // em centavos
  totalExpenses: number; // em centavos (paid expenses only)
  totalPaidExpenses: number; // em centavos
  totalUnpaidExpenses: number; // em centavos
  balance: number; // em centavos
  fixedIncome: number; // em centavos
  dynamicIncome: number; // em centavos
  fixedExpenses: number; // em centavos (paid fixed expenses only)
  dynamicExpenses: number; // em centavos (paid dynamic expenses only)
  fixedPaidExpenses: number; // em centavos
  fixedUnpaidExpenses: number; // em centavos
  dynamicPaidExpenses: number; // em centavos
  dynamicUnpaidExpenses: number; // em centavos
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
  total: number; // em centavos (paid expenses only for expenses)
  count: number;
  unpaidAmount: number; // em centavos (only for expenses)
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
