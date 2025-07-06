import { SetStorage, GetStorage } from '@/data/protocols/storage';

export class LocalStorageAdapter implements SetStorage, GetStorage {
  set(key: string, value: object | null | undefined): void {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }

  get(key: string): unknown {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
