import {
  CashFlowForecast,
  ForecastFilters,
} from '../models/cash-flow-forecast';

export interface LoadCashFlowForecast {
  load(params: LoadCashFlowForecastParams): Promise<CashFlowForecast>;
}

export interface LoadCashFlowForecastParams {
  userId: string;
  filters: ForecastFilters;
}
