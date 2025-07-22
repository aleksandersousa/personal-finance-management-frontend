'use server';

import {
  LoadEntriesByMonthParams,
  LoadEntriesByMonthResult,
  type LoadEntriesByMonth,
} from '@/domain/usecases/load-entries-by-month';
import { GetStorage } from '@/data/protocols/storage';
import { getCurrentUser } from '../helpers';

export async function loadEntriesByMonthAction(
  searchParams: Record<string, string>,
  loadEntriesByMonth: LoadEntriesByMonth,
  getStorage: GetStorage
): Promise<LoadEntriesByMonthResult> {
  try {
    const user = await getCurrentUser(getStorage);

    if (!user) {
      return {
        data: [
          {
            id: 'any_id',
            amount: 10000, // R$ 100,00 em centavos
            description: 'any_description',
            type: 'INCOME',
            isFixed: false,
            categoryId: 'any_category_id',
            categoryName: 'any_category_name',
            userId: 'any_user_id',
            date: new Date('2024-01-01'),
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };
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

    const result = await loadEntriesByMonth.load(params);

    return result;
  } catch (error) {
    console.error('Load entries by month error:', error);
    throw error;
  }
}
