'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';

interface CategoriesFiltersProps {
  totalResults: number;
  showHeader?: boolean;
  hasActiveFilters?: boolean;
}

const typeOptions = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'INCOME', label: 'Receitas' },
  { value: 'EXPENSE', label: 'Despesas' },
];

const sortOptions = [
  { value: 'name', label: 'Nome' },
  { value: 'entries', label: 'Número de entradas' },
  { value: 'amount', label: 'Valor total' },
  { value: 'lastUsed', label: 'Último uso' },
];

const orderOptions = [
  { value: 'asc', label: 'Crescente' },
  { value: 'desc', label: 'Decrescente' },
];

export const CategoriesFilters: React.FC<CategoriesFiltersProps> = ({
  totalResults,
  showHeader = true,
  hasActiveFilters: externalHasActiveFilters = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    sort: searchParams.get('sort') || 'name',
    order: searchParams.get('order') || 'asc',
    search: searchParams.get('search') || '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/categories?${params.toString()}`);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: 'all',
      sort: 'name',
      order: 'asc',
      search: '',
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.sort !== 'name' ||
    filters.order !== 'asc' ||
    filters.search !== '';

  // Show header if there are results OR if there are active filters
  const shouldShowHeader = showHeader || externalHasActiveFilters;

  if (!shouldShowHeader) {
    return null;
  }

  return (
    <div className='mb-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
        <div>
          <h2 className='text-xl font-bold text-slate-900'>Categorias</h2>
          <p className='text-sm text-slate-600'>
            {totalResults}{' '}
            {totalResults === 1
              ? 'categoria encontrada'
              : 'categorias encontradas'}
          </p>
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
          >
            <FunnelIcon className='w-4 h-4' />
            Filtros
            {hasActiveFilters && (
              <span className='inline-flex items-center justify-center w-2 h-2 bg-blue-500 rounded-full'></span>
            )}
          </button>

          <a
            href='/categories/add'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors'
          >
            <span className='text-lg'>+</span>
            Nova Categoria
          </a>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className='border-t border-slate-200 pt-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            {/* Search Filter */}
            <div className='lg:col-span-2'>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Buscar
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <MagnifyingGlassIcon className='h-4 w-4 text-slate-400' />
                </div>
                <input
                  type='text'
                  placeholder='Buscar por nome ou descrição...'
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                  className='block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={e => handleFilterChange('type', e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Ordenar por
              </label>
              <select
                value={filters.sort}
                onChange={e => handleFilterChange('sort', e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Order Filter */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Ordem
              </label>
              <select
                value={filters.order}
                onChange={e => handleFilterChange('order', e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                {orderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className='flex justify-end'>
              <button
                onClick={clearFilters}
                className='inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors'
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
