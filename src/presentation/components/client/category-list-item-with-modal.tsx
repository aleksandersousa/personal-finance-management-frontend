'use client';

import { useState } from 'react';
import { CategoryWithStatsModel } from '@/domain/models';
import { CategoryListItem } from '../ui/category-list-item';
import { DeleteCategoryModal } from './delete-category-modal';
import { deleteCategoryAction } from '@/presentation/actions';
import { redirect } from 'next/navigation';

interface CategoryListItemWithModalProps {
  category: CategoryWithStatsModel;
  onDelete?: (id: string) => Promise<void>;
}

export function CategoryListItemWithModal({
  category,
  onDelete,
}: CategoryListItemWithModalProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (id: string) => {
    redirect(`/categories/${id}/edit`);
  };

  const handleDeleteClick = async () => {
    // Para uso com modal, apenas abrimos o modal
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Wrapper para o onDelete que fecha o modal em caso de sucesso
  const handleDeleteWithModal = async (id: string) => {
    if (onDelete) {
      try {
        await onDelete(id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        // Erro será tratado pelo modal
        throw error;
      }
    } else {
      try {
        await deleteCategoryAction(id);
        setIsDeleteModalOpen(false);
      } catch (error) {
        // Erro será tratado pelo modal
        throw error;
      }
    }
  };

  const handleDeleteForListItem = async () => {
    await handleDeleteClick();
  };

  return (
    <>
      <CategoryListItem
        category={category}
        onEdit={handleEdit}
        onDelete={handleDeleteForListItem}
        showActions={!category.isDefault}
      />

      <DeleteCategoryModal
        category={category}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteWithModal}
      />
    </>
  );
}
