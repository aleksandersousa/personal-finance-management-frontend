'use server';

import { revalidatePath } from 'next/cache';
import { EntryModel } from '@/domain/models';
import { makeRemoteToggleMonthlyPaymentStatus } from '@/main/factories/usecases';

export async function toggleEntryPaidStatusAction(
  entry: EntryModel,
  isPaid: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const toggleMonthlyPaymentStatus = makeRemoteToggleMonthlyPaymentStatus();
    await toggleMonthlyPaymentStatus.toggle({
      entryId: entry.id,
      isPaid,
    });

    revalidatePath('/entries');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: unknown) {
    console.error('Toggle entry paid status error:', error);
    return { success: false, error: 'Failed to update paid status' };
  }
}
