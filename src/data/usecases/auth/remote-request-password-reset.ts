import {
  RequestPasswordReset,
  RequestPasswordResetParams,
  RequestPasswordResetModel,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';

export class RemoteRequestPasswordReset implements RequestPasswordReset {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async request(
    params: RequestPasswordResetParams
  ): Promise<RequestPasswordResetModel> {
    const response = await this.httpClient.post<RequestPasswordResetModel>(
      this.url,
      {
        email: params.email,
      }
    );

    return {
      success: response.success,
      message: response.message,
    };
  }
}
