'use client';

import React from 'react';
import { EntryModel } from '@/domain/models';
import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { formatCurrency, formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';

interface EntryListItemProps {
  entry: EntryModel;
  onDelete?: (id: string, deleteAllOccurrences: boolean) => Promise<void>;
  onEdit?: (id: string) => void;
  showActions?: boolean;
}

export const EntryListItem: React.FC<EntryListItemProps> = ({
  entry,
  onDelete,
  onEdit,
  showActions = true,
}) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(entry.id);
    } else {
      redirect(`/entries/${entry.id}/edit`);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      // Para simplificar nos testes, vamos chamar diretamente sem modal
      // Em produção, isso seria substituído por um modal
      const deleteAllOccurrences = entry.isFixed
        ? confirm(
            'Esta é uma entrada fixa. Deseja excluir todas as ocorrências futuras?'
          )
        : false;

      onDelete(entry.id, deleteAllOccurrences);
    }
  };

  return (
    <Card className='mb-3 hover:shadow-md transition-all duration-200'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex-1'>
          <div className='font-medium text-foreground'>{entry.description}</div>
          <div className='text-sm text-muted-foreground mt-1 flex items-center gap-2'>
            <span>
              {entry.categoryName ?? 'Sem categoria'} • {formatDate(entry.date)}
            </span>
            {entry.isFixed && (
              <Badge variant='secondary' className='bg-primary/10 text-primary'>
                Fixa
              </Badge>
            )}
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <div
            className={`font-semibold ${
              entry.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
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
                <PencilSimpleIcon className='w-4 h-4' weight='bold' />
              </Button>

              {onDelete && (
                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleDeleteClick}
                  title='Excluir entrada'
                  data-testid='delete-button'
                  className='h-8 w-8 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400'
                >
                  <TrashIcon className='w-4 h-4' weight='bold' />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
