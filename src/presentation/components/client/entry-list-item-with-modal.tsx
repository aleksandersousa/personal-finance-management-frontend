'use client';

import React, { useState } from 'react';
import { EntryModel } from '@/domain/models';
import { EntryListItem } from '@/presentation/components/ui';
import { DeleteEntryModal } from './delete-entry-modal';

interface EntryListItemWithModalProps {
  entry: EntryModel;
  onDelete?: (id: string, deleteAllOccurrences: boolean) => Promise<void>;
}

export const EntryListItemWithModal: React.FC<EntryListItemWithModalProps> = ({
  entry,
  onDelete,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (id: string) => {
    window.location.href = `/entries/${id}/edit`;
  };

  const handleDeleteClick = async () => {
    // Para uso com modal, apenas abrimos o modal
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Wrapper para o onDelete que fecha o modal em caso de sucesso
  const handleDeleteWithModal = async (
    id: string,
    deleteAllOccurrences: boolean
  ) => {
    if (onDelete) {
      try {
        await onDelete(id, deleteAllOccurrences);
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
      <EntryListItem
        entry={entry}
        onEdit={handleEdit}
        onDelete={onDelete ? handleDeleteForListItem : undefined}
        showActions={true}
      />

      {onDelete && (
        <DeleteEntryModal
          entry={entry}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDeleteWithModal}
        />
      )}
    </>
  );
};
