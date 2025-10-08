'use server';

import { EntryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '../helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteUpdateEntry } from '@/main/factories/usecases/update-entry-factory';
import { logoutAction } from './logout-action';

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

    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);
    revalidateTag(`entry-${id}`);

    redirect('/entries');
  } catch (error: any) {
    console.error('Update entry error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
