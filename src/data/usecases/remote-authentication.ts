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
    const { email, password } = params;

    const response = await this.httpClient.post<AuthenticationModel>(this.url, {
      email,
      password,
    });

    const { user, tokens } = response;
    return { user, tokens };
  }
}
