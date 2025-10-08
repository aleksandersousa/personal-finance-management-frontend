import React from 'react';
import { EditEntryFormWithFeedbackFactory } from '@/main/factories/components';
import { EntryModel } from '@/domain/models/entry';

export interface EditEntryPageProps {
  entry: EntryModel;
}

export const EditEntryPage: React.FC<EditEntryPageProps> = ({ entry }) => {
  return (
    <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-2xl box-border'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Editar Entrada
            </h1>
            <p className='text-slate-600'>
              Atualize os dados da sua entrada financeira
            </p>
          </div>

          {/* Main Form Card */}
          <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
            <EditEntryFormWithFeedbackFactory entry={entry} />
          </div>
        </div>
      </div>
    </div>
  );
};
