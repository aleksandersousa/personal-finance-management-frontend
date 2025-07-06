import { CookieStorageAdapter } from '@/infra/storage';

export const makeCookieStorageAdapter = (): CookieStorageAdapter =>
  new CookieStorageAdapter();
