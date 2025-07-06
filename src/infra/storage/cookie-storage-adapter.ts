import { SetStorage, GetStorage } from '@/data/protocols/storage';

export class CookieStorageAdapter implements SetStorage, GetStorage {
  async set(key: string, value: object | null | undefined): Promise<void> {
    if (typeof window !== 'undefined') {
      // Client-side implementation
      if (value !== null && value !== undefined) {
        const serializedValue = JSON.stringify(value);
        document.cookie = `${key}=${encodeURIComponent(serializedValue)}; path=/; max-age=31536000; SameSite=Lax`;
      } else {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    } else {
      // Server-side implementation
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();

        if (value !== null && value !== undefined) {
          cookieStore.set(key, JSON.stringify(value), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        } else {
          cookieStore.delete(key);
        }
      } catch (error) {
        console.warn('Server-side cookie storage not available:', error);
      }
    }
  }

  async get(key: string): Promise<unknown> {
    if (typeof window !== 'undefined') {
      // Client-side implementation
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(c => c.trim().startsWith(`${key}=`));
      if (cookie) {
        const value = cookie.split('=')[1];
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch {
          return null;
        }
      }
      return null;
    } else {
      // Server-side implementation
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const item = cookieStore.get(key)?.value;
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.warn('Server-side cookie storage not available:', error);
        return null;
      }
    }
  }
}
