import {
  DeleteCategory,
  DeleteCategoryParams,
  DeleteCategoryResult,
} from '@/domain/usecases/categories/delete-category';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteDeleteCategory implements DeleteCategory {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async delete(params: DeleteCategoryParams): Promise<DeleteCategoryResult> {
    const response = await this.httpClient.delete<DeleteCategoryResult>(
      `${this.url}/${params.id}`
    );
    return response;
  }
}
