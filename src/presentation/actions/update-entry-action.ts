'use server';

import { EntryFormData } from '@/infra/validation';
import { UpdateEntryParams, type UpdateEntry } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export async function updateEntryAction(
  id: string,
  data: EntryFormData,
  updateEntry: UpdateEntry
): Promise<void> {
  try {
    // Para o MVP, vamos usar um usuário mock
    const mockUserId = 'mock-user-id';

    const params: UpdateEntryParams = {
      id,
      description: data.description,
      amount: Math.round(data.amount * 100),
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      isFixed: data.isFixed,
    };

    await updateEntry.update(params);

    revalidateTag('entries');
    revalidateTag(`entries-${mockUserId}`);
    revalidateTag(`entry-${id}`);

    redirect('/entries');
  } catch (error) {
    console.error('Update entry error:', error);
    throw error;
  }
}
