'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { EntryModel } from '@/domain/models';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { redirect } from 'next/navigation';
import {
  deleteEntryAction,
  toggleEntryPaidStatusAction,
  toggleMonthlyPaymentStatusAction,
} from '@/presentation/actions';
import { DeleteEntryModal } from './delete-entry-modal';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface EntryListItemProps {
  entry: EntryModel;
  showActions?: boolean;
  currentYear?: number;
  currentMonth?: number;
}

export const EntryListItem: React.FC<EntryListItemProps> = ({
  entry,
  showActions = true,
  currentYear,
  currentMonth,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTogglingPaid, startToggleTransition] = useTransition();
  const [optimisticIsPaid, setOptimisticIsPaid] = useState(entry.isPaid);
  const router = useRouter();

  // Sync optimistic state with entry prop when it changes
  useEffect(() => {
    setOptimisticIsPaid(entry.isPaid);
  }, [entry.isPaid]);

  const handleEdit = () => {
    redirect(`/entries/${entry.id}/edit`);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteWithModal = async (deleteAllOccurrences: boolean) => {
    await deleteEntryAction(entry.id, deleteAllOccurrences);
    setIsDeleteModalOpen(false);
  };

  const handlePaidStatusChange = async (value: string) => {
    const newIsPaid = value === 'paid';

    // Optimistic update
    setOptimisticIsPaid(newIsPaid);

    startToggleTransition(async () => {
      let result;

      // For fixed entries, use monthly payment status if we have current month/year
      if (entry.isFixed && currentYear && currentMonth) {
        result = await toggleMonthlyPaymentStatusAction({
          entryId: entry.id,
          year: currentYear,
          month: currentMonth,
          isPaid: newIsPaid,
        });
      } else {
        // For non-fixed entries or when month context is missing, use the original action
        result = await toggleEntryPaidStatusAction(entry, newIsPaid);
      }

      if (!result.success) {
        // Revert optimistic update on error
        setOptimisticIsPaid(entry.isPaid);
        toast.error(
          result.error ||
            'Erro ao atualizar status de pagamento. Tente novamente.'
        );
      } else {
        const message =
          entry.isFixed && currentYear && currentMonth
            ? newIsPaid
              ? `Despesa marcada como paga para ${currentMonth}/${currentYear}`
              : `Despesa marcada como não paga para ${currentMonth}/${currentYear}`
            : newIsPaid
              ? 'Despesa marcada como paga'
              : 'Despesa marcada como não paga';

        toast.success(message);
        // Refresh the page to show updated data
        router.refresh();
      }
    });
  };

  return (
    <>
      <DeleteEntryModal
        entry={entry}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteWithModal}
      />

      <Card className='mb-4 shadow-none transition-all duration-200'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex-1'>
            <div className='font-medium text-foreground'>
              {entry.description}
            </div>

            <div className='text-sm text-neutral-500 mt-1 flex items-center gap-2 flex-wrap'>
              <span>
                {entry.categoryName ?? 'Sem categoria'} •{' '}
                {formatDate(entry.date)}
              </span>

              {entry.isFixed && (
                <Badge
                  variant='secondary'
                  className='bg-primary/10 text-primary'
                >
                  Fixa
                </Badge>
              )}

              {entry.isFromPreviousMonth && (
                <Badge
                  variant='outline'
                  className='border-warning text-warning text-xs'
                >
                  Mês Anterior
                </Badge>
              )}

              {entry.type === 'EXPENSE' && (
                <Select
                  value={optimisticIsPaid ? 'paid' : 'unpaid'}
                  onValueChange={handlePaidStatusChange}
                  disabled={isTogglingPaid}
                >
                  <SelectTrigger
                    className={cn(
                      '!h-6 px-2 py-0 text-xs font-medium rounded-md border-0 shadow-none focus:ring-0 focus:ring-offset-0 w-auto min-w-fit gap-0 cursor-pointer',
                      optimisticIsPaid
                        ? 'bg-success hover:bg-success-400'
                        : 'bg-error hover:bg-error-400',
                      isTogglingPaid && 'opacity-50 cursor-not-allowed',
                      '[&>svg]:hidden' // Hide the dropdown arrow
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className='min-w-[120px]'>
                    <SelectItem value='paid'>Pago</SelectItem>
                    <SelectItem value='unpaid'>Não pago</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <div
              className={`font-semibold ${
                entry.type === 'INCOME' ? 'text-success' : 'text-error'
              }`}
            >
              {entry.type === 'INCOME' ? '+' : '-'}
              {formatCurrency(entry.amount)}
            </div>

            {showActions && (
              <div className='flex items-center space-x-1'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleEdit}
                  title='Editar entrada'
                  data-testid='edit-button'
                  className='h-8 w-8'
                >
                  <PencilSimpleIcon className='w-4 h-4' />
                </Button>

                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleDeleteClick}
                  title='Excluir entrada'
                  data-testid='delete-button'
                  className='h-8 w-8'
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
