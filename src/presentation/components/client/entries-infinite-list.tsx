'use client';

import React from 'react';
import { InfiniteScrollList } from './infinite-scroll-list';
import { EntryListItem } from './entry-list-item';
import { EntryModel } from '@/domain/models';
import { LoadEntriesByMonthResult } from '@/domain/usecases';

type EntriesFilters = {
  month: string;
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  search?: string;
  isPaid?: boolean | 'all';
};

type EntriesInfiniteListProps = {
  initialResult: LoadEntriesByMonthResult;
  filters: EntriesFilters;
};

export const EntriesInfiniteList: React.FC<EntriesInfiniteListProps> = ({
  initialResult,
  filters,
}) => {
  const loadPage = async (
    page: number
  ): Promise<{
    items: EntryModel[];
    page: number;
    totalPages: number;
    total: number;
  }> => {
    const params = new URLSearchParams({
      month: filters.month,
      page: String(page),
      limit: String(initialResult.pagination.limit),
    });

    if (filters.type) {
      params.append('type', filters.type);
    }

    if (filters.category) {
      params.append('category', filters.category);
    }

    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }

    if (filters.isPaid !== undefined && filters.isPaid !== 'all') {
      params.append('isPaid', String(filters.isPaid));
    }

    const url = `/api/frontend/entries?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load more entries: ${response.status}`);
    }

    const result = (await response.json()) as LoadEntriesByMonthResult;

    return {
      items: result.data,
      page: result.pagination.page,
      totalPages: result.pagination.totalPages,
      total: result.pagination.total,
    };
  };

  return (
    <InfiniteScrollList<EntryModel>
      initialItems={initialResult.data}
      initialPage={initialResult.pagination.page}
      totalPages={initialResult.pagination.totalPages}
      limit={initialResult.pagination.limit}
      total={initialResult.pagination.total}
      loadPage={loadPage}
      renderItem={(entry, index) => (
        <EntryListItem
          key={entry.id}
          entry={entry}
          currentYear={new Date(filters.month).getFullYear()}
          currentMonth={new Date(filters.month).getMonth() + 1}
        />
      )}
      className='mt-4'
    />
  );
};
