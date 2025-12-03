'use client';

import { EntryModel } from '@/domain/models';
import { loadEntriesByMonthAction } from './load-entries-by-month-action';

export async function loadEntryByIdFromCache(
  id: string
): Promise<EntryModel | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cachedEntries = localStorage.getItem('cached-entries');
    if (cachedEntries) {
      const entries: EntryModel[] = JSON.parse(cachedEntries);
      const entry = entries.find(entry => entry.id === id);

      if (entry) {
        return {
          ...entry,
          date: new Date(entry.date),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt),
        };
      }
    }

    const currentDate = new Date();
    const monthsToSearch = [];

    for (let i = -12; i <= 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      monthsToSearch.push(date.toISOString().slice(0, 7));
    }

    const searchPromises = monthsToSearch.map(async month => {
      try {
        const result = await loadEntriesByMonthAction({
          month,
          page: '1',
          limit: '1000',
        });
        return result.data;
      } catch (error) {
        console.warn(`Error loading entries for month ${month}:`, error);
        return [];
      }
    });

    const allEntriesArrays = await Promise.all(searchPromises);
    const allEntries = allEntriesArrays.flat();

    const entry = allEntries.find(entry => entry.id === id);

    if (!entry) {
      return null;
    }

    const updatedCache = [
      ...(cachedEntries ? JSON.parse(cachedEntries) : []),
      entry,
    ];
    localStorage.setItem('cached-entries', JSON.stringify(updatedCache));

    return {
      ...entry,
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    };
  } catch (error) {
    console.error('Error loading entry from cache:', error);
    return null;
  }
}
