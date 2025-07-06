'use server';

import { EntryFormData } from '@/infra/validation';
import { AddEntryParams, type AddEntry } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import type { TokenStorage } from '@/data/protocols/storage/token-storage';

// Função para obter accessToken usando TokenStorage
async function getCurrentUser(
  tokenStorage: TokenStorage
): Promise<{ id: string; accessToken: string }> {
  const accessToken = tokenStorage.getAccessToken();
  if (!accessToken) {
    throw new Error('Usuário não autenticado');
  }
  // TODO: Decodificar userId do JWT se necessário
  return { id: 'mock-user-id', accessToken };
}

export async function addEntryAction(
  data: EntryFormData,
  addEntry: AddEntry,
  tokenStorage: TokenStorage
): Promise<void> {
  try {
    // Get current user and accessToken
    const user = await getCurrentUser(tokenStorage);

    // Convert EntryFormData to AddEntryParams
    const params: AddEntryParams = {
      description: data.description,
      amount: Math.round(data.amount * 100), // Convert to cents
      type: data.type,
      categoryId: data.categoryId,
      date: data.date,
      isFixed: data.isFixed,
      userId: user.id, // Em produção, decodificar do JWT
    };

    // Call the use case (pode ser necessário passar accessToken para o use case ou httpClient)
    await addEntry.add(params);

    // Revalidate cache to show updated data
    revalidateTag('entries');
    revalidateTag(`entries-${user.id}`);

    // Redirect to entries list
    redirect('/entries');
  } catch (error) {
    console.error('Add entry error:', error);
    throw error; // Re-throw so component can handle the error
  }
}
