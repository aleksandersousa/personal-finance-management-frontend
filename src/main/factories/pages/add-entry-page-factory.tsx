import { AddEntryPage } from '@/presentation/components/server/add-entry-page';
import { makeEntryFormValidator } from '@/main/factories/validation/entry-form-validator-factory';
import { EntryFormData } from '@/infra/validation/entry-form-schema';
import { AddEntryParams } from '@/domain/usecases/add-entry';

export function makeAddEntryPage() {
  const validator = makeEntryFormValidator();

  const handleSubmit = async (data: EntryFormData) => {
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
  };

  return <AddEntryPage validator={validator} onSubmit={handleSubmit} />;
}
