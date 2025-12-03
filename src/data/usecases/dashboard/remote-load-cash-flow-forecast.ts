import {
  LoadCashFlowForecast,
  LoadCashFlowForecastParams,
} from '@/domain/usecases/load-cash-flow-forecast';
import { CashFlowForecastModel } from '@/domain/models/cash-flow-forecast';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteLoadCashFlowForecast implements LoadCashFlowForecast {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(
    params: LoadCashFlowForecastParams
  ): Promise<CashFlowForecastModel> {
    const queryParams = new URLSearchParams();

    if (params.months !== undefined) {
      queryParams.append('months', params.months.toString());
    }
    if (params.includeFixed !== undefined) {
      queryParams.append('includeFixed', params.includeFixed.toString());
    }
    if (params.includeRecurring !== undefined) {
      queryParams.append(
        'includeRecurring',
        params.includeRecurring.toString()
      );
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${this.url}/forecast?${queryString}`
      : `${this.url}/forecast`;

    const response = await this.httpClient.get<CashFlowForecastModel>(endpoint);

    return response;
  }
}
