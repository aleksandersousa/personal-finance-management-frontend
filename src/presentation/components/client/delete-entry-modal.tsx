'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/presentation/components/ui';
import { deleteEntryAction } from '@/presentation/actions';
import { EntryModel } from '@/domain/models/entry';
import type { DeleteEntry } from '@/domain/usecases';

export interface DeleteEntryModalProps {
  entry: EntryModel;
  isOpen: boolean;
  onClose: () => void;
  deleteEntry: DeleteEntry;
}

export const DeleteEntryModal: React.FC<DeleteEntryModalProps> = ({
  entry,
  isOpen,
  onClose,
  deleteEntry,
}) => {
  const [deleteAllOccurrences, setDeleteAllOccurrences] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleConfirmDelete = () => {
    setFeedback({ type: null, message: '' });

    startTransition(async () => {
      try {
        await deleteEntryAction(entry.id, deleteAllOccurrences, deleteEntry);
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
            <svg
              className='w-5 h-5 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
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
                  <svg
                    className='w-5 h-5 text-amber-600 mt-0.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
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
            disabled={isPending}
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
