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

const mockCookies = jest.mocked(jest.requireMock('next/headers').cookies);

const makeSut = (): CookieStorageAdapter => new CookieStorageAdapter();

describe('CookieStorageAdapter', () => {
  let mockCookieStore: {
    set: jest.Mock;
    get: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    };
    mockCookies.mockReturnValue(Promise.resolve(mockCookieStore));
  });

  test('Should call cookies.set with correct values', async () => {
    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    await sut.set(key, value);

    expect(mockCookieStore.set).toHaveBeenCalledWith(
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

    expect(mockCookieStore.delete).toHaveBeenCalledWith(key);
  });

  test('Should call cookies.delete if value is undefined', async () => {
    const sut = makeSut();
    const key = 'test-key';

    await sut.set(key, undefined);

    expect(mockCookieStore.delete).toHaveBeenCalledWith(key);
  });

  test('Should call cookies.get with correct value', async () => {
    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    mockCookieStore.get.mockReturnValueOnce({ value: JSON.stringify(value) });

    const obj = await sut.get(key);

    expect(obj).toEqual(value);
    expect(mockCookieStore.get).toHaveBeenCalledWith(key);
  });

  test('Should return null when cookies.get returns undefined', async () => {
    const sut = makeSut();
    const key = 'non-existent-key';

    mockCookieStore.get.mockReturnValueOnce(undefined);

    const result = await sut.get(key);

    expect(result).toBeNull();
    expect(mockCookieStore.get).toHaveBeenCalledWith(key);
  });

  test('Should return null when cookies.get returns null', async () => {
    const sut = makeSut();
    const key = 'non-existent-key';

    mockCookieStore.get.mockReturnValueOnce(null);

    const result = await sut.get(key);

    expect(result).toBeNull();
    expect(mockCookieStore.get).toHaveBeenCalledWith(key);
  });

  test('Should handle client-side environment', async () => {
    // Mock window object for client-side test
    const originalWindow = global.window;
    global.window = {
      document: {
        cookie:
          'test-key=%7B%22test%22%3A%22value%22%7D; path=/; max-age=31536000; SameSite=Lax',
      },
    } as typeof window;

    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    // Test set
    await sut.set(key, value);

    // Test get
    const result = await sut.get(key);
    expect(result).toEqual(value);

    // Cleanup
    global.window = originalWindow;
  });

  test('Should handle client-side environment with null value', async () => {
    // Mock window object for client-side test
    const originalWindow = global.window;
    global.window = {
      document: {
        cookie: 'test-key=value; path=/',
      },
    } as typeof window;

    const sut = makeSut();
    const key = 'test-key';

    // Test set with null
    await sut.set(key, null);

    // Test get should return null
    const result = await sut.get(key);
    expect(result).toBeNull();

    // Cleanup
    global.window = originalWindow;
  });

  test('Should handle client-side environment with undefined value', async () => {
    // Mock window object for client-side test
    const originalWindow = global.window;
    global.window = {
      document: {
        cookie: 'test-key=value; path=/',
      },
    } as typeof window;

    const sut = makeSut();
    const key = 'test-key';

    // Test set with undefined
    await sut.set(key, undefined);

    // Test get should return null
    const result = await sut.get(key);
    expect(result).toBeNull();

    // Cleanup
    global.window = originalWindow;
  });

  test('Should handle client-side environment with no cookies', async () => {
    // Mock window object for client-side test
    const originalWindow = global.window;
    global.window = {
      document: {
        cookie: '',
      },
    } as typeof window;

    const sut = makeSut();
    const key = 'test-key';

    // Test get should return null
    const result = await sut.get(key);
    expect(result).toBeNull();

    // Cleanup
    global.window = originalWindow;
  });

  test('Should handle client-side environment with invalid JSON', async () => {
    // Mock window object for client-side test
    const originalWindow = global.window;
    global.window = {
      document: {
        cookie: 'test-key=invalid-json; path=/',
      },
    } as typeof window;

    const sut = makeSut();
    const key = 'test-key';

    // Test get should return null for invalid JSON
    const result = await sut.get(key);
    expect(result).toBeNull();

    // Cleanup
    global.window = originalWindow;
  });

  test('Should handle client-side environment with cookie not found', async () => {
    // Mock window object for client-side test
    const originalWindow = global.window;
    global.window = {
      document: {
        cookie: 'other-key=value; path=/',
      },
    } as typeof window;

    const sut = makeSut();
    const key = 'test-key';

    // Test get should return null
    const result = await sut.get(key);
    expect(result).toBeNull();

    // Cleanup
    global.window = originalWindow;
  });

  test('Should handle server-side error gracefully', async () => {
    // Mock next/headers to throw error
    const mockCookiesWithError = {
      set: jest.fn(() => {
        throw new Error('Server error');
      }),
      get: jest.fn(() => {
        throw new Error('Server error');
      }),
      delete: jest.fn(() => {
        throw new Error('Server error');
      }),
    };

    mockCookies.mockImplementationOnce(() =>
      Promise.resolve(mockCookiesWithError)
    );

    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    // Should not throw error
    await expect(sut.set(key, value)).resolves.not.toThrow();
    await expect(sut.get(key)).resolves.toBeNull();
  });

  test('Should handle server-side JSON parse error', async () => {
    const sut = makeSut();
    const key = 'test-key';

    mockCookieStore.get.mockReturnValueOnce({ value: 'invalid-json' });

    const result = await sut.get(key);
    expect(result).toBeNull();
  });

  test('Should handle server-side with empty value', async () => {
    const sut = makeSut();
    const key = 'test-key';

    mockCookieStore.get.mockReturnValueOnce({ value: '' });

    const result = await sut.get(key);
    expect(result).toBeNull();
  });

  test('Should handle production environment secure flag', async () => {
    // Mock NODE_ENV to production
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const sut = makeSut();
    const key = 'test-key';
    const value = { test: 'value' };

    await sut.set(key, value);

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
      expect.objectContaining({
        httpOnly: true,
        secure: true, // em produção
        sameSite: 'lax',
        path: '/',
      })
    );

    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });
});
