import {
  LoadMonthlySummary,
  LoadMonthlySummaryParams,
} from '@/domain/usecases/load-monthly-summary';
import { MonthlySummaryModel } from '@/domain/models/monthly-summary';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteLoadMonthlySummary implements LoadMonthlySummary {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(params: LoadMonthlySummaryParams): Promise<MonthlySummaryModel> {
    const queryParams = new URLSearchParams({
      month: params.month,
      ...(params.includeCategories !== undefined && {
        includeCategories: params.includeCategories.toString(),
      }),
    });

    const endpoint = `${this.url}/summary?${queryParams.toString()}`;
    const response = await this.httpClient.get<MonthlySummaryModel>(endpoint);

    return response;
  }
}
