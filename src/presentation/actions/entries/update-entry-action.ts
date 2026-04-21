'use server';

import { EntryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteUpdateEntry } from '@/main/factories/usecases/entries/update-entry-factory';
import { makeRemoteToggleMonthlyPaymentStatus } from '@/main/factories/usecases';
import { logoutAction } from '@/presentation/actions/auth/logout-action';

export async function updateEntryAction(
  id: string,
  data: EntryFormData,
  listMonthFilter?: string,
  isPaid?: boolean,
  isRecurring?: boolean,
  existingRecurrenceId?: string | null
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
      categoryId: data.categoryId,
      issueDate: data.date,
      dueDate: data.date,
      recurrenceId: isRecurring ? (existingRecurrenceId ?? undefined) : null,
      recurrenceType:
        isRecurring && !existingRecurrenceId ? ('MONTHLY' as const) : undefined,
    };

    const updateEntry = makeRemoteUpdateEntry();
    const updatedEntry = await updateEntry.update(params);

    if (updatedEntry.entryType === 'EXPENSE' && isPaid !== undefined) {
      const togglePaymentStatus = makeRemoteToggleMonthlyPaymentStatus();
      await togglePaymentStatus.toggle({
        entryId: id,
        isPaid,
      });
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
