import {
  LoadEntriesByMonth,
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols/http';

export class RemoteLoadEntriesByMonth implements LoadEntriesByMonth {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(
    params: LoadEntriesByMonthParams
  ): Promise<LoadEntriesByMonthResult> {
    const {
      month,
      page = 1,
      limit = 20,
      category,
      search,
      sort,
      order,
    } = params;
    const query = new URLSearchParams({
      month,
      page: String(page),
      limit: String(limit),
      ...(category ? { category } : {}),
      ...(search && search.trim() ? { search: search.trim() } : {}),
      ...(sort ? { sort } : {}),
      ...(order ? { order } : {}),
    }).toString();
    const response = await this.httpClient.get<LoadEntriesByMonthResult>(
      `${this.url}?${query}`
    );
    return response;
  }
}
