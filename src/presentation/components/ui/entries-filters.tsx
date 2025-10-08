'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';

interface EntriesFiltersProps {
  currentMonth: string;
  totalResults: number;
  showHeader?: boolean;
}

export const EntriesFilters: React.FC<EntriesFiltersProps> = ({
  currentMonth,
  totalResults,
  showHeader = true,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    sort: searchParams.get('sort') || 'date',
    order: searchParams.get('order') || 'desc',
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

    router.push(`/entries?${params.toString()}`);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: 'all',
      category: 'all',
      sort: 'date',
      order: 'desc',
      search: '',
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.sort !== 'date' ||
    filters.order !== 'desc' ||
    filters.search !== '';

  if (!showHeader) {
    return null;
  }

  return (
    <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
        <div>
          <h2 className='text-xl font-bold text-slate-900'>Entradas do mês</h2>
          <p className='text-sm text-slate-600'>
            {totalResults}{' '}
            {totalResults === 1 ? 'entrada encontrada' : 'entradas encontradas'}
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
            href='/entries/add'
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors'
          >
            <span className='text-lg'>+</span>
            Adicionar Entrada
          </a>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className='border-t border-slate-200 pt-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Search */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Buscar
              </label>
              <div className='relative'>
                <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
                <input
                  type='text'
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                  placeholder='Descrição...'
                  className='w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
                <option value='all'>Todos</option>
                <option value='INCOME'>Receitas</option>
                <option value='EXPENSE'>Despesas</option>
              </select>
            </div>

            {/* Sort Field */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Ordenar por
              </label>
              <select
                value={filters.sort}
                onChange={e => handleFilterChange('sort', e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='date'>Data</option>
                <option value='amount'>Valor</option>
                <option value='description'>Descrição</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Ordem
              </label>
              <select
                value={filters.order}
                onChange={e => handleFilterChange('order', e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='desc'>Decrescente</option>
                <option value='asc'>Crescente</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
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
