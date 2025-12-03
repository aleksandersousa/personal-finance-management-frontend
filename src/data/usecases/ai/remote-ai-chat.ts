import { AiChat } from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';
import type { AiChatRequest, AiChatResponse } from '@/domain';

export class RemoteAiChat implements AiChat {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async ask(request: AiChatRequest): Promise<AiChatResponse> {
    const response = await this.httpClient.post<{
      sql: string;
      rows: unknown[];
      answer: string;
    }>(this.url, request);

    return {
      answer: response.answer,
      sql: response.sql,
      rows: response.rows,
    };
  }
}
