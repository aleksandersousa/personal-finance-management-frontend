import {
  ResetPassword,
  ResetPasswordParams,
  ResetPasswordModel,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';

export class RemoteResetPassword implements ResetPassword {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async reset(params: ResetPasswordParams): Promise<ResetPasswordModel> {
    const response = await this.httpClient.post<ResetPasswordModel>(this.url, {
      token: params.token,
      newPassword: params.newPassword,
    });

    return {
      success: response.success,
      message: response.message,
    };
  }
}
