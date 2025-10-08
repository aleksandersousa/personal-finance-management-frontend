'use client';

import { useState, useTransition, useEffect } from 'react';
import { EditEntryForm } from './edit-entry-form';
import { EntryFormData } from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';
import {
  updateEntryAction,
  loadEntryByIdFromCache,
} from '@/presentation/actions';
import { EntryModel } from '@/domain/models/entry';
import { PageLoading } from '@/presentation/components';

export interface EditEntryFormWithFeedbackProps {
  entryId: string;
  validator: FormValidator<EntryFormData>;
}

export function EditEntryFormWithFeedback({
  entryId,
  validator,
}: EditEntryFormWithFeedbackProps) {
  const [entry, setEntry] = useState<EntryModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const loadEntry = async () => {
      const cachedEntry = await loadEntryByIdFromCache(entryId);

      if (cachedEntry) {
        setEntry(cachedEntry);
      }

      setIsLoading(false);
    };

    loadEntry();
  }, [entryId]);

  const handleSubmit = async (data: EntryFormData) => {
    if (!entry) return;

    setFeedback({ type: null, message: '' });

    startTransition(async () => {
      try {
        await updateEntryAction(entryId, data);

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

  if (isLoading) {
    return <PageLoading text='Carregando entrada...' />;
  }

  if (!entry) {
    return <div>Entrada não encontrada</div>;
  }

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
