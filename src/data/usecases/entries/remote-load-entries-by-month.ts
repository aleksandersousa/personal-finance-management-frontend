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
      type,
      categoryId,
      search,
      isPaid,
    } = params;
    const query = new URLSearchParams({
      month,
      page: String(page),
      limit: String(limit),
      ...(type ? { type } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(search && search.trim() ? { search: search.trim() } : {}),
      ...(isPaid !== undefined && isPaid !== 'all'
        ? { isPaid: String(isPaid) }
        : {}),
    }).toString();
    const response = await this.httpClient.get<LoadEntriesByMonthResult>(
      `${this.url}?${query}`
    );
    return response;
  }
}
