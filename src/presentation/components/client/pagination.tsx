'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Button } from '../ui';
import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentLimit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  currentLimit = 10,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [pageInput, setPageInput] = useState(currentPage.toString());

  // Sync pageInput when currentPage prop changes
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Calculate showing range
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
  const endItem = Math.min(currentPage * currentLimit, totalItems);

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    if (onPageChange) {
      onPageChange(validPage);
    } else {
      const params = new URLSearchParams(currentSearchParams);
      params.set('page', validPage.toString());
      router.push(`?${params.toString()}`);
    }
    setPageInput(validPage.toString());
  };

  const handleLimitChange = (limit: string) => {
    const newLimit = parseInt(limit, 10);
    if (onLimitChange) {
      onLimitChange(newLimit);
    } else {
      const params = new URLSearchParams(currentSearchParams);
      params.set('limit', newLimit.toString());
      params.set('page', '1'); // Reset to first page when changing limit
      router.push(`?${params.toString()}`);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const rowsPerPageOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
  ];

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-6'>
      {/* Showing information */}
      <div className='text-sm text-foreground-secondary'>
        Exibindo {startItem}-{endItem} de {totalItems}
      </div>

      {/* Pagination controls */}
      <div className='flex items-center'>
        {/* First page button */}
        <Button
          variant='ghost'
          className={`rounded transition-colors ${
            isFirstPage
              ? 'text-neutral-400 cursor-not-allowed'
              : 'hover:bg-neutral-300 text-foreground'
          }`}
          onClick={() => handlePageChange(1)}
          disabled={isFirstPage}
          aria-label='First page'
          title='First page'
        >
          <CaretDoubleLeftIcon className='w-4 h-4' />
        </Button>

        {/* Previous page button */}
        <Button
          variant='ghost'
          className={`rounded transition-colors mr-2 ${
            isFirstPage
              ? 'text-neutral-400 cursor-not-allowed'
              : 'hover:bg-neutral-300 text-foreground'
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label='página anterior'
          title='página anterior'
        >
          <CaretLeftIcon className='w-4 h-4' />
        </Button>

        {/* Page number input */}
        <div className='flex items-center gap-1'>
          <input
            type='text'
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            onKeyDown={handlePageInputKeyDown}
            className='w-12 text-center text-sm border border-border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            aria-label='página atual'
          />
          <span className='text-sm text-foreground-secondary'>
            de {totalPages}
          </span>
        </div>

        {/* Next page button */}
        <Button
          variant='ghost'
          className={`rounded transition-colors ml-2 ${
            isLastPage
              ? 'text-neutral-400 cursor-not-allowed'
              : 'hover:bg-neutral-300 text-foreground'
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label='próxima página'
          title='próxima página'
        >
          <CaretRightIcon className='w-4 h-4' />
        </Button>

        {/* Last page button */}
        <Button
          variant='ghost'
          className={`rounded transition-colors ${
            isLastPage
              ? 'text-neutral-400 cursor-not-allowed'
              : 'hover:bg-neutral-300 text-foreground'
          }`}
          onClick={() => handlePageChange(totalPages)}
          disabled={isLastPage}
          aria-label='última página'
          title='última página'
        >
          <CaretDoubleRightIcon className='w-4 h-4' />
        </Button>
      </div>

      {/* Rows per page selector */}
      <div className='flex items-center gap-2'>
        <span className='text-sm text-foreground-secondary'>
          Linhas por página:
        </span>
        <Select
          value={currentLimit.toString()}
          onValueChange={handleLimitChange}
        >
          <SelectTrigger className='w-20' size='sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
