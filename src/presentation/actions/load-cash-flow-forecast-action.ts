'use server';

import { LoadCashFlowForecastParams } from '@/domain/usecases/load-cash-flow-forecast';
import { CashFlowForecastModel } from '@/domain/models';
import { getCurrentUser } from '../helpers';
import { NextCookiesStorageAdapter } from '@/infra/storage/next-cookie-storage-adapter';
import { makeRemoteLoadCashFlowForecast } from '@/main/factories/usecases/load-cash-flow-forecast-factory';
import { logoutAction } from './logout-action';

export async function loadCashFlowForecastAction(
  months: number = 3,
  includeFixed: boolean = true,
  includeRecurring: boolean = false
): Promise<CashFlowForecastModel> {
  try {
    const getStorage = new NextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return {} as CashFlowForecastModel;
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
  } catch (error: any) {
    console.error('Load cash flow forecast error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
