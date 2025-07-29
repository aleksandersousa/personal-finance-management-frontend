'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteEntryAction(
  id: string,
  deleteAllOccurrences: boolean
): Promise<void> {
  try {
    // Para o MVP, vamos simular a exclusão
    // Em produção, isso seria substituído pela implementação real
    console.log(`Deleting entry ${id}, deleteAll: ${deleteAllOccurrences}`);

    // Para o MVP, vamos usar um usuário mock
    const mockUserId = 'mock-user-id';

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
