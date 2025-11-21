'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/presentation/components/ui';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { EntryModel } from '@/domain/models/entry';
import { TrashIcon, WarningIcon } from '@phosphor-icons/react/dist/ssr';
import { formatDate } from '@/lib/utils';

export interface DeleteEntryModalProps {
  entry: EntryModel;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (deleteAllOccurrences: boolean) => Promise<void>;
}

export const DeleteEntryModal: React.FC<DeleteEntryModalProps> = ({
  entry,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [deleteAllOccurrences, setDeleteAllOccurrences] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');

  const handleConfirmDelete = () => {
    if (!onDelete) return;

    setError('');
    startTransition(async () => {
      try {
        await onDelete(deleteAllOccurrences);
      } catch (err) {
        console.error('Error deleting entry:', err);
        setError('Erro ao excluir entrada. Tente novamente.');
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setDeleteAllOccurrences(false);
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const isIncome = entry.type === 'INCOME';
  const amount = (entry.amount / 100).toFixed(2);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-md bg-white rounded-[1.25rem] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-red-100'>
            <TrashIcon className='w-5 h-5 text-red-600' weight='bold' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Confirmar Exclusão
          </h3>
        </div>

        {/* Content */}
        <div className='mb-6 space-y-4'>
          <p className='text-sm text-gray-600'>
            Você tem certeza que deseja excluir a entrada:
          </p>

          {/* Entry Details */}
          <div className='p-4 rounded-xl bg-gray-50'>
            <div className='font-semibold text-gray-900'>
              {entry.description}
            </div>
            <div className='mt-1 text-xs text-gray-500'>
              {entry.categoryName} • {formatDate(entry.date)}
            </div>
            <div
              className={`mt-2 text-sm font-semibold ${
                isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            >
              {isIncome ? '+' : '-'} R$ {amount}
            </div>
          </div>

          {/* Fixed Entry Warning */}
          {entry.isFixed && (
            <div className='p-4 border rounded-xl bg-amber-50 border-amber-200'>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-3'>
                  <WarningIcon
                    className='flex-shrink-0 w-5 h-5 mt-0.5 text-amber-600'
                    weight='bold'
                  />
                  <p className='text-sm font-medium text-amber-800'>
                    Esta é uma entrada fixa (recorrente)
                  </p>
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='deleteAllOccurrences'
                      checked={deleteAllOccurrences}
                      onCheckedChange={checked =>
                        setDeleteAllOccurrences(checked === true)
                      }
                      disabled={isPending}
                      className='mt-0.5'
                    />
                    <label
                      htmlFor='deleteAllOccurrences'
                      className='text-sm text-amber-700 cursor-pointer leading-tight'
                    >
                      Excluir todas as ocorrências futuras desta entrada fixa
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <p className='text-xs text-gray-500'>
            <strong className='font-semibold'>
              Esta ação não pode ser desfeita.
            </strong>{' '}
            A entrada será permanentemente removida dos seus registros
            financeiros.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-4 p-3 text-sm border rounded-xl bg-red-50 border-red-200 text-red-700'>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className='flex gap-3'>
          <Button
            onClick={handleClose}
            variant='outline'
            className='flex-1'
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant='danger'
            className='flex-1'
            isLoading={isPending}
            disabled={isPending || !onDelete}
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  );
};
