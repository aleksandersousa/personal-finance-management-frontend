import { UpdateEntry, UpdateEntryParams } from '@/domain/usecases';
import { EntryModel } from '@/domain/models/entry';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteUpdateEntry implements UpdateEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async update(params: UpdateEntryParams): Promise<EntryModel> {
    // Ensure date is a Date object before calling toISOString
    const date =
      params.date instanceof Date ? params.date : new Date(params.date);

    const httpResponse = await this.httpClient.put<unknown>(
      `${this.url}/${params.id}`,
      {
        description: params.description,
        amount: params.amount,
        type: params.type,
        categoryId: params.categoryId,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        isFixed: params.isFixed,
        isPaid: params.isPaid,
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
      isPaid: boolean;
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
      isPaid: apiResponse.isPaid ?? false,
      createdAt: new Date(apiResponse.createdAt),
      updatedAt: new Date(apiResponse.updatedAt),
    };
  }
}
