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

function parseCalendarYearMonth(isoMonth: string): {
  year: number;
  month: number;
} {
  const match = /^(\d{4})-(\d{2})$/.exec(isoMonth.trim());
  if (!match) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

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

  const { year: listYear, month: listMonth } = parseCalendarYearMonth(
    filters.month
  );

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
          currentYear={listYear}
          currentMonth={listMonth}
          listMonthFilter={filters.month}
        />
      )}
      className='mt-4'
    />
  );
};
