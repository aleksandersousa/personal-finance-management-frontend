'use client';

import { useState, useTransition } from 'react';
import { EditEntryForm } from './edit-entry-form';
import { EntryFormData } from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';
import { updateEntryAction } from '@/presentation/actions';
import { EntryModel } from '@/domain/models/entry';
import type { UpdateEntry } from '@/domain/usecases';

export interface EditEntryFormWithFeedbackProps {
  entry: EntryModel;
  validator: FormValidator<EntryFormData>;
  updateEntry: UpdateEntry;
}

export function EditEntryFormWithFeedback({
  entry,
  validator,
  updateEntry,
}: EditEntryFormWithFeedbackProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (data: EntryFormData) => {
    setFeedback({ type: null, message: '' });

    startTransition(async () => {
      try {
        await updateEntryAction(entry.id, data, updateEntry);

        setFeedback({
          type: 'success',
          message: 'Entrada atualizada com sucesso!',
        });
      } catch (error) {
        console.error(error);
        setFeedback({
          type: 'error',
          message: 'Erro ao atualizar entrada. Tente novamente.',
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

      <EditEntryForm
        entry={entry}
        validator={validator}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
