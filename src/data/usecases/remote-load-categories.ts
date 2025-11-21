import {
  LoadCategories,
  LoadCategoriesParams,
} from '@/domain/usecases/load-categories';
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

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${this.url}?${queryString}` : this.url;

    const response =
      await this.httpClient.get<CategoryListResponseModel>(endpoint);
    return response;
  }
}
