'use server';

import {
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
} from '@/domain/usecases/load-entries-by-month';
import { getCurrentUser } from '../helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteLoadEntriesByMonth } from '@/main/factories/usecases/load-entries-by-month-factory';
import { logoutAction } from './logout-action';

export async function loadEntriesByMonthAction(
  searchParams: Record<string, string>
): Promise<LoadEntriesByMonthResult> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return {} as LoadEntriesByMonthResult;
    }

    const month = searchParams.month || new Date().toISOString().slice(0, 7); // YYYY-MM
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 20;
    const type = searchParams.type as 'INCOME' | 'EXPENSE' | undefined;
    const categoryId = searchParams.categoryId;

    const params: LoadEntriesByMonthParams = {
      month,
      userId: user.id,
      page,
      limit,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
    };

    const loadEntriesByMonth = makeRemoteLoadEntriesByMonth();
    const result = await loadEntriesByMonth.load(params);

    return result;
  } catch (error: any) {
    console.error('Load entries by month error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
