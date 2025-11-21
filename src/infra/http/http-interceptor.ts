import { HttpClient } from '@/data/protocols/http';
import { GetStorage } from '@/data/protocols/storage';
import type { AuthTokens } from '@/domain';

export interface HttpInterceptorConfig {
  getStorage: GetStorage;
  onAuthError?: () => void;
}

export class HttpInterceptor implements HttpClient {
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: HttpInterceptorConfig
  ) {}

  private async getAccessToken(): Promise<string | null> {
    const tokens = (await this.config.getStorage.get('tokens')) as AuthTokens;
    return tokens?.accessToken || null;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const success = await this.refreshPromise;
      return success;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<boolean> {
    try {
      // Usar Server Action para refresh token
      const { refreshTokenAction } = await import(
        '@/presentation/actions/refresh-token-action'
      );
      const newTokens = await refreshTokenAction();

      if (!newTokens) {
        console.warn('Refresh token failed');
        return false;
      }

      console.log('Access token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  }

  private async makeRequestWithAuth<T>(
    requestFn: () => Promise<T>
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error: any) {
      // Verificar se é erro 401
      const statusCode =
        error.status || error.statusCode || error.response?.status;

      if (statusCode === 401) {
        console.log('401 detected, attempting to refresh token...');

        const refreshSuccess = await this.refreshAccessToken();

        if (refreshSuccess) {
          // Tentar novamente com o novo token
          console.log('Retrying request with new token...');
          return await requestFn();
        } else {
          // Refresh falhou, fazer logout
          console.warn('Refresh failed, triggering logout');
          this.config.onAuthError?.();
          throw new Error('Authentication failed');
        }
      }

      throw error;
    }
  }

  async get<T = unknown>(url: string, config?: unknown): Promise<T> {
    return this.makeRequestWithAuth(async () => {
      const accessToken = await this.getAccessToken();
      const configWithAuth = {
        ...((config as Record<string, unknown>) || {}),
        headers: {
          ...(config as any)?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      };
      return this.httpClient.get<T>(url, configWithAuth);
    });
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    return this.makeRequestWithAuth(async () => {
      const accessToken = await this.getAccessToken();
      const configWithAuth = {
        ...((config as Record<string, unknown>) || {}),
        headers: {
          ...(config as any)?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      };
      return this.httpClient.post<T>(url, data, configWithAuth);
    });
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: unknown
  ): Promise<T> {
    return this.makeRequestWithAuth(async () => {
      const accessToken = await this.getAccessToken();
      const configWithAuth = {
        ...((config as Record<string, unknown>) || {}),
        headers: {
          ...(config as any)?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      };
      return this.httpClient.put<T>(url, data, configWithAuth);
    });
  }

  async delete<T = unknown>(url: string, config?: unknown): Promise<T> {
    return this.makeRequestWithAuth(async () => {
      const accessToken = await this.getAccessToken();
      const configWithAuth = {
        ...((config as Record<string, unknown>) || {}),
        headers: {
          ...(config as any)?.headers,
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      };
      return this.httpClient.delete<T>(url, configWithAuth);
    });
  }
}
