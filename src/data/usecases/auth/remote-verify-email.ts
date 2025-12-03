import {
  VerifyEmail,
  VerifyEmailParams,
  VerifyEmailModel,
} from '@/domain/usecases/auth/verify-email';
import { HttpClient } from '@/data/protocols';

export class RemoteVerifyEmail implements VerifyEmail {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async verify(params: VerifyEmailParams): Promise<VerifyEmailModel> {
    const response = await this.httpClient.post<VerifyEmailModel>(this.url, {
      token: params.token,
    });

    return {
      success: response.success,
      message: response.message,
    };
  }
}
