'use server';

import { EntryFormData } from '@/infra/validation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeRemoteAddEntry } from '@/main/factories/usecases';
import { logoutAction } from '@/presentation/actions/auth/logout-action';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export type AddEntryActionResult =
  | { ok: true }
  | { ok: false; error: 'entry_create_failed' };

export async function addEntryAction(
  data: EntryFormData
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
      type: data.type,
      categoryId: data.categoryId || undefined,
      date: data.date,
      isFixed: data.isFixed,
      isPaid: data.isPaid ?? false,
    };

    const addEntry = makeRemoteAddEntry();
    await addEntry.add(params);

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
