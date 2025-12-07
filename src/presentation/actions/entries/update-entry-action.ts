'use server';

import { EntryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteUpdateEntry } from '@/main/factories/usecases/entries/update-entry-factory';
import { logoutAction } from '@/presentation/actions/auth/logout-action';

export async function updateEntryAction(
  id: string,
  data: EntryFormData
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
    };

    const updateEntry = makeRemoteUpdateEntry();
    await updateEntry.update(params);

    revalidateTag('entries', 'max');
    revalidateTag(`entries-${user.id}`, 'max');
    revalidateTag(`entry-${id}`, 'max');

    redirect('/entries?success=entry_updated');
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Update entry error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
      return;
    }
    redirect('/entries?error=entry_update_failed');
  }
}
