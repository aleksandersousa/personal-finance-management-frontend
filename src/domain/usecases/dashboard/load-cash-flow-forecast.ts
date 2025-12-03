import { CashFlowForecastModel } from '@/domain/models';

export interface LoadCashFlowForecast {
  load(params: LoadCashFlowForecastParams): Promise<CashFlowForecastModel>;
}

export interface LoadCashFlowForecastParams {
  userId: string;
  months?: number; // 1-12, default 3
  includeFixed?: boolean; // default true
  includeRecurring?: boolean; // default false
}
