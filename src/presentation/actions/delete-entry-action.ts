'use server';

import { DeleteEntryParams, type DeleteEntry } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export async function deleteEntryAction(
  id: string,
  deleteAllOccurrences: boolean,
  deleteEntry: DeleteEntry
): Promise<void> {
  try {
    // Para o MVP, vamos usar um usuário mock
    const mockUserId = 'mock-user-id';

    const params: DeleteEntryParams = {
      id,
      deleteAllOccurrences,
    };

    await deleteEntry.delete(params);

    revalidateTag('entries');
    revalidateTag(`entries-${mockUserId}`);
    revalidateTag(`entry-${id}`);
    revalidateTag('summary');

    redirect('/entries');
  } catch (error) {
    console.error('Delete entry error:', error);
    throw error;
  }
}
