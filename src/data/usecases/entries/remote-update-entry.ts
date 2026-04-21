import { UpdateEntry, UpdateEntryParams } from '@/domain/usecases';
import { EntryModel } from '@/domain/models/entry';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteUpdateEntry implements UpdateEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async update(params: UpdateEntryParams): Promise<EntryModel> {
    const httpResponse = await this.httpClient.put<EntryModel>(
      `${this.url}/${params.id}`,
      {
        description: params.description,
        amount: params.amount,
        issueDate: params.issueDate.toISOString(),
        dueDate: params.dueDate.toISOString(),
        categoryId: params.categoryId,
        recurrenceId: params.recurrenceId,
        recurrenceType: params.recurrenceType,
      }
    );

    return {
      id: httpResponse.id,
      recurrenceId: httpResponse.recurrenceId,
      userId: httpResponse.userId,
      categoryId: httpResponse.categoryId,
      description: httpResponse.description,
      amount: httpResponse.amount,
      issueDate: new Date(httpResponse.issueDate),
      dueDate: new Date(httpResponse.dueDate),
      isPaid: httpResponse.isPaid ?? false,
      entryType: httpResponse.entryType,
      categoryName: httpResponse.categoryName || null,
      createdAt: new Date(httpResponse.createdAt),
      updatedAt: new Date(httpResponse.updatedAt),
    };
  }
}
