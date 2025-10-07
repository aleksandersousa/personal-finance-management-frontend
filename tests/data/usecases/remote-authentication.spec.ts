import { RemoteAuthentication } from '@/data/usecases';
import { AuthenticationParams } from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';

const mockHttpClient: jest.Mocked<HttpClient> = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('RemoteAuthentication', () => {
  let sut: RemoteAuthentication;
  const url = 'http://localhost:3001/auth/login';

  beforeEach(() => {
    sut = new RemoteAuthentication(url, mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call HttpClient.post with correct values', async () => {
    const params: AuthenticationParams = {
      email: 'test@example.com',
      password: 'validPassword123',
    };

    const mockResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'test@example.com',
      },
      tokens: {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        expiresIn: 900,
      },
    };

    mockHttpClient.post.mockResolvedValueOnce(mockResponse);

    await sut.auth(params);

    expect(mockHttpClient.post).toHaveBeenCalledWith(url, {
      email: params.email,
      password: params.password,
    });
  });

  it('should return AuthenticationModel on success', async () => {
    const params: AuthenticationParams = {
      email: 'test@example.com',
      password: 'validPassword123',
    };

    const mockResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'test@example.com',
      },
      tokens: {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        expiresIn: 900,
      },
    };

    mockHttpClient.post.mockResolvedValueOnce(mockResponse);

    const result = await sut.auth(params);

    expect(result).toEqual({
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'test@example.com',
      },
      tokens: {
        accessToken: 'valid-access-token',
        refreshToken: 'valid-refresh-token',
        expiresIn: 900,
      },
    });
  });

  it('should throw if HttpClient throws', async () => {
    const params: AuthenticationParams = {
      email: 'test@example.com',
      password: 'validPassword123',
    };

    mockHttpClient.post.mockRejectedValueOnce(new Error('Network error'));

    const promise = sut.auth(params);

    await expect(promise).rejects.toThrow('Network error');
  });
});
