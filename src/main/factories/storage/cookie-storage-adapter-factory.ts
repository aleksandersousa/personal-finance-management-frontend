import { CookieStorageAdapter } from '@/infra/storage/cookie-storage-adapter';

export const makeCookieStorageAdapter = (): CookieStorageAdapter =>
  new CookieStorageAdapter();
