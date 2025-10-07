'use server';

import { LoadCashFlowForecastParams } from '@/domain/usecases/load-cash-flow-forecast';
import { CashFlowForecastModel } from '@/domain/models';
import { getCurrentUser } from '../helpers';
import { makeRemoteLoadCashFlowForecast } from '@/main/factories/usecases/load-cash-flow-forecast-factory';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export async function loadCashFlowForecastAction(
  months: number = 3,
  includeFixed: boolean = true,
  includeRecurring: boolean = false
): Promise<CashFlowForecastModel> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      throw new Error('User not found');
    }

    const params: LoadCashFlowForecastParams = {
      userId: user.id,
      months,
      includeFixed,
      includeRecurring,
    };

    const loadCashFlowForecast = makeRemoteLoadCashFlowForecast();
    const result = await loadCashFlowForecast.load(params);

    return result;
  } catch (error) {
    console.error('Load cash flow forecast error:', error);
    throw error;
  }
}
