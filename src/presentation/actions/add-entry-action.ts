'use server';

import { EntryFormData } from '@/infra/validation';
import { AddEntryParams } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '../helpers';
import { NextCookiesStorageAdapter } from '@/infra/storage/next-cookie-storage-adapter';
import { makeRemoteAddEntry } from '@/main/factories/usecases/add-entry-factory';

export async function addEntryAction(data: EntryFormData): Promise<void> {
  try {
    const getStorage = new NextCookiesStorageAdapter();
    const addEntry = makeRemoteAddEntry();
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
