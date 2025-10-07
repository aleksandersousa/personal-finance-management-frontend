'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/presentation/components/ui';
import { EntryModel } from '@/domain/models/entry';
import { TrashIcon, WarningIcon } from '@phosphor-icons/react/dist/ssr';

export interface DeleteEntryModalProps {
  entry: EntryModel;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string, deleteAllOccurrences: boolean) => Promise<void>;
}

export const DeleteEntryModal: React.FC<DeleteEntryModalProps> = ({
  entry,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [deleteAllOccurrences, setDeleteAllOccurrences] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleConfirmDelete = () => {
    if (!onDelete) return;

    setFeedback({ type: null, message: '' });

    startTransition(async () => {
      try {
        await onDelete(entry.id, deleteAllOccurrences);
      } catch (error) {
        console.error('Error deleting entry:', error);
        setFeedback({
          type: 'error',
          message: 'Erro ao excluir entrada. Tente novamente.',
        });
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setDeleteAllOccurrences(false);
      setFeedback({ type: null, message: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl p-6 max-w-md w-full'>
        {/* Header */}
        <div className='flex items-center mb-4'>
          <div className='flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
            <TrashIcon className='w-5 h-5 text-red-600' weight='bold' />
          </div>
          <h3 className='ml-3 text-lg font-semibold text-slate-900'>
            Confirmar Exclusão
          </h3>
        </div>

        {/* Content */}
        <div className='mb-6'>
          <p className='text-slate-600 mb-4'>
            Você tem certeza que deseja excluir a entrada:
          </p>

          <div className='bg-slate-50 rounded-lg p-4 mb-4'>
            <div className='font-medium text-slate-900'>
              {entry.description}
            </div>
            <div className='text-sm text-slate-500 mt-1'>
              {entry.categoryName} • {entry.date.toLocaleDateString('pt-BR')}
            </div>
            <div
              className={`text-sm font-semibold mt-1 ${
                entry.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {entry.type === 'INCOME' ? '+' : '-'} R${' '}
              {(entry.amount / 100).toFixed(2)}
            </div>
          </div>

          {/* Opção para entradas fixas */}
          {entry.isFixed && (
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4'>
              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <WarningIcon
                    className='w-5 h-5 text-amber-600 mt-0.5'
                    weight='bold'
                  />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-amber-800 mb-2'>
                    Esta é uma entrada fixa (recorrente)
                  </p>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='deleteAllOccurrences'
                      checked={deleteAllOccurrences}
                      onChange={e => setDeleteAllOccurrences(e.target.checked)}
                      className='h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded'
                      disabled={isPending}
                    />
                    <label
                      htmlFor='deleteAllOccurrences'
                      className='ml-2 text-sm text-amber-700'
                    >
                      Excluir todas as ocorrências futuras desta entrada fixa
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className='text-sm text-slate-500'>
            <strong>Esta ação não pode ser desfeita.</strong> A entrada será
            permanentemente removida dos seus registros financeiros.
          </p>
        </div>

        {/* Feedback de erro */}
        {feedback.type === 'error' && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'>
            {feedback.message}
          </div>
        )}

        {/* Actions */}
        <div className='flex space-x-3'>
          <Button
            onClick={handleConfirmDelete}
            variant='danger'
            className='flex-1'
            isLoading={isPending}
            disabled={isPending || !onDelete}
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>

          <Button
            onClick={handleClose}
            variant='secondary'
            className='flex-1'
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
