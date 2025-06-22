'use client';

import { useState, useTransition } from 'react';
import { EntryForm } from './entry-form';
import { EntryFormData } from '@/infra/validation';
import { ZodFormValidator } from '@/infra/validation/zod-form-validator';
import { entryFormSchema } from '@/infra/validation/entry-form-schema';
import { addEntryAction } from '@/presentation/actions/add-entry-action';

export function EntryFormWithFeedback() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Create validator on the client side
  const validator = new ZodFormValidator(entryFormSchema);

  const handleSubmit = async (data: EntryFormData) => {
    setFeedback({ type: null, message: '' });

    startTransition(async () => {
      try {
        await addEntryAction(data);
        setFeedback({
          type: 'success',
          message: 'Entrada adicionada com sucesso!',
        });
      } catch (error) {
        console.error(error);
        setFeedback({
          type: 'error',
          message: 'Erro ao adicionar entrada. Tente novamente.',
        });
      }
    });
  };

  return (
    <div className='space-y-4'>
      {feedback.type && (
        <div
          className={`p-4 rounded-lg ${
            feedback.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <EntryForm
        validator={validator}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
