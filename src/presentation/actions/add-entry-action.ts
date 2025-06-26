'use server';

import { EntryFormData } from '@/infra/validation/entry-form-schema';
import { AddEntryParams } from '@/domain/usecases/add-entry';

export async function addEntryAction(data: EntryFormData): Promise<void> {
  // Convert EntryFormData to AddEntryParams
  const params: AddEntryParams = {
    description: data.description,
    amount: Math.round(data.amount * 100), // Convert to cents
    type: data.type,
    categoryId: data.categoryId,
    date: data.date,
    isFixed: data.isFixed,
    userId: 'mock-user-id', // In real implementation, get from auth
  };

  // Mock implementation - would call actual use case
  console.log('Adding entry:', params);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
}
