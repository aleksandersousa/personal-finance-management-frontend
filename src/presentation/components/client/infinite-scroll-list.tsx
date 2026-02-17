'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loading } from '../ui';

type InfiniteScrollListProps<T> = {
  initialItems: T[];
  initialPage: number;
  totalPages: number;
  limit: number;
  total: number;
  loadPage: (
    page: number
  ) => Promise<{ items: T[]; page: number; totalPages: number; total: number }>;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
};

export function InfiniteScrollList<T>({
  initialItems,
  initialPage,
  totalPages,
  limit,
  total,
  loadPage,
  renderItem,
  className,
}: InfiniteScrollListProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialItems);
    setCurrentPage(initialPage);
    setHasMore(initialPage < totalPages);
    setError(null);
  }, [initialItems, initialPage, totalPages, limit, total]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          setIsLoading(true);
          loadPage(currentPage + 1)
            .then(result => {
              setItems(prev => [...prev, ...result.items]);
              setCurrentPage(result.page);
              setHasMore(result.page < result.totalPages);
              setError(null);
            })
            .catch(() => {
              setError('Erro ao carregar mais itens.');
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [currentPage, hasMore, isLoading, loadPage]);

  return (
    <div className={className}>
      <div className='divide-y divide-neutral-200'>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      <div ref={sentinelRef} className='flex flex-col items-center py-4'>
        {isLoading && <Loading size='sm' />}
        {error && <span className='text-sm text-error mt-2'>{error}</span>}
      </div>
    </div>
  );
}
