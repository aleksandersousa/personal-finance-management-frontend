'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XIcon,
  PlusIcon,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Input } from './input';
import { Button } from './button';

interface EntriesFiltersProps {
  currentMonth: string;
  totalResults: number;
  showHeader?: boolean;
  hasActiveFilters?: boolean;
}

export const EntriesFilters: React.FC<EntriesFiltersProps> = ({
  currentMonth,
  totalResults,
  showHeader = true,
  hasActiveFilters: externalHasActiveFilters = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    month: searchParams.get('month') || currentMonth,
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    sort: searchParams.get('sort') || 'date',
    order: searchParams.get('order') || 'desc',
    search: searchParams.get('search') || '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const value = `${year}-${month}`;

      const monthNames = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ];

      const label = `${monthNames[date.getMonth()]} ${year}`;
      options.push({ value, label });
    }

    return options;
  };

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
      month: currentMonth,
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
    filters.month !== currentMonth ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.sort !== 'date' ||
    filters.order !== 'desc' ||
    filters.search !== '';

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
            className='flex-1 h-12 rounded-xl border-border-foreground bg-background hover:bg-accent font-semibold text-foreground transition-all duration-250'
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
            <Link href='/entries/add'>Adicionar Entrada</Link>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className='border-t border-border-foreground pt-4 mt-4 mx-4 md:mx-0'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Mês</label>
              <Select
                value={filters.month}
                onValueChange={value => handleFilterChange('month', value)}
              >
                <SelectTrigger className='w-full h-10 rounded-lg transition-colors'>
                  <SelectValue placeholder='Selecione o mês' />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map(option => (
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

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Tipo
              </label>
              <Select
                value={filters.type}
                onValueChange={value => handleFilterChange('type', value)}
              >
                <SelectTrigger className='w-full h-10 rounded-lg transition-colors'>
                  <SelectValue placeholder='Selecione o tipo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all' className='rounded-lg'>
                    Todos
                  </SelectItem>
                  <SelectItem value='INCOME' className='rounded-lg'>
                    Receitas
                  </SelectItem>
                  <SelectItem value='EXPENSE' className='rounded-lg'>
                    Despesas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Ordenar por
              </label>
              <Select
                value={filters.sort}
                onValueChange={value => handleFilterChange('sort', value)}
              >
                <SelectTrigger className='w-full h-10 rounded-lg transition-colors'>
                  <SelectValue placeholder='Selecione a ordenação' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='date' className='rounded-lg'>
                    Data
                  </SelectItem>
                  <SelectItem value='amount' className='rounded-lg'>
                    Valor
                  </SelectItem>
                  <SelectItem value='description' className='rounded-lg'>
                    Descrição
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>
                Ordem
              </label>
              <Select
                value={filters.order}
                onValueChange={value => handleFilterChange('order', value)}
              >
                <SelectTrigger className='w-full h-10 rounded-lg transition-colors'>
                  <SelectValue placeholder='Selecione a ordem' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='desc' className='rounded-lg'>
                    Decrescente
                  </SelectItem>
                  <SelectItem value='asc' className='rounded-lg'>
                    Crescente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              Buscar
            </label>
            <div className='relative'>
              <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 z-10' />
              <Input
                type='text'
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                placeholder='Descrição...'
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
