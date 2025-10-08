import React from 'react';
import { EntryFormWithFeedbackFactory } from '@/main/factories/components';

export const AddEntryPage: React.FC = () => {
  return (
    <div className='bg-slate-50 pt-20 pb-20 lg:pb-8 w-full min-h-screen'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Adicionar Nova Entrada
            </h1>
            <p className='text-slate-600'>
              Registre suas receitas e despesas para manter o controle
              financeiro
            </p>
          </div>

          {/* Main Form Card */}
          <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
            <EntryFormWithFeedbackFactory />
          </div>
        </div>
      </div>
    </div>
  );
};
