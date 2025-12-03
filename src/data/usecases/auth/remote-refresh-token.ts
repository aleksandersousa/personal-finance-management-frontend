import { RefreshToken, RefreshTokenModel } from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';

export class RemoteRefreshToken implements RefreshToken {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async refresh(refreshToken: string): Promise<RefreshTokenModel> {
    const response = await this.httpClient.post<unknown>(this.url, {
      refreshToken,
    });

    // Type assertion baseada na documentação da API
    const apiResponse = response as {
      accessToken: string;
      expiresIn: number;
    };

    return {
      accessToken: apiResponse.accessToken,
      expiresIn: apiResponse.expiresIn,
    };
  }
}
