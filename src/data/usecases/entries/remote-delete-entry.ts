import {
  DeleteEntry,
  DeleteEntryParams,
} from '@/domain/usecases/entries/delete-entry';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteDeleteEntry implements DeleteEntry {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async delete(params: DeleteEntryParams): Promise<void> {
    const endpoint = params.deleteAllOccurrences
      ? `${this.url}/${params.id}?deleteAll=true`
      : `${this.url}/${params.id}`;

    await this.httpClient.delete<void>(endpoint);
  }
}
