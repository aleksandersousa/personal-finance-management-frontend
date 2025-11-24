'use server';

import { LoadEntriesMonthsYearsResult } from '@/domain/usecases/load-entries-months-years';
import { getCurrentUser, isRedirectError } from '../helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteLoadEntriesMonthsYears } from '@/main/factories/usecases';
import { logoutAction } from './logout-action';

export async function loadEntriesMonthsYearsAction(): Promise<LoadEntriesMonthsYearsResult> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return { monthsYears: [] };
    }

    const loadEntriesMonthsYears = makeRemoteLoadEntriesMonthsYears();
    const result = await loadEntriesMonthsYears.load();

    return result;
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Load entries months years error:', error);
    if (error.message?.includes('401')) {
      await logoutAction();
      return { monthsYears: [] };
    }
    throw error;
  }
}
