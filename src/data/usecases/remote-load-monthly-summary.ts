import {
  LoadMonthlySummary,
  LoadMonthlySummaryParams,
} from '@/domain/usecases/load-monthly-summary';
import {
  MonthlySummaryModel,
  CategorySummaryModel,
  ComparisonModel,
} from '@/domain/models/monthly-summary';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteLoadMonthlySummary implements LoadMonthlySummary {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(params: LoadMonthlySummaryParams): Promise<MonthlySummaryModel> {
    const endpoint = params.includeComparison
      ? `${this.url}/summary/monthly?month=${params.month}&includeComparison=true`
      : `${this.url}/summary/monthly?month=${params.month}`;

    const httpResponse = await this.httpClient.get<unknown>(endpoint);

    const apiResponse = httpResponse as {
      month: string;
      totalIncome: number;
      totalExpenses: number;
      balance: number;
      entriesCount: number;
      categories: Array<{
        categoryId: string;
        categoryName: string;
        total: number;
        count: number;
        type: 'INCOME' | 'EXPENSE';
      }>;
      comparison?: {
        previousMonth: string;
        incomeChange: number;
        expenseChange: number;
        balanceChange: number;
      };
    };

    const categories: CategorySummaryModel[] = apiResponse.categories.map(
      cat => ({
        categoryId: cat.categoryId,
        categoryName: cat.categoryName,
        total: cat.total,
        count: cat.count,
        type: cat.type,
      })
    );

    const comparison: ComparisonModel | undefined = apiResponse.comparison
      ? {
          previousMonth: apiResponse.comparison.previousMonth,
          incomeChange: apiResponse.comparison.incomeChange,
          expenseChange: apiResponse.comparison.expenseChange,
          balanceChange: apiResponse.comparison.balanceChange,
        }
      : undefined;

    return {
      month: apiResponse.month,
      totalIncome: apiResponse.totalIncome,
      totalExpenses: apiResponse.totalExpenses,
      balance: apiResponse.balance,
      entriesCount: apiResponse.entriesCount,
      categories,
      comparison,
    };
  }
}
