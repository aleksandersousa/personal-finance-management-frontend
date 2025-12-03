import {
  ResendVerificationEmail,
  ResendVerificationEmailParams,
  ResendVerificationEmailModel,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';

export class RemoteResendVerificationEmail implements ResendVerificationEmail {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async resend(
    params: ResendVerificationEmailParams
  ): Promise<ResendVerificationEmailModel> {
    const response = await this.httpClient.post<ResendVerificationEmailModel>(
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
