'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser, isRedirectError } from '../helpers';
import { makeRemoteDeleteEntry } from '@/main/factories/usecases/delete-entry-factory';
import { logoutAction } from './logout-action';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export async function deleteEntryAction(
  id: string,
  deleteAllOccurrences: boolean
): Promise<void> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return;
    }

    const deleteEntry = makeRemoteDeleteEntry();
    await deleteEntry.delete({ id, deleteAllOccurrences });

    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);
    revalidateTag(`entry-${id}`);
    revalidateTag('summary');

    redirect('/entries');
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Delete entry error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
