import { HttpClient } from '@/data/protocols/http';
import { GetStorage } from '@/data/protocols/storage';
import type { AuthTokens } from '@/domain';

export class AuthorizeHttpClientDecorator implements HttpClient {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly httpClient: HttpClient
  ) {}

  private addAuthorizationHeader(config?: unknown): unknown {
    const tokens = this.getStorage.get('tokens') as AuthTokens;

    if (tokens?.accessToken) {
      const configObj = config as Record<string, unknown> | undefined;
      return {
        ...configObj,
        headers: {
          ...(configObj?.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      };
    }

    return config;
  }

  async get<T = unknown>(url: string, config?: unknown): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.get<T>(url, configWithAuth);
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.post<T>(url, data, configWithAuth);
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.put<T>(url, data, configWithAuth);
  }

  async delete<T = unknown>(url: string, config?: unknown): Promise<T> {
    const configWithAuth = this.addAuthorizationHeader(config);
    return this.httpClient.delete<T>(url, configWithAuth);
  }
}
