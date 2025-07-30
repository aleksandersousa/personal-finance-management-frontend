'use client';

import React from 'react';
import { EntryModel } from '@/domain/models';
import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';

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
  const formatDate = (date: Date) => {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(entry.id);
    } else {
      // Fallback para navegação direta
      window.location.href = `/entries/${entry.id}/edit`;
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
              {entry.categoryName} • {formatDate(entry.date)}
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
            {entry.type === 'INCOME' ? '+' : '-'} R${' '}
            {(entry.amount / 100).toFixed(2)}
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
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
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
                  <svg
                    className='w-4 h-4'
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
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
