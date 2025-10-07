import { loginAction } from '@/presentation/actions/login-action';
import { LoginFormData } from '@/infra/validation';
import { Authentication, AuthenticationParams } from '@/domain/usecases';
import type { SetStorage } from '@/data/protocols';
import { AuthTokens } from '@/domain/models';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() =>
    Promise.resolve({
      set: jest.fn(),
    })
  ),
}));

const mockRedirect = jest.mocked(jest.requireMock('next/navigation').redirect);
const mockCookies = jest.mocked(jest.requireMock('next/headers').cookies);

const mockAuthentication: jest.Mocked<Authentication> = {
  auth: jest.fn(),
};

const mockSetStorage: jest.Mocked<SetStorage> = {
  set: jest.fn(),
};

describe('loginAction', () => {
  let mockCookieStore: {
    set: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();

    mockCookieStore = {
      set: jest.fn(),
    };
    mockCookies.mockReturnValue(Promise.resolve(mockCookieStore));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call authentication.auth with correct params', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const authResult = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'test@example.com',
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      } as AuthTokens,
    };

    mockAuthentication.auth.mockResolvedValueOnce(authResult);

    const expectedParams: AuthenticationParams = {
      email: 'test@example.com',
      password: 'password123',
    };

    await loginAction(loginData, mockAuthentication, mockSetStorage);

    expect(mockAuthentication.auth).toHaveBeenCalledWith(expectedParams);
  });

  it('should set cookies with correct values', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const authResult = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'test@example.com',
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      } as AuthTokens,
    };

    mockAuthentication.auth.mockResolvedValueOnce(authResult);

    await loginAction(loginData, mockAuthentication, mockSetStorage);

    expect(mockSetStorage.set).toHaveBeenCalledWith('user', authResult.user);
    expect(mockSetStorage.set).toHaveBeenCalledWith(
      'tokens',
      authResult.tokens
    );
  });

  it('should redirect to dashboard on success', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const authResult = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'test@example.com',
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      } as AuthTokens,
    };

    mockAuthentication.auth.mockResolvedValueOnce(authResult);

    await loginAction(loginData, mockAuthentication, mockSetStorage);

    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });

  it('should log error and re-throw when authentication fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const authError = new Error('Invalid credentials');
    mockAuthentication.auth.mockRejectedValueOnce(authError);

    const promise = loginAction(loginData, mockAuthentication, mockSetStorage);

    await expect(promise).rejects.toThrow('Invalid credentials');
    expect(consoleSpy).toHaveBeenCalledWith('Login error:', authError);
    expect(mockCookieStore.set).not.toHaveBeenCalled();
  });

  it('should handle authentication error without calling cookies', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    mockAuthentication.auth.mockRejectedValueOnce(new Error('Network error'));

    try {
      await loginAction(loginData, mockAuthentication, mockSetStorage);
    } catch {
      // Expected to throw
    }

    expect(mockCookieStore.set).not.toHaveBeenCalled();
  });
});
