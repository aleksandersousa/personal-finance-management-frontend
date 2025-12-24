'use server';

import { revalidatePath } from 'next/cache';
import { makeRemoteToggleMonthlyPaymentStatus } from '@/main/factories/usecases';

interface ToggleMonthlyPaymentStatusParams {
  entryId: string;
  year: number;
  month: number;
  isPaid: boolean;
}

interface ToggleMonthlyPaymentStatusResult {
  success: boolean;
  error?: string;
}

export async function toggleMonthlyPaymentStatusAction(
  params: ToggleMonthlyPaymentStatusParams
): Promise<ToggleMonthlyPaymentStatusResult> {
  try {
    const toggleMonthlyPaymentStatus = makeRemoteToggleMonthlyPaymentStatus();

    await toggleMonthlyPaymentStatus.toggle({
      entryId: params.entryId,
      year: params.year,
      month: params.month,
      isPaid: params.isPaid,
    });

    // Revalidate the entries list and dashboard pages
    revalidatePath('/entries');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Failed to toggle monthly payment status:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar status de pagamento',
    };
  }
}
