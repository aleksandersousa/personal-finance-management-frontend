import {
  UpdateCategory,
  UpdateCategoryParams,
} from '@/domain/usecases/update-category';
import { CategoryModel } from '@/domain/models/category';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteUpdateCategory implements UpdateCategory {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async update(params: UpdateCategoryParams): Promise<CategoryModel> {
    const { id, ...updateData } = params;
    const response = await this.httpClient.put<CategoryModel>(
      `${this.url}/${id}`,
      updateData
    );
    return response;
  }
}
