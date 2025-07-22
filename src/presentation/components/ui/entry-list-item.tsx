import React from 'react';
import { EntryModel } from '@/domain/models';

interface EntryListItemProps {
  entry: EntryModel;
}

export const EntryListItem: React.FC<EntryListItemProps> = ({ entry }) => {
  const formatDate = (date: Date) => {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className='flex items-center justify-between border-b py-4 hover:bg-slate-50 transition-colors'>
      <div className='flex-1'>
        <div className='font-medium text-slate-900'>{entry.description}</div>
        <div className='text-sm text-slate-500 mt-1'>
          {entry.categoryName} • {formatDate(entry.date)}
          {entry.isFixed && (
            <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700'>
              Fixa
            </span>
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

        <a
          href={`/entries/${entry.id}/edit`}
          className='inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors'
          title='Editar entrada'
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
        </a>
      </div>
    </div>
  );
};
