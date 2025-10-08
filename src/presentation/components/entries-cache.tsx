'use client';

import { useEffect } from 'react';
import { EntryModel } from '@/domain/models';

interface EntriesCacheProps {
  entries: EntryModel[];
}

export const EntriesCache: React.FC<EntriesCacheProps> = ({ entries }) => {
  useEffect(() => {
    // Salvar as entradas no localStorage para uso posterior
    localStorage.setItem('cached-entries', JSON.stringify(entries));
  }, [entries]);

  return null; // Componente invisível
};
