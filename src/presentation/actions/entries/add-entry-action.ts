'use server';

import { EntryFormData } from '@/infra/validation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeRemoteAddEntry } from '@/main/factories/usecases';
import { makeRemoteToggleMonthlyPaymentStatus } from '@/main/factories/usecases';
import { logoutAction } from '@/presentation/actions/auth/logout-action';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export type AddEntryActionResult =
  | { ok: true }
  | { ok: false; error: 'entry_create_failed' };

type AddEntryActionInput = EntryFormData & {
  isPaid?: boolean;
  isRecurring?: boolean;
};

export async function addEntryAction(
  data: AddEntryActionInput
): Promise<AddEntryActionResult> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return { ok: false, error: 'entry_create_failed' };
    }

    const params = {
      description: data.description,
      amount: Math.round(data.amount * 100),
      categoryId: data.categoryId,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      recurrenceType: data.isRecurring ? ('MONTHLY' as const) : undefined,
    };

    const addEntry = makeRemoteAddEntry();
    const createdEntry = await addEntry.add(params);

    if (createdEntry.entryType === 'EXPENSE' && data.isPaid) {
      const togglePaymentStatus = makeRemoteToggleMonthlyPaymentStatus();
      await togglePaymentStatus.toggle({
        entryId: createdEntry.id,
        isPaid: true,
      });
    }

    revalidateTag('entries', 'max');
    revalidateTag(`entries-${user.id}`, 'max');

    return { ok: true };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Add entry error:', error);
    if (String(error?.message ?? '').includes('401')) {
      await logoutAction();
    }
    return { ok: false, error: 'entry_create_failed' };
  }
}
