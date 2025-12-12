'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteUpdateEntry } from '@/main/factories/usecases/entries/update-entry-factory';
import { logoutAction } from '@/presentation/actions/auth/logout-action';
import { EntryModel } from '@/domain/models';

export async function toggleEntryPaidStatusAction(
  entry: EntryModel,
  isPaid: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return { success: false, error: 'User not authenticated' };
    }

    // Only allow toggling for expenses
    if (entry.type !== 'EXPENSE') {
      return { success: false, error: 'Only expenses can have paid status' };
    }

    const date = entry.date instanceof Date ? entry.date : new Date(entry.date);

    // Update the entry with the new paid status
    const updateEntry = makeRemoteUpdateEntry();
    await updateEntry.update({
      id: entry.id,
      description: entry.description,
      amount: entry.amount,
      type: entry.type,
      categoryId: entry.categoryId,
      date: date,
      isFixed: entry.isFixed,
      isPaid: isPaid,
    });

    // Revalidate the entries list and summary
    revalidatePath('/entries');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Toggle entry paid status error:', error);
    if (error.message?.includes('401')) {
      await logoutAction();
      return { success: false, error: 'Authentication failed' };
    }
    return {
      success: false,
      error: error.message || 'Failed to update paid status',
    };
  }
}
