'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FunnelIcon,
  XIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface CategoriesFiltersProps {
  showHeader?: boolean;
  hasActiveFilters?: boolean;
}

const typeOptions = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'INCOME', label: 'Receitas' },
  { value: 'EXPENSE', label: 'Despesas' },
];

export const CategoriesFilters: React.FC<CategoriesFiltersProps> = ({
  showHeader = true,
  hasActiveFilters: externalHasActiveFilters = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    search: searchParams.get('search') || '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Debounce search updates, but immediately update other filters
    if (key === 'search') {
      // Clear existing timer
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }

      // Set new timer for debounced update
      searchDebounceTimerRef.current = setTimeout(() => {
        updateURL(newFilters);
      }, 500); // 500ms debounce delay
    } else {
      // Update URL immediately for non-search filters
      updateURL(newFilters);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
    };
  }, []);

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.type && newFilters.type !== 'all') {
      params.set('type', newFilters.type);
    } else {
      params.delete('type');
    }

    if (newFilters.search && newFilters.search.trim()) {
      params.set('search', newFilters.search.trim());
    } else {
      params.delete('search');
    }

    router.push(`/categories?${params.toString()}`);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: 'all',
      search: '',
    } as typeof filters;
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const hasActiveFilters =
    filters.type !== 'all' || (filters.search && filters.search.trim() !== '');

  const shouldShowHeader = showHeader || externalHasActiveFilters;

  if (!shouldShowHeader) {
    return null;
  }

  return (
    <div className='mb-6'>
      <div className='flex justify-end'>
        <div className='flex gap-2 mr-4 md:mr-0'>
          <Button
            variant='outline'
            onClick={() => setShowFilters(!showFilters)}
            className='flex-1 h-12 rounded-xl'
          >
            <FunnelIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            <span className='inline'>Filtros</span>
            {hasActiveFilters && (
              <span className='absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0 inline-flex items-center justify-center w-2 h-2 bg-primary rounded-full' />
            )}
          </Button>

          <Button
            variant='primary'
            className='flex-1 h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
          >
            <PlusIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            <Link href='/categories/add'>Nova Categoria</Link>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className='border-t border-border-foreground pt-4 mt-4 mx-4 md:mx-0'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label className='block text-sm text-foreground mb-1'>Tipo</label>
              <Select
                value={filters.type}
                onValueChange={value => handleFilterChange('type', value)}
              >
                <SelectTrigger className='w-full h-10 rounded-lg transition-colors'>
                  <SelectValue placeholder='Selecione o tipo' />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className='rounded-lg'
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className='block text-sm text-foreground mt-4'>Buscar</label>
            <div className='relative'>
              <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 z-10' />
              <Input
                type='text'
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                placeholder='Nome da categoria...'
                className='pl-10'
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className='mt-4 pt-4 border-t border-slate-200'>
              <button
                onClick={clearFilters}
                className='inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors'
              >
                <XIcon className='w-4 h-4' />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
