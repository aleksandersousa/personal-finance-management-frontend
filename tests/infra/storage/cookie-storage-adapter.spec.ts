import { CookieStorageAdapter } from '@/infra/storage';

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() =>
    Promise.resolve({
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    })
  ),
}));

const makeSut = (): CookieStorageAdapter => new CookieStorageAdapter();

describe('CookieStorageAdapter', () => {
  let mockCookies: {
    set: jest.Mock;
    get: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    mockCookies = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    };
    const nextHeaders = jest.requireMock('next/headers');
    (nextHeaders.cookies as jest.Mock).mockReturnValue(
      Promise.resolve(mockCookies)
    );
  });

  test('Should call cookies.set with correct values', async () => {
    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    await sut.set(key, value);

    expect(mockCookies.set).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
      expect.objectContaining({
        httpOnly: true,
        secure: false, // em desenvolvimento
        sameSite: 'lax',
        path: '/',
      })
    );
  });

  test('Should call cookies.delete if value is null', async () => {
    const sut = makeSut();
    const key = 'test-key';

    await sut.set(key, null);

    expect(mockCookies.delete).toHaveBeenCalledWith(key);
  });

  test('Should call cookies.get with correct value', async () => {
    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    mockCookies.get.mockReturnValueOnce({ value: JSON.stringify(value) });

    const obj = await sut.get(key);

    expect(obj).toEqual(value);
    expect(mockCookies.get).toHaveBeenCalledWith(key);
  });

  test('Should return null when cookies.get returns undefined', async () => {
    const sut = makeSut();
    const key = 'non-existent-key';

    mockCookies.get.mockReturnValueOnce(undefined);

    const result = await sut.get(key);

    expect(result).toBeNull();
    expect(mockCookies.get).toHaveBeenCalledWith(key);
  });
});
