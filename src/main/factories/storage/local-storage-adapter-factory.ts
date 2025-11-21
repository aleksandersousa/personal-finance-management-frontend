import { LocalStorageAdapter } from '@/infra/storage';

export const makeLocalStorageAdapter = (): LocalStorageAdapter =>
  new LocalStorageAdapter();
