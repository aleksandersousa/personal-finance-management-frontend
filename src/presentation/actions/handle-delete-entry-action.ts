'use server';

import { deleteEntryAction } from './delete-entry-action';

export async function handleDeleteEntryAction(
  id: string,
  deleteAllOccurrences: boolean
): Promise<void> {
  await deleteEntryAction(id, deleteAllOccurrences);
}
