'use server';

import { EntryFormData } from '@/infra/validation';
import { AddEntryParams, type AddEntry } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { GetStorage } from '@/data/protocols/storage';
import { getCurrentUser } from '../helpers';

export async function addEntryAction(
  data: EntryFormData,
  addEntry: AddEntry,
  getStorage: GetStorage
): Promise<void> {
  try {
    const user = await getCurrentUser(getStorage);

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const params: AddEntryParams = {
      description: data.description,
      amount: Math.round(data.amount * 100),
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      isFixed: data.isFixed,
      userId: user.id,
    };

    await addEntry.add(params);

    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);

    redirect('/entries');
  } catch (error) {
    console.error('Add entry error:', error);
    throw error;
  }
}
