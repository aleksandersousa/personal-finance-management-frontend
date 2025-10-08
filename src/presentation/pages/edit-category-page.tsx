import React from 'react';
import { EditCategoryFormWithFeedbackFactory } from '@/main/factories/components';

export interface EditCategoryPageProps {
  categoryId: string;
}

export const EditCategoryPage: React.FC<EditCategoryPageProps> = ({
  categoryId,
}) => {
  return (
    <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Editar Categoria
            </h1>
            <p className='text-slate-600'>Atualize os dados da sua categoria</p>
          </div>

          {/* Main Form Card */}
          <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
            <EditCategoryFormWithFeedbackFactory categoryId={categoryId} />
          </div>
        </div>
      </div>
    </div>
  );
};
