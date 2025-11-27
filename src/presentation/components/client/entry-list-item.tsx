'use client';

import React, { useState } from 'react';
import { EntryModel } from '@/domain/models';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { formatCurrency, formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { deleteEntryAction } from '@/presentation/actions';
import { DeleteEntryModal } from './delete-entry-modal';

interface EntryListItemProps {
  entry: EntryModel;
  showActions?: boolean;
}

export const EntryListItem: React.FC<EntryListItemProps> = ({
  entry,
  showActions = true,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

            <div className='text-sm text-neutral-500 mt-1 flex items-center gap-2'>
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
