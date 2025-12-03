import { LoadCategories, LoadCategoriesParams } from '@/domain/usecases';
import { CategoryListResponseModel } from '@/domain/models/category';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteLoadCategories implements LoadCategories {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(
    params?: LoadCategoriesParams
  ): Promise<CategoryListResponseModel> {
    const queryParams = new URLSearchParams();

    if (params?.type && params.type !== 'all') {
      queryParams.append('type', params.type);
    }

    if (params?.includeStats !== undefined) {
      queryParams.append('includeStats', params.includeStats.toString());
    }

    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }

    if (params?.limit !== undefined) {
      queryParams.append('limit', String(params.limit));
    }

    if (params?.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${this.url}?${queryString}` : this.url;

    const response =
      await this.httpClient.get<CategoryListResponseModel>(endpoint);
    return response;
  }
}
