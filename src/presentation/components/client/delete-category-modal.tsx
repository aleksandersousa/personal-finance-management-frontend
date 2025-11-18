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
  const [feedback, setFeedback] = useState<{
    type: 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleConfirmDelete = () => {
    if (!onDelete) return;

    setFeedback({ type: null, message: '' });

    startTransition(async () => {
      try {
        await onDelete();
      } catch (error) {
        console.error('Error deleting category:', error);
        setFeedback({
          type: 'error',
          message: 'Erro ao excluir categoria. Tente novamente.',
        });
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setFeedback({ type: null, message: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-slate-900/20 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-200'>
        <div className='flex items-center mb-4'>
          <div className='flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
            <TrashIcon className='w-5 h-5 text-red-600' weight='bold' />
          </div>
          <h3 className='ml-3 text-lg font-semibold text-slate-900'>
            Confirmar Exclusão
          </h3>
        </div>

        <div className='mb-6'>
          <p className='text-slate-600 mb-4'>
            Você tem certeza que deseja excluir a categoria:
          </p>

          <div className='bg-slate-50 rounded-lg p-4 mb-4'>
            <div className='flex items-center gap-3 mb-2'>
              <div
                className='w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm'
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <div>
                <div className='font-medium text-slate-900'>
                  {category.name}
                </div>
                <div className='text-sm text-slate-500'>
                  {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                  {category.description && ` • ${category.description}`}
                </div>
              </div>
            </div>

            {category.entriesCount > 0 && (
              <div className='text-sm text-slate-500 mt-2'>
                {category.entriesCount} entrada
                {category.entriesCount !== 1 ? 's' : ''} • Total:{' '}
                {formatCurrency(category.totalAmount)}
                {category.lastUsed &&
                  ` • Último uso: ${formatDate(category.lastUsed)}`}
              </div>
            )}
          </div>

          {category.entriesCount > 0 && (
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4'>
              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <WarningIcon
                    className='w-5 h-5 text-amber-600 mt-0.5'
                    weight='bold'
                  />
                </div>
                <div className='ml-3'>
                  <p className='text-sm font-medium text-amber-800'>
                    Esta categoria possui {category.entriesCount} entrada
                    {category.entriesCount !== 1 ? 's' : ''} associada
                    {category.entriesCount !== 1 ? 's' : ''}
                  </p>
                  <p className='text-sm text-amber-700 mt-1'>
                    Ao excluir esta categoria, as entradas associadas ficarão
                    sem categoria.
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className='text-sm text-slate-500'>
            <strong>Esta ação não pode ser desfeita.</strong> A categoria será
            permanentemente removida dos seus registros.
          </p>
        </div>

        {feedback.type === 'error' && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'>
            {feedback.message}
          </div>
        )}

        <div className='flex space-x-3'>
          <Button
            onClick={handleClose}
            variant='secondary'
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
