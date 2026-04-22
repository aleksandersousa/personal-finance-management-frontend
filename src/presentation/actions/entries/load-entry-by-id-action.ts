'use client';

import type { EntryModel } from '@/domain/models';
import { loadEntriesByMonthAction } from './load-entries-by-month-action';

function parseEntryDates(entry: EntryModel): EntryModel {
  return {
    ...entry,
    issueDate: new Date(entry.issueDate),
    dueDate: new Date(entry.dueDate),
    createdAt: new Date(entry.createdAt),
    updatedAt: new Date(entry.updatedAt),
  };
}

async function loadEntryFromMonthList(
  id: string,
  month: string
): Promise<EntryModel | null> {
  try {
    const result = await loadEntriesByMonthAction({
      month,
      page: '1',
      limit: '1000',
    });
    const found = result.data?.find(e => e.id === id);
    return found ? parseEntryDates(found) : null;
  } catch (error) {
    console.warn(`Error loading entries for month ${month}:`, error);
    return null;
  }
}

function mergeIntoLocalStorageCache(entry: EntryModel): void {
  try {
    const cachedEntries = localStorage.getItem('cached-entries');
    const parsed: EntryModel[] = cachedEntries ? JSON.parse(cachedEntries) : [];
    const without = parsed.filter(e => e.id !== entry.id);
    without.push(entry);
    localStorage.setItem('cached-entries', JSON.stringify(without));
  } catch {}
}

export async function loadEntryByIdFromCache(
  id: string,
  listMonthFilter?: string
): Promise<EntryModel | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (listMonthFilter && /^\d{4}-\d{2}$/.test(listMonthFilter)) {
      const fromList = await loadEntryFromMonthList(id, listMonthFilter);
      if (fromList) {
        mergeIntoLocalStorageCache(fromList);
        return fromList;
      }
      return null;
    }

    const cachedEntries = localStorage.getItem('cached-entries');
    if (cachedEntries) {
      const entries: EntryModel[] = JSON.parse(cachedEntries);
      const entry = entries.find(e => e.id === id);

      if (entry) {
        const parsed = parseEntryDates(entry);
        return parsed;
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

    const entry = allEntries.find(e => e.id === id);

    if (!entry) {
      return null;
    }

    let resolved = parseEntryDates(entry);

    const updatedCache = [
      ...(cachedEntries ? JSON.parse(cachedEntries) : []),
      resolved,
    ];
    localStorage.setItem('cached-entries', JSON.stringify(updatedCache));

    return {
      ...resolved,
      createdAt: new Date(resolved.createdAt),
      updatedAt: new Date(resolved.updatedAt),
    };
  } catch (error) {
    console.error('Error loading entry from cache:', error);
    return null;
  }
}
