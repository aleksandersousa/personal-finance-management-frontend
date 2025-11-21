import { NextCookiesStorageAdapter } from '@/infra/storage/next-cookie-storage-adapter';

export const makeNextCookiesStorageAdapter = (): NextCookiesStorageAdapter =>
  new NextCookiesStorageAdapter();
