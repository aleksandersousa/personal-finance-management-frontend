import { GetStorage, SetStorage } from '@/data/protocols/storage';

export class CookieStorageAdapter implements GetStorage, SetStorage {
  async get(key: string): Promise<unknown> {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie.split(';');
    const cookie = cookies.find(c => c.trim().startsWith(`${key}=`));

    if (!cookie) return null;

    const value = cookie.split('=')[1];
    if (!value) return null;

    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return decodeURIComponent(value);
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }

    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    const encodedValue = encodeURIComponent(stringValue);
    const maxAge = 60 * 60 * 24 * 30; // 30 dias
    const isProduction = process.env.NODE_ENV === 'production';

    document.cookie = `${key}=${encodedValue}; max-age=${maxAge}; path=/; ${isProduction ? 'secure; ' : ''}samesite=strict`;
  }
}
