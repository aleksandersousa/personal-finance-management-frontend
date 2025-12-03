import { AddCategory, AddCategoryParams } from '@/domain/usecases';
import { CategoryModel } from '@/domain/models/category';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteAddCategory implements AddCategory {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async add(params: AddCategoryParams): Promise<CategoryModel> {
    const response = await this.httpClient.post<CategoryModel>(
      this.url,
      params
    );
    return response;
  }
}
