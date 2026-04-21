'use client';

import React from 'react';
import { InfiniteScrollList } from './infinite-scroll-list';
import { EntryListItem } from './entry-list-item';
import { EntryModel } from '@/domain/models';
import { LoadEntriesByMonthResult } from '@/domain/usecases';

type EntriesFilters = {
  month: string;
  category?: string;
  search?: string;
  sort?: 'dueDate' | 'amount' | 'description';
  order?: 'asc' | 'desc';
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

    if (filters.category) {
      params.append('category', filters.category);
    }

    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }

    if (filters.sort) {
      params.append('sort', filters.sort);
    }

    if (filters.order) {
      params.append('order', filters.order);
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
      renderItem={entry => (
        <EntryListItem
          key={entry.id}
          entry={entry}
          listMonthFilter={filters.month}
        />
      )}
      className='mt-4'
    />
  );
};
