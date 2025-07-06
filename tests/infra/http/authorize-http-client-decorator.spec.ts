import { AuthorizeHttpClientDecorator } from '@/main/decorators/authorize-http-client-decorator';
import type { GetStorage } from '@/data/protocols/storage';
import type { AuthTokens } from '@/domain';

describe('AuthorizeHttpClientDecorator', () => {
  const makeHttpClient = () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  });

  const makeGetStorage = (tokens: AuthTokens | null = null): GetStorage => ({
    get: jest.fn().mockReturnValue(tokens),
  });

  const url = '/any-url';
  const data = { foo: 'bar' };
  const config = { headers: { 'X-Test': '1' } };

  it('should add Authorization header if accessToken exists', async () => {
    const tokens = { accessToken: 'abc123' } as AuthTokens;
    const getStorage = makeGetStorage(tokens);
    const httpClient = makeHttpClient();
    const sut = new AuthorizeHttpClientDecorator(getStorage, httpClient);

    await sut.get(url, config);

    expect(httpClient.get).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer abc123',
        }),
      })
    );
  });

  it('should not add Authorization header if no accessToken', async () => {
    const getStorage = makeGetStorage(null);
    const httpClient = makeHttpClient();
    const sut = new AuthorizeHttpClientDecorator(getStorage, httpClient);

    await sut.get(url, config);

    expect(httpClient.get).toHaveBeenCalledWith(url, config);
  });

  it('should merge Authorization header with existing headers', async () => {
    const tokens = { accessToken: 'token-merge' } as AuthTokens;
    const getStorage = makeGetStorage(tokens);
    const httpClient = makeHttpClient();
    const sut = new AuthorizeHttpClientDecorator(getStorage, httpClient);

    await sut.get(url, { headers: { 'X-Custom': 'value' } });

    expect(httpClient.get).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-merge',
          'X-Custom': 'value',
        }),
      })
    );
  });

  it('should delegate post/put/delete to httpClient with correct headers', async () => {
    const tokens = { accessToken: 'tok' } as AuthTokens;
    const getStorage = makeGetStorage(tokens);
    const httpClient = makeHttpClient();
    const sut = new AuthorizeHttpClientDecorator(getStorage, httpClient);

    await sut.post(url, data, config);
    await sut.put(url, data, config);
    await sut.delete(url, config);

    expect(httpClient.post).toHaveBeenCalledWith(
      url,
      data,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer tok' }),
      })
    );
    expect(httpClient.put).toHaveBeenCalledWith(
      url,
      data,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer tok' }),
      })
    );
    expect(httpClient.delete).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer tok' }),
      })
    );
  });
});
