'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FunnelIcon, XIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.type && newFilters.type !== 'all') {
      params.set('type', newFilters.type);
    } else {
      params.delete('type');
    }

    router.push(`/categories?${params.toString()}`);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: 'all',
    } as typeof filters;
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const hasActiveFilters = filters.type !== 'all';

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
