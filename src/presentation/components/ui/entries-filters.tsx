'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { loadEntriesMonthsYearsAction } from '@/presentation/actions';

interface EntriesFiltersProps {
  currentMonth: string;
  showHeader?: boolean;
  hasActiveFilters?: boolean;
}

export const EntriesFilters: React.FC<EntriesFiltersProps> = ({
  currentMonth,
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
    isPaid: searchParams.get('isPaid') || 'all',
  });

  const [showFilters, setShowFilters] = useState(false);
  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [monthOptions, setMonthOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoadingMonths, setIsLoadingMonths] = useState(true);

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
      const label = date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
      });
      options.push({ value, label });
    }

    return options;
  };

  useEffect(() => {
    const fetchMonthsYears = async () => {
      try {
        setIsLoadingMonths(true);
        const result = await loadEntriesMonthsYearsAction();

        if (result.monthsYears && result.monthsYears.length > 0) {
          const options = result.monthsYears.map(({ year, month }) => {
            const date = new Date(year, month - 1, 1);
            const value = `${year}-${String(month).padStart(2, '0')}`;
            const label = date.toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
            });
            return { value, label };
          });

          setMonthOptions(options);
        } else {
          setMonthOptions(generateMonthOptions());
        }
      } catch (error) {
        console.error('Error loading months/years:', error);
        setMonthOptions(generateMonthOptions());
      } finally {
        setIsLoadingMonths(false);
      }
    };

    fetchMonthsYears();
  }, []);

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
      isPaid: 'all',
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
    filters.search !== '' ||
    filters.isPaid !== 'all';

  const shouldShowHeader = showHeader || externalHasActiveFilters;

  if (!shouldShowHeader) {
    return null;
  }

  return (
    <div className='mb-6'>
      {/* Always visible controls: Month selector + Action buttons */}
      <div className='flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center justify-between mr-4 ml-4 md:ml-0 md:mr-0'>
        {/* Month selector - Always visible */}
        <div className='w-full sm:w-auto sm:min-w-[200px]'>
          <label className='block text-sm font-medium mb-2 text-foreground'>
            Período
          </label>
          <Select
            value={filters.month}
            onValueChange={value => handleFilterChange('month', value)}
            disabled={isLoadingMonths}
          >
            <SelectTrigger className='w-full h-12 rounded-xl transition-colors'>
              <SelectValue
                placeholder={
                  isLoadingMonths ? 'Carregando...' : 'Selecione o mês'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
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

        {/* Action buttons */}
        <div className='flex gap-2 w-full sm:w-auto'>
          <Button
            variant='outline'
            onClick={() => setShowFilters(!showFilters)}
            className='flex-1 sm:flex-initial h-12 rounded-xl'
          >
            <FunnelIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            <span className='inline'>Filtros</span>
            {hasActiveFilters && (
              <span className='absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0 inline-flex items-center justify-center w-2 h-2 bg-primary rounded-full' />
            )}
          </Button>

          <Button
            variant='primary'
            className='flex-1 sm:flex-initial h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
          >
            <PlusIcon className='w-5 h-5 sm:w-4 sm:h-4' />
            <Link href='/entries/add'>Adicionar Entrada</Link>
          </Button>
        </div>
      </div>

      {/* Collapsible filter section */}
      {showFilters && (
        <div className='border-t border-border-foreground pt-4 mt-4 mx-4 md:mx-0'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            <div>
              <label className='block text-sm text-slate-700 mb-1'>Tipo</label>
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

            {filters.type === 'EXPENSE' && (
              <div>
                <label className='block text-sm text-slate-700 mb-1'>
                  Status de Pagamento
                </label>
                <Select
                  value={filters.isPaid}
                  onValueChange={value => handleFilterChange('isPaid', value)}
                >
                  <SelectTrigger className='w-full h-10 rounded-lg transition-colors'>
                    <SelectValue placeholder='Selecione o status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all' className='rounded-lg'>
                      Todas
                    </SelectItem>
                    <SelectItem value='true' className='rounded-lg'>
                      Pagas
                    </SelectItem>
                    <SelectItem value='false' className='rounded-lg'>
                      Não Pagas
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className='block text-sm text-slate-700 mb-1'>
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
              <label className='block text-sm text-slate-700 mb-1'>Ordem</label>
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
            <label className='block text-sm text-slate-700 mb-1'>Buscar</label>
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
                className='inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors'
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
