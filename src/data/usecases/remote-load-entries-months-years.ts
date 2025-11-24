import {
  LoadEntriesMonthsYears,
  LoadEntriesMonthsYearsResult,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteLoadEntriesMonthsYears implements LoadEntriesMonthsYears {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async load(): Promise<LoadEntriesMonthsYearsResult> {
    const response = await this.httpClient.get<LoadEntriesMonthsYearsResult>(
      this.url
    );
    return response;
  }
}
