'use server';

import { LoadMonthlySummaryParams } from '@/domain/usecases';
import { MonthlySummaryModel } from '@/domain/models';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteLoadMonthlySummary } from '@/main/factories/usecases/dashboard/load-monthly-summary-factory';
import { logoutAction } from '@/presentation/actions/auth/logout-action';

export async function loadMonthlySummaryAction(
  month: string,
  includeCategories: boolean = true
): Promise<MonthlySummaryModel> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return {} as MonthlySummaryModel;
    }

    const params: LoadMonthlySummaryParams = {
      month,
      includeCategories,
      userId: user.id,
    };

    const loadMonthlySummary = makeRemoteLoadMonthlySummary();
    const result = await loadMonthlySummary.load(params);

    return result;
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Load monthly summary error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
