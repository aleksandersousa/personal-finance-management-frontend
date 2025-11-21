'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Default URL-based navigation
      const params = new URLSearchParams(currentSearchParams);
      params.set('page', page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className='flex justify-center mt-6'>
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const isCurrentPage = currentPage === page;

        return (
          <button
            key={i}
            className={`mx-1 px-3 py-1 rounded transition-colors ${
              isCurrentPage
                ? 'bg-blue-600 text-white cursor-default'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handlePageChange(page)}
            disabled={isCurrentPage}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
