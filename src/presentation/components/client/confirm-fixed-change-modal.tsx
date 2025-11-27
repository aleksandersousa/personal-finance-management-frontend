'use client';

import React from 'react';
import { Button } from '@/presentation/components/ui';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';

export interface ConfirmFixedChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  isFixed: boolean;
}

export const ConfirmFixedChangeModal: React.FC<
  ConfirmFixedChangeModalProps
> = ({ isOpen, onClose, onConfirm, isPending, isFixed }) => {
  const handleConfirm = () => {
    if (!onConfirm) return;
    onConfirm();
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm'>
      <div className='w-full max-w-md bg-background rounded-[1.25rem] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 border border-amber-200'>
            <WarningIcon className='w-5 h-5 text-amber-600' weight='bold' />
          </div>
          <h3 className='text-lg font-semibold text-foreground'>
            Confirmar Alteração
          </h3>
        </div>

        {/* Content */}
        <div className='mb-6 space-y-4'>
          <p className='text-sm text-foreground'>
            {isFixed
              ? 'Você está alterando uma entrada fixa para variável. Isso afetará suas projeções futuras.'
              : 'Você está alterando uma entrada variável para fixa. Isso incluirá esta entrada nas projeções futuras.'}
          </p>
        </div>

        {/* Actions */}
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant='primary'
            className='flex-1'
            isLoading={isPending}
            disabled={isPending || !onConfirm}
          >
            {isPending ? 'Confirmando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
