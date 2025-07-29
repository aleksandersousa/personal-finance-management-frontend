import {
  LoadCashFlowForecast,
  LoadCashFlowForecastParams,
} from '@/domain/usecases/load-cash-flow-forecast';
import { CashFlowForecast } from '@/domain/models/cash-flow-forecast';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteLoadCashFlowForecast implements LoadCashFlowForecast {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(params: LoadCashFlowForecastParams): Promise<CashFlowForecast> {
    const queryParams = new URLSearchParams({
      period: params.filters.period.toString(),
      includeVariableProjections:
        params.filters.includeVariableProjections.toString(),
      confidenceThreshold: params.filters.confidenceThreshold,
    });

    const response = await this.httpClient.get<unknown>(
      `${this.url}/users/${params.userId}/cash-flow-forecast?${queryParams.toString()}`
    );

    // Type assertion com validação runtime seria ideal aqui
    const apiResponse = response as {
      id: string;
      userId: string;
      forecastPeriod: 3 | 6 | 12;
      monthlyData: Array<{
        month: string;
        projectedIncome: number;
        projectedExpenses: number;
        projectedBalance: number;
        cumulativeBalance: number;
        fixedIncomes: Array<{
          id: string;
          description: string;
          amount: number;
          type: 'INCOME' | 'EXPENSE';
          categoryId: string;
          categoryName: string;
          isFixed: true;
        }>;
        fixedExpenses: Array<{
          id: string;
          description: string;
          amount: number;
          type: 'INCOME' | 'EXPENSE';
          categoryId: string;
          categoryName: string;
          isFixed: true;
        }>;
        projectedVariableIncomes: number;
        projectedVariableExpenses: number;
        confidence: 'HIGH' | 'MEDIUM' | 'LOW';
      }>;
      generatedAt: string;
      basedOnDataUntil: string;
    };

    return {
      id: apiResponse.id,
      userId: apiResponse.userId,
      forecastPeriod: apiResponse.forecastPeriod,
      monthlyData: apiResponse.monthlyData.map(monthly => ({
        month: new Date(monthly.month),
        projectedIncome: monthly.projectedIncome,
        projectedExpenses: monthly.projectedExpenses,
        projectedBalance: monthly.projectedBalance,
        cumulativeBalance: monthly.cumulativeBalance,
        fixedIncomes: monthly.fixedIncomes,
        fixedExpenses: monthly.fixedExpenses,
        projectedVariableIncomes: monthly.projectedVariableIncomes,
        projectedVariableExpenses: monthly.projectedVariableExpenses,
        confidence: monthly.confidence,
      })),
      generatedAt: new Date(apiResponse.generatedAt),
      basedOnDataUntil: new Date(apiResponse.basedOnDataUntil),
    };
  }
}
