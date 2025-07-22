import {
  LoadEntriesByMonth,
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
} from '@/domain/usecases/load-entries-by-month';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteLoadEntriesByMonth implements LoadEntriesByMonth {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(
    params: LoadEntriesByMonthParams
  ): Promise<LoadEntriesByMonthResult> {
    const { month, page = 1, limit = 20, type, categoryId } = params;
    const query = new URLSearchParams({
      month,
      page: String(page),
      limit: String(limit),
      ...(type ? { type } : {}),
      ...(categoryId ? { categoryId } : {}),
    }).toString();
    const response = await this.httpClient.get<unknown>(`${this.url}?${query}`);
    // O backend já retorna o formato correto
    return response as LoadEntriesByMonthResult;
  }
}
