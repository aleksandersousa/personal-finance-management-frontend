import { cookies } from 'next/headers';
import { GetStorage, SetStorage } from '@/data/protocols/storage';

export class NextCookiesStorageAdapter implements GetStorage, SetStorage {
  async get(key: string): Promise<unknown> {
    const cookie = (await cookies()).get(key);
    if (!cookie) return null;

    try {
      return JSON.parse(cookie.value);
    } catch {
      return cookie.value;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    (await cookies()).set(key, stringValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });
  }
}
