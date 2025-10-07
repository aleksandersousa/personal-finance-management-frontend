'use server';

import { LoadMonthlySummaryParams } from '@/domain/usecases/load-monthly-summary';
import { MonthlySummaryModel } from '@/domain/models';
import { getCurrentUser } from '../helpers';
import { makeRemoteLoadMonthlySummary } from '@/main/factories/usecases/load-monthly-summary-factory';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export async function loadMonthlySummaryAction(
  month: string,
  includeCategories: boolean = true
): Promise<MonthlySummaryModel> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      throw new Error('User not found');
    }

    const params: LoadMonthlySummaryParams = {
      month,
      includeCategories,
      userId: user.id,
    };

    const loadMonthlySummary = makeRemoteLoadMonthlySummary();
    const result = await loadMonthlySummary.load(params);

    return result;
  } catch (error) {
    console.error('Load monthly summary error:', error);
    throw error;
  }
}
