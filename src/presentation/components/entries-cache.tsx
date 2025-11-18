'use client';

import { useEffect } from 'react';
import { EntryModel } from '@/domain/models';

interface EntriesCacheProps {
  entries: EntryModel[];
}

export const EntriesCache: React.FC<EntriesCacheProps> = ({ entries }) => {
  useEffect(() => {
    localStorage.setItem('cached-entries', JSON.stringify(entries));
  }, [entries]);
  return null;
};
