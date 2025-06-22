'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { AddEntryParams } from '@/domain/usecases/add-entry';

export async function addEntryAction(formData: FormData): Promise<void> {
  try {
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const type = formData.get('type') as 'INCOME' | 'EXPENSE';
    const categoryId = formData.get('categoryId') as string;
    const date = new Date(formData.get('date') as string);
    const isFixed = formData.get('isFixed') === 'true';

    const params: AddEntryParams = {
      description,
      amount,
      type,
      categoryId,
      date,
      isFixed,
      userId: 'mock-user-id', // In real implementation, get from auth
    };

    // Mock implementation - would call real API
    console.log('Adding entry:', params);

    // Revalidate cache
    revalidateTag('entries');
  } catch (error) {
    console.error('Error adding entry:', error);
    throw error;
  }

  redirect('/entries');
}
