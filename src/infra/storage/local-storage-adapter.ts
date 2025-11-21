import { SetStorage, GetStorage } from '@/data/protocols/storage';

export class LocalStorageAdapter implements SetStorage, GetStorage {
  async set(key: string, value: object | null | undefined): Promise<void> {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }

  async get(key: string): Promise<unknown> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
