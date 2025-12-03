import { UpdateEntry, UpdateEntryParams } from '@/domain/usecases';
import { EntryModel } from '@/domain/models/entry';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteUpdateEntry implements UpdateEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async update(params: UpdateEntryParams): Promise<EntryModel> {
    const httpResponse = await this.httpClient.put<unknown>(
      `${this.url}/${params.id}`,
      {
        description: params.description,
        amount: params.amount,
        type: params.type,
        categoryId: params.categoryId,
        date: params.date.toISOString().split('T')[0], // YYYY-MM-DD
        isFixed: params.isFixed,
      }
    );

    const apiResponse = httpResponse as {
      id: string;
      description: string;
      amount: number;
      type: 'INCOME' | 'EXPENSE';
      categoryId: string;
      categoryName?: string;
      userId: string;
      date: string;
      isFixed: boolean;
      createdAt: string;
      updatedAt: string;
    };

    return {
      id: apiResponse.id,
      description: apiResponse.description,
      amount: apiResponse.amount,
      type: apiResponse.type,
      categoryId: apiResponse.categoryId,
      categoryName: apiResponse.categoryName || 'Unknown',
      userId: apiResponse.userId,
      date: new Date(apiResponse.date),
      isFixed: apiResponse.isFixed,
      createdAt: new Date(apiResponse.createdAt),
      updatedAt: new Date(apiResponse.updatedAt),
    };
  }
}
