import { loginAction } from '@/presentation/actions';
import { LoginFormData } from '@/infra/validation';
import { Authentication, AuthenticationParams } from '@/domain/usecases';
import { TokenStorage } from '@/data/protocols';
import { AuthTokens } from '@/domain/models';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

const mockRedirect = jest.mocked(jest.requireMock('next/navigation').redirect);

const mockAuthentication: jest.Mocked<Authentication> = {
  auth: jest.fn(),
};

const mockTokenStorage: jest.Mocked<TokenStorage> = {
  setAccessToken: jest.fn(),
  getAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
  getRefreshToken: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
};

describe('loginAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call authentication.auth with correct params', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
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
      rememberMe: true,
    };

    await loginAction(loginData, mockAuthentication, mockTokenStorage);

    expect(mockAuthentication.auth).toHaveBeenCalledWith(expectedParams);
  });

  it('should set rememberMe to false when not provided', async () => {
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
      rememberMe: false,
    };

    await loginAction(loginData, mockAuthentication, mockTokenStorage);

    expect(mockAuthentication.auth).toHaveBeenCalledWith(expectedParams);
  });

  it('should call tokenStorage.setTokens with correct tokens', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
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

    await loginAction(loginData, mockAuthentication, mockTokenStorage);

    expect(mockTokenStorage.setTokens).toHaveBeenCalledWith(authResult.tokens);
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

    await loginAction(loginData, mockAuthentication, mockTokenStorage);

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

    const promise = loginAction(
      loginData,
      mockAuthentication,
      mockTokenStorage
    );

    await expect(promise).rejects.toThrow('Invalid credentials');
    expect(consoleSpy).toHaveBeenCalledWith('Login error:', authError);
    expect(mockTokenStorage.setTokens).not.toHaveBeenCalled();
  });

  it('should handle authentication error without calling setTokens', async () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    mockAuthentication.auth.mockRejectedValueOnce(new Error('Network error'));

    try {
      await loginAction(loginData, mockAuthentication, mockTokenStorage);
    } catch {
      // Expected to throw
    }

    expect(mockTokenStorage.setTokens).not.toHaveBeenCalled();
  });
});
