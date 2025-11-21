'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/presentation/components/ui';
import { CategoryWithStatsModel } from '@/domain/models/category';
import { TrashIcon, WarningIcon } from '@phosphor-icons/react/dist/ssr';
import { formatCurrency, formatDate } from '@/lib/utils';

export interface DeleteCategoryModalProps {
  category: CategoryWithStatsModel;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => Promise<void>;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>('');

  const handleConfirmDelete = () => {
    if (!onDelete) return;

    setError('');
    startTransition(async () => {
      try {
        await onDelete();
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Erro ao excluir categoria. Tente novamente.');
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const hasEntries = category.entriesCount > 0;
  const isIncome = category.type === 'INCOME';
  const entriesText = `${category.entriesCount} entrada${category.entriesCount !== 1 ? 's' : ''}`;

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
            Você tem certeza que deseja excluir a categoria:
          </p>

          {/* Category Details */}
          <div className='p-4 rounded-xl bg-gray-50'>
            <div className='flex items-center gap-3'>
              <div
                className='flex items-center justify-center w-10 h-10 text-sm text-white rounded-xl'
                style={{ backgroundColor: category.color }}
              />
              <div className='flex-1 min-w-0'>
                <div className='font-semibold text-gray-900'>
                  {category.name}
                </div>
                <div className='text-xs text-gray-500'>
                  {isIncome ? 'Receita' : 'Despesa'}
                  {category.description && ` • ${category.description}`}
                </div>
              </div>
            </div>

            {hasEntries && (
              <div className='pt-3 mt-3 text-xs border-t text-gray-500 border-gray-200'>
                <span className='font-medium'>{entriesText}</span>
                <span className='mx-1'>•</span>
                <span>Total: {formatCurrency(category.totalAmount)}</span>
                {category.lastUsed && (
                  <>
                    <span className='mx-1'>•</span>
                    <span>Último uso: {formatDate(category.lastUsed)}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Warning for Categories with Entries */}
          {hasEntries && (
            <div className='p-4 border rounded-xl bg-amber-50 border-amber-200'>
              <div className='flex items-start gap-3'>
                <WarningIcon
                  className='flex-shrink-0 w-5 h-5 mt-0.5 text-amber-600'
                  weight='bold'
                />
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-amber-800'>
                    Esta categoria possui {entriesText} associada
                    {category.entriesCount !== 1 ? 's' : ''}
                  </p>
                  <p className='text-sm text-amber-700'>
                    Ao excluir esta categoria, as entradas associadas ficarão
                    sem categoria.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <p className='text-xs text-gray-500'>
            <strong className='font-semibold'>
              Esta ação não pode ser desfeita.
            </strong>{' '}
            A categoria será permanentemente removida dos seus registros.
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
