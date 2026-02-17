'use client';

import React from 'react';
import { InfiniteScrollList } from './infinite-scroll-list';
import { CategoryListItem } from './category-list-item';
import {
  CategoryWithStatsModel,
  CategoryListResponseModel,
} from '@/domain/models';
import { LoadCategoriesParams } from '@/domain/usecases';

type CategoriesInfiniteListProps = {
  initialResult: CategoryListResponseModel;
  filters: Omit<LoadCategoriesParams, 'page' | 'limit'> & {
    includeStats?: boolean;
  };
};

export const CategoriesInfiniteList: React.FC<CategoriesInfiniteListProps> = ({
  initialResult,
  filters,
}) => {
  const pagination =
    initialResult.pagination ??
    ({
      page: 1,
      limit: initialResult.data.length || 1,
      total: initialResult.data.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    } as CategoryListResponseModel['pagination']);

  const loadPage = async (
    page: number
  ): Promise<{
    items: CategoryWithStatsModel[];
    page: number;
    totalPages: number;
    total: number;
  }> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pagination?.limit),
    });

    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }

    if (filters.includeStats !== undefined) {
      params.append('includeStats', String(filters.includeStats));
    }

    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }

    const url = `/api/frontend/categories?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to load more categories: ${response.status}`);
    }

    const result = (await response.json()) as CategoryListResponseModel;

    return {
      items: result.data,
      page: result.pagination?.page ?? 1,
      totalPages: result.pagination?.totalPages ?? 1,
      total: result.pagination?.total ?? 0,
    };
  };

  return (
    <InfiniteScrollList<CategoryWithStatsModel>
      initialItems={initialResult.data}
      initialPage={pagination?.page ?? 1}
      totalPages={pagination?.totalPages ?? 1}
      limit={pagination?.limit ?? 1}
      total={pagination?.total ?? 0}
      loadPage={loadPage}
      renderItem={category => (
        <CategoryListItem
          key={category.id}
          category={category}
          showActions={!category.isDefault}
        />
      )}
      className='mt-4'
    />
  );
};
