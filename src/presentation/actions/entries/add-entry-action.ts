'use server';

import { EntryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeRemoteAddEntry } from '@/main/factories/usecases';
import { logoutAction } from '@/presentation/actions/auth/logout-action';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export async function addEntryAction(data: EntryFormData): Promise<void> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return;
    }

    const params = {
      description: data.description,
      amount: Math.round(data.amount * 100),
      type: data.type,
      categoryId: data.categoryId || undefined,
      date: data.date,
      isFixed: data.isFixed,
    };

    const addEntry = makeRemoteAddEntry();
    await addEntry.add(params);

    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);

    redirect('/entries?success=entry_created');
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Add entry error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
      return;
    }
    redirect('/entries?error=entry_create_failed');
  }
}
