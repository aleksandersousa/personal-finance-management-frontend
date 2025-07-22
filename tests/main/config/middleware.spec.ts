import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/main/config';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(),
  },
}));

const mockNextResponse = jest.mocked(NextResponse);

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNextResponse.redirect.mockReturnValue({} as NextResponse);
    mockNextResponse.next.mockReturnValue({} as NextResponse);
  });

  const createMockRequest = (
    pathname: string,
    cookies?: Record<string, string>
  ) => {
    const url = new URL(`http://localhost:3000${pathname}`);
    const request = {
      nextUrl: url,
      cookies: {
        get: jest.fn((name: string) => {
          if (cookies && cookies[name]) {
            return { value: cookies[name] };
          }
          return undefined;
        }),
      },
    } as unknown as NextRequest;

    return request;
  };

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without tokens', async () => {
      const request = createMockRequest('/dashboard');

      await middleware(request);

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/dashboard')
      );
    });

    it('should redirect to login when tokens cookie is empty', async () => {
      const request = createMockRequest('/entries', { tokens: '' });

      await middleware(request);

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/entries')
      );
    });

    it('should redirect to login when tokens cookie is invalid JSON', async () => {
      const request = createMockRequest('/summary', { tokens: 'invalid-json' });

      await middleware(request);

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/summary')
      );
    });

    it('should redirect to login when tokens cookie has no accessToken', async () => {
      const request = createMockRequest('/forecast', {
        tokens: JSON.stringify({ refreshToken: 'token' }),
      });

      await middleware(request);

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/forecast')
      );
    });

    it('should allow access when tokens cookie is valid', async () => {
      const request = createMockRequest('/dashboard', {
        tokens: JSON.stringify({
          accessToken: 'valid-token',
          refreshToken: 'refresh-token',
          expiresIn: 3600,
        }),
      });

      await middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
      expect(mockNextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe('Public Routes', () => {
    it('should allow access to login page', async () => {
      const request = createMockRequest('/login');

      await middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
      expect(mockNextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should allow access to register page', async () => {
      const request = createMockRequest('/register');

      await middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
      expect(mockNextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should allow access to home page', async () => {
      const request = createMockRequest('/');

      await middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
      expect(mockNextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should allow access to API routes', async () => {
      const request = createMockRequest('/api/auth/login');

      await middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
      expect(mockNextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should allow access to static files', async () => {
      const request = createMockRequest('/_next/static/chunks/main.js');

      await middleware(request);

      expect(mockNextResponse.next).toHaveBeenCalled();
      expect(mockNextResponse.redirect).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle nested protected routes', async () => {
      const request = createMockRequest('/dashboard/settings');

      await middleware(request);

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/dashboard/settings')
      );
    });

    it('should handle routes with query parameters', async () => {
      const request = createMockRequest('/entries?month=2024-01');

      await middleware(request);

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/entries?month=2024-01')
      );
    });

    it('should handle malformed tokens object', async () => {
      const request = createMockRequest('/summary', {
        tokens: JSON.stringify({ accessToken: null }),
      });

      await middleware(request);

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/login', 'http://localhost:3000/summary')
      );
    });
  });
});
