'use server';

import {
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
} from '@/domain/usecases/load-entries-by-month';
import { getCurrentUser } from '../helpers';
import { NextCookiesStorageAdapter } from '@/infra/storage/next-cookie-storage-adapter';
import { makeRemoteLoadEntriesByMonthServer } from '@/main/factories/usecases/server';

export async function loadEntriesByMonthAction(
  searchParams: Record<string, string>
): Promise<LoadEntriesByMonthResult> {
  try {
    const getStorage = new NextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      throw new Error('User not found');
    }

    // Extrair parâmetros da query string
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

    const loadEntriesByMonth = makeRemoteLoadEntriesByMonthServer();
    const result = await loadEntriesByMonth.load(params);

    return result;
  } catch (error) {
    console.error('Load entries by month error:', error);
    throw error;
  }
}
