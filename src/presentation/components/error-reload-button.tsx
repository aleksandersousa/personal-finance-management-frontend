'use client';

import React from 'react';
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr';

export const ErrorReloadButton: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleReload}
      className='inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
    >
      <ArrowClockwiseIcon className='w-5 h-5' weight='bold' />
      Recarregar Página
    </button>
  );
};
