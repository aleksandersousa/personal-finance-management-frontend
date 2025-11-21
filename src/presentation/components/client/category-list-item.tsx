'use client';

import React, { useState } from 'react';
import { CategoryWithStatsModel } from '@/domain/models';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import { formatCurrency, formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { deleteCategoryAction } from '@/presentation/actions';
import { DeleteCategoryModal } from '.';

interface CategoryListItemProps {
  category: CategoryWithStatsModel;
  showActions?: boolean;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  showActions = true,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    redirect(`/categories/${category.id}/edit`);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteWithModal = async () => {
    await deleteCategoryAction(category.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <DeleteCategoryModal
        category={category}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteWithModal}
      />

      <Card className='mb-3 shadow-none transition-all duration-200'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center space-x-3 flex-1'>
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg p-6'
              style={{ backgroundColor: category.color }}
            />

            <div className='flex-1'>
              <div className='font-medium text-foreground'>{category.name}</div>
              <div className='text-sm text-muted-foreground mt-1 flex items-center gap-2'>
                <span>
                  {category.description || 'Sem descrição'} •{' '}
                  {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </span>
                {category.isDefault && (
                  <Badge
                    variant='secondary'
                    className='bg-primary/10 text-primary'
                  >
                    Padrão
                  </Badge>
                )}
              </div>
              {category.entriesCount > 0 && (
                <div className='text-xs text-muted-foreground mt-1'>
                  {category.entriesCount} entrada
                  {category.entriesCount !== 1 ? 's' : ''} • Total:{' '}
                  {formatCurrency(category.totalAmount)}
                  {category.lastUsed &&
                    ` • Último uso: ${formatDate(category.lastUsed)}`}
                </div>
              )}
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            {category.entriesCount > 0 && (
              <div className='text-right'>
                <div className='text-sm font-medium text-foreground'>
                  {category.entriesCount} entrada
                  {category.entriesCount !== 1 ? 's' : ''}
                </div>
                <div
                  className={`text-xs ${
                    category.type === 'INCOME'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatCurrency(category.totalAmount)}
                </div>
              </div>
            )}

            {showActions && !category.isDefault && (
              <div className='flex items-center space-x-1'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleEdit}
                  title='Editar categoria'
                  data-testid='edit-button'
                  className='h-8 w-8'
                >
                  <PencilSimpleIcon className='w-4 h-4' weight='bold' />
                </Button>

                <Button
                  variant='outline'
                  size='icon'
                  onClick={handleDeleteClick}
                  title='Excluir categoria'
                  data-testid='delete-button'
                  className='h-8 w-8 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400'
                >
                  <TrashIcon className='w-4 h-4' weight='bold' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
