import { AddEntry, AddEntryParams } from '@/domain/usecases';
import { EntryModel } from '@/domain/models';
import { HttpClient } from '@/data/protocols';

export class RemoteAddEntry implements AddEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async add(params: AddEntryParams): Promise<EntryModel> {
    const response = await this.httpClient.post<EntryModel>(this.url, params);

    return {
      id: response.id,
      description: response.description,
      amount: response.amount,
      type: response.type,
      categoryId: response.categoryId,
      categoryName: response.categoryName || 'Desconhecida',
      userId: response.userId,
      isFixed: response.isFixed,
      date: new Date(response.date),
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }
}
