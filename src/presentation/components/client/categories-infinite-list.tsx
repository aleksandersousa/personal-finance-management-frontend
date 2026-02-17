'use client';

import React from 'react';
import { InfiniteScrollList } from './infinite-scroll-list';
import { CategoryListItem } from './category-list-item';
import {
  CategoryWithStatsModel,
  CategoryListResponseModel,
} from '@/domain/models';
import { LoadCategoriesParams } from '@/domain/usecases';
import { RemoteLoadCategories } from '@/data/usecases';
import { makeApiUrl, makeFetchHttpClient } from '@/main/factories/http';

type CategoriesInfiniteListProps = {
  initialResult: CategoryListResponseModel;
  filters: Omit<LoadCategoriesParams, 'page' | 'limit'> & {
    includeStats?: boolean;
  };
};

const httpClient = makeFetchHttpClient();
const remoteLoadCategories = new RemoteLoadCategories(
  makeApiUrl('/categories'),
  httpClient
);

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
    const result = await remoteLoadCategories.load({
      type: filters.type,
      includeStats: filters.includeStats,
      page,
      limit: pagination?.limit,
      search: filters.search,
    });

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
