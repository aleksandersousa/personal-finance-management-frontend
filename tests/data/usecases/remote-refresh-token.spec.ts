import { RemoteRefreshToken } from '@/data/usecases';
import { HttpClient } from '@/data/protocols';

const mockHttpClient: jest.Mocked<HttpClient> = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('RemoteRefreshToken', () => {
  let sut: RemoteRefreshToken;
  const url = 'http://localhost:3001/auth/refresh';

  beforeEach(() => {
    sut = new RemoteRefreshToken(url, mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call HttpClient.post with correct values', async () => {
    const refreshToken = 'valid-refresh-token';

    const mockResponse = {
      accessToken: 'new-access-token',
      expiresIn: 3600,
    };

    mockHttpClient.post.mockResolvedValueOnce(mockResponse);

    await sut.refresh(refreshToken);

    expect(mockHttpClient.post).toHaveBeenCalledWith(url, {
      refreshToken,
    });
  });

  it('should return RefreshTokenModel on success', async () => {
    const refreshToken = 'valid-refresh-token';

    const mockResponse = {
      accessToken: 'new-access-token',
      expiresIn: 3600,
    };

    mockHttpClient.post.mockResolvedValueOnce(mockResponse);

    const result = await sut.refresh(refreshToken);

    expect(result).toEqual({
      accessToken: 'new-access-token',
      expiresIn: 3600,
    });
  });

  it('should throw if HttpClient throws', async () => {
    const refreshToken = 'invalid-refresh-token';

    mockHttpClient.post.mockRejectedValueOnce(
      new Error('Invalid refresh token')
    );

    const promise = sut.refresh(refreshToken);

    await expect(promise).rejects.toThrow('Invalid refresh token');
  });

  it('should handle different expiration times', async () => {
    const refreshToken = 'valid-refresh-token';

    const mockResponse = {
      accessToken: 'new-access-token',
      expiresIn: 900, // 15 minutes
    };

    mockHttpClient.post.mockResolvedValueOnce(mockResponse);

    const result = await sut.refresh(refreshToken);

    expect(result).toEqual({
      accessToken: 'new-access-token',
      expiresIn: 900,
    });
  });
});
