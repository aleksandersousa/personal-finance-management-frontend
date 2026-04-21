'use server';

import {
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
} from '@/domain/usecases';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteLoadEntriesByMonth } from '@/main/factories/usecases/entries/load-entries-by-month-factory';
import { logoutAction } from '@/presentation/actions/auth/logout-action';

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
    const limit = Number(searchParams.limit) || 5;
    const category = searchParams.category;
    const entryType = searchParams.entryType as
      | 'INCOME'
      | 'EXPENSE'
      | undefined;
    const search = searchParams.search;
    const sort = searchParams.sort as
      | 'dueDate'
      | 'amount'
      | 'description'
      | undefined;
    const order = searchParams.order as 'asc' | 'desc' | undefined;

    const params: LoadEntriesByMonthParams = {
      month,
      userId: user.id,
      page,
      limit,
      ...(category && { category }),
      ...(entryType && { entryType }),
      ...(search && search.trim() && { search: search.trim() }),
      ...(sort && { sort }),
      ...(order && { order }),
    };

    const loadEntriesByMonth = makeRemoteLoadEntriesByMonth();
    const result = await loadEntriesByMonth.load(params);

    return result;
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Load entries by month error:', error);
    if (error.message?.includes('401')) {
      await logoutAction();
      return {} as LoadEntriesByMonthResult;
    }
    throw error;
  }
}
