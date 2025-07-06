import {
  Authentication,
  AuthenticationParams,
  AuthenticationModel,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async auth(params: AuthenticationParams): Promise<AuthenticationModel> {
    const { email, password, rememberMe } = params;

    const response = await this.httpClient.post<unknown>(this.url, {
      email,
      password,
      rememberMe: rememberMe || false,
    });

    const { user, tokens } = response as AuthenticationModel;

    return { user, tokens };
  }
}
