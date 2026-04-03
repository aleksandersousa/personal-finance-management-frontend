'use server';

import { EntryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteUpdateEntry } from '@/main/factories/usecases/entries/update-entry-factory';
import { logoutAction } from '@/presentation/actions/auth/logout-action';
import { toggleMonthlyPaymentStatusAction } from './toggle-monthly-payment-status-action';

export async function updateEntryAction(
  id: string,
  data: EntryFormData,
  listMonthFilter?: string
): Promise<void> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return;
    }

    const params = {
      id,
      description: data.description,
      amount: Math.round(data.amount * 100),
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      isFixed: data.isFixed,
      isPaid: data.isPaid,
    };

    const updateEntry = makeRemoteUpdateEntry();
    await updateEntry.update(params);

    if (
      data.isFixed &&
      data.type === 'EXPENSE' &&
      listMonthFilter &&
      /^\d{4}-\d{2}$/.test(listMonthFilter)
    ) {
      const [yStr, mStr] = listMonthFilter.split('-');
      const year = Number(yStr);
      const month = Number(mStr);
      if (month >= 1 && month <= 12 && year >= 2000) {
        const monthlyResult = await toggleMonthlyPaymentStatusAction({
          entryId: id,
          year,
          month,
          isPaid: data.isPaid ?? false,
        });
        if (!monthlyResult.success) {
          throw new Error(
            monthlyResult.error || 'Falha ao sincronizar status do mês'
          );
        }
      }
    }

    revalidateTag('entries', 'max');
    revalidateTag(`entries-${user.id}`, 'max');
    revalidateTag(`entry-${id}`, 'max');

    const successPath =
      listMonthFilter && /^\d{4}-\d{2}$/.test(listMonthFilter)
        ? `/entries?month=${encodeURIComponent(listMonthFilter)}&success=entry_updated`
        : '/entries?success=entry_updated';
    redirect(successPath);
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Update entry error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
      return;
    }
    const failPath =
      listMonthFilter && /^\d{4}-\d{2}$/.test(listMonthFilter)
        ? `/entries?month=${encodeURIComponent(listMonthFilter)}&error=entry_update_failed`
        : '/entries?error=entry_update_failed';
    redirect(failPath);
  }
}
