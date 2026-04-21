import { AddEntry, AddEntryParams } from '@/domain/usecases';
import { EntryModel } from '@/domain/models';
import { HttpClient } from '@/data/protocols';

export class RemoteAddEntry implements AddEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async add(params: AddEntryParams): Promise<EntryModel> {
    const requestParams = {
      description: params.description,
      amount: params.amount,
      issueDate: params.issueDate.toISOString(),
      dueDate: params.dueDate.toISOString(),
      categoryId: params.categoryId,
      recurrenceId: params.recurrenceId,
    };
    const response = await this.httpClient.post<EntryModel>(
      this.url,
      requestParams
    );

    return {
      id: response.id,
      recurrenceId: response.recurrenceId,
      userId: response.userId,
      categoryId: response.categoryId,
      description: response.description,
      amount: response.amount,
      issueDate: new Date(response.issueDate),
      dueDate: new Date(response.dueDate),
      isPaid: response.isPaid ?? false,
      entryType: response.entryType,
      categoryName: response.categoryName || null,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }
}
