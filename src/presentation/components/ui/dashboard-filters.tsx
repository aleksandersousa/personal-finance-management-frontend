'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarIcon,
  ChartLineIcon,
  FunnelIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export interface DashboardFiltersProps {
  currentMonth: string;
  currentForecastMonths: number;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  currentMonth,
  currentForecastMonths,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedForecastMonths, setSelectedForecastMonths] = useState(
    currentForecastMonths
  );
  const [isOpen, setIsOpen] = useState(false);

  const getDefaultMonth = () => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  };

  const getDefaultForecastMonths = () => 6;

  const isFiltered =
    selectedMonth !== getDefaultMonth() ||
    selectedForecastMonths !== getDefaultForecastMonths();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 12; i >= 1; i--) {
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

    const currentYear = currentDate.getFullYear();
    const currentMonthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentValue = `${currentYear}-${currentMonthNum}`;
    const currentLabel = currentDate.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
    });
    options.push({ value: currentValue, label: currentLabel });

    for (let i = 1; i <= 3; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
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

  const generateForecastOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map(months => ({
      value: months.toString(),
      label: `${months} ${months === 1 ? 'mês' : 'meses'}`,
    }));
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const handleForecastMonthsChange = (value: string) => {
    setSelectedForecastMonths(parseInt(value, 10));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedMonth !== currentMonth) {
      params.set('month', selectedMonth);
    } else {
      params.delete('month');
    }

    if (selectedForecastMonths !== currentForecastMonths) {
      params.set('forecastMonths', selectedForecastMonths.toString());
    } else {
      params.delete('forecastMonths');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    router.push(`/dashboard${newUrl}`);
  };

  const handleResetFilters = () => {
    const currentDate = new Date();
    const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const defaultForecastMonths = 6;

    setSelectedMonth(defaultMonth);
    setSelectedForecastMonths(defaultForecastMonths);

    router.push('/dashboard');
  };

  const monthOptions = generateMonthOptions();
  const forecastOptions = generateForecastOptions();

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant='ghost'
        size='sm'
        className='relative py-3 px-2 rounded-xl bg-primary text-white font-semibold shadow-md hover:shadow-lg transition-all duration-250 hover:-translate-y-0.5'
      >
        <FunnelIcon className='w-5 h-5' weight='bold' />
        {isFiltered && (
          <span className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse'></span>
        )}
      </Button>

      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300'
          style={{ animation: 'fadeIn 300ms ease-out' }}
          onClick={handleBackdropClick}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-[23.75rem]`}
      >
        <div className='flex flex-col h-full'>
          <div className='flex items-center justify-between p-6 border-b border-slate-200'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center'>
                <FunnelIcon className='w-5 h-5 text-white' weight='bold' />
              </div>
              <div>
                <h2 className='text-xl font-bold text-slate-900'>
                  Filtros do Dashboard
                </h2>
                {isFiltered && (
                  <p className='text-xs text-emerald-600 font-semibold mt-0.5'>
                    Filtros ativos
                  </p>
                )}
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
              className='h-10 w-10 rounded-xl hover:bg-gray-900'
            >
              <XIcon className='w-5 h-5' weight='bold' />
            </Button>
          </div>

          <div className='flex-1 overflow-y-auto p-6'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-3'>
                <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center'>
                    <CalendarIcon
                      className='w-4 h-4 text-slate-600'
                      weight='bold'
                    />
                  </div>
                  <span>Período</span>
                </label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger className='w-full h-12 rounded-xl border-slate-200 bg-slate-50 hover:bg-white transition-colors focus:ring-2 focus:ring-slate-900 focus:ring-offset-0'>
                    <SelectValue placeholder='Selecione o mês' />
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

              <div className='flex flex-col gap-3'>
                <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center'>
                    <ChartLineIcon
                      className='w-4 h-4 text-slate-600'
                      weight='bold'
                    />
                  </div>
                  <span>Previsão</span>
                </label>
                <Select
                  value={selectedForecastMonths.toString()}
                  onValueChange={handleForecastMonthsChange}
                >
                  <SelectTrigger className='w-full h-12 rounded-xl border-slate-200 bg-slate-50 hover:bg-white transition-colors focus:ring-2 focus:ring-slate-900 focus:ring-offset-0'>
                    <SelectValue placeholder='Meses para previsão' />
                  </SelectTrigger>
                  <SelectContent>
                    {forecastOptions.map(option => (
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

              {isFiltered && (
                <div className='bg-emerald-50 border border-emerald-200 rounded-xl p-4'>
                  <p className='text-sm text-emerald-800 font-medium'>
                    Você possui filtros ativos. Os dados exibidos estão sendo
                    filtrados de acordo com suas seleções.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className='border-t border-slate-200 p-6'>
            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={handleResetFilters}
                className='flex-1 h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 transition-all duration-250'
              >
                Resetar
              </Button>
              <Button
                onClick={() => {
                  handleApplyFilters();
                  setIsOpen(false);
                }}
                className='flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold shadow-md hover:shadow-lg transition-all duration-250'
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
