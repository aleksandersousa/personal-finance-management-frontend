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
    <div className='flex items-center justify-between border-b py-2'>
      <div>
        <div className='font-medium'>{entry.description}</div>
        <div className='text-xs text-gray-500'>
          {entry.categoryName} • {formatDate(entry.date)}
        </div>
      </div>
      <div
        className={entry.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}
      >
        {entry.type === 'INCOME' ? '+' : '-'} R${' '}
        {(entry.amount / 100).toFixed(2)}
      </div>
    </div>
  );
};
