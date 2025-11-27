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
        <div className='p-4 sm:p-5'>
          {/* Mobile and Desktop Layout */}
          <div className='flex items-start gap-3 sm:gap-4'>
            {/* Category Icon */}
            <div
              className='w-12 h-12 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-foreground text-lg shrink-0'
              style={{ backgroundColor: category.color }}
            />

            {/* Main Content */}
            <div className='flex-1 min-w-0'>
              {/* Category Name and Badge */}
              <div className='flex items-start justify-between gap-2 mb-1'>
                <h3 className='font-medium text-foreground'>{category.name}</h3>
                {category.isDefault && (
                  <Badge
                    variant='secondary'
                    className='bg-primary/10 text-primary shrink-0'
                  >
                    Padrão
                  </Badge>
                )}
              </div>

              {/* Description and Type */}
              <p className='text-sm text-foreground mb-2 line-clamp-1'>
                {category.description || 'Sem descrição'} •{' '}
                {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
              </p>

              {/* Stats - Mobile: Stack, Desktop: Inline */}
              {category.entriesCount > 0 && (
                <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-neutral-500 mb-3 sm:mb-2'>
                  <span>
                    {category.entriesCount} entrada
                    {category.entriesCount !== 1 ? 's' : ''}
                  </span>
                  <span className='hidden sm:inline'>•</span>
                  <span
                    className={`font-medium ${
                      category.type === 'INCOME' ? 'text-success' : 'text-error'
                    }`}
                  >
                    {formatCurrency(category.totalAmount)}
                  </span>
                  {category.lastUsed && (
                    <>
                      <span className='hidden sm:inline'>•</span>
                      <span className='hidden sm:inline'>
                        Último uso: {formatDate(category.lastUsed)}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {showActions && !category.isDefault && (
                <div className='flex items-center gap-2 mt-3 sm:mt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleEdit}
                    title='Editar categoria'
                    data-testid='edit-button'
                    className='h-8'
                  >
                    <PencilSimpleIcon className='w-4 h-4 sm:mr-1.5' />
                    <span className='hidden sm:inline'>Editar</span>
                  </Button>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleDeleteClick}
                    title='Excluir categoria'
                    data-testid='delete-button'
                    className='h-8'
                  >
                    <TrashIcon className='w-4 h-4 sm:mr-1.5' weight='bold' />
                    <span className='hidden sm:inline'>Excluir</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
