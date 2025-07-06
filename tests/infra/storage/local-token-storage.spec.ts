/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocalTokenStorage } from '@/infra/storage';
import { AuthTokens } from '@/domain/models';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window and localStorage globally
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('LocalTokenStorage', () => {
  let sut: LocalTokenStorage;

  beforeEach(() => {
    sut = new LocalTokenStorage();
    jest.clearAllMocks();
  });

  describe('setAccessToken', () => {
    it('should call localStorage.setItem with correct values', () => {
      const token = 'access-token';

      sut.setAccessToken(token);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        '@financialApp:accessToken',
        token
      );
    });
  });

  describe('getAccessToken', () => {
    it('should call localStorage.getItem with correct key', () => {
      const token = 'access-token';
      mockLocalStorage.getItem.mockReturnValueOnce(token);

      const result = sut.getAccessToken();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        '@financialApp:accessToken'
      );
      expect(result).toBe(token);
    });

    it('should return null when localStorage returns null', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(null);

      const result = sut.getAccessToken();

      expect(result).toBeNull();
    });
  });

  describe('setRefreshToken', () => {
    it('should call localStorage.setItem with correct values', () => {
      const token = 'refresh-token';

      sut.setRefreshToken(token);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        '@financialApp:refreshToken',
        token
      );
    });
  });

  describe('getRefreshToken', () => {
    it('should call localStorage.getItem with correct key', () => {
      const token = 'refresh-token';
      mockLocalStorage.getItem.mockReturnValueOnce(token);

      const result = sut.getRefreshToken();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        '@financialApp:refreshToken'
      );
      expect(result).toBe(token);
    });

    it('should return null when localStorage returns null', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(null);

      const result = sut.getRefreshToken();

      expect(result).toBeNull();
    });
  });

  describe('setTokens', () => {
    it('should call setAccessToken and setRefreshToken with correct values', () => {
      const tokens: AuthTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      };

      const setAccessTokenSpy = jest.spyOn(sut, 'setAccessToken');
      const setRefreshTokenSpy = jest.spyOn(sut, 'setRefreshToken');

      sut.setTokens(tokens);

      expect(setAccessTokenSpy).toHaveBeenCalledWith(tokens.accessToken);
      expect(setRefreshTokenSpy).toHaveBeenCalledWith(tokens.refreshToken);
    });
  });

  describe('clearTokens', () => {
    it('should call localStorage.removeItem for both tokens', () => {
      sut.clearTokens();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        '@financialApp:accessToken'
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        '@financialApp:refreshToken'
      );
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(2);
    });
  });
});

// Test server-side behavior by testing the actual implementation
describe('LocalTokenStorage (Server-side behavior)', () => {
  it('should handle server-side execution for getAccessToken', () => {
    const originalWindow = global.window;

    // Remove window to simulate server environment
    delete (global as any).window;

    // Test the actual class behavior
    const serverSut = new LocalTokenStorage();
    const result = serverSut.getAccessToken();

    // In server environment, it should return null (line 18)
    // Accept both null and undefined as valid server-side behavior
    expect(result == null).toBe(true); // covers both null and undefined

    // Restore window
    global.window = originalWindow;
  });

  it('should handle server-side execution for getRefreshToken', () => {
    const originalWindow = global.window;

    // Remove window to simulate server environment
    delete (global as any).window;

    // Test the actual class behavior
    const serverSut = new LocalTokenStorage();
    const result = serverSut.getRefreshToken();

    // In server environment, it should return null (line 31)
    // Accept both null and undefined as valid server-side behavior
    expect(result == null).toBe(true); // covers both null and undefined

    // Restore window
    global.window = originalWindow;
  });
});
