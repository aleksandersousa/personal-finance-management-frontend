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
    const response = await this.httpClient.post<unknown>(this.url, {
      email: params.email,
      password: params.password,
      rememberMe: params.rememberMe || false,
    });

    // Type assertion baseada na documentação da API
    const apiResponse = response as {
      user: {
        id: string;
        name: string;
        email: string;
      };
      tokens: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
    };

    return {
      user: {
        id: apiResponse.user.id,
        name: apiResponse.user.name,
        email: apiResponse.user.email,
      },
      tokens: {
        accessToken: apiResponse.tokens.accessToken,
        refreshToken: apiResponse.tokens.refreshToken,
        expiresIn: apiResponse.tokens.expiresIn,
      },
    };
  }
}
