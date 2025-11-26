'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import { loadEntriesMonthsYearsAction } from '@/presentation/actions';

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
  const [mounted, setMounted] = useState(false);
  const [monthOptions, setMonthOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isLoadingMonths, setIsLoadingMonths] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getDefaultMonth = () => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  };

  const getDefaultForecastMonths = () => 6;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

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
    handleCloseFilters();
  };

  const handleOpenFilters = () => {
    setIsOpen(true);
  };
  const handleCloseFilters = () => {
    setIsOpen(false);
  };

  const forecastOptions = generateForecastOptions();

  const isFiltered =
    selectedMonth !== getDefaultMonth() ||
    selectedForecastMonths !== getDefaultForecastMonths();

  if (isLoadingMonths) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Button
        onClick={handleOpenFilters}
        variant='ghost'
        size='sm'
        className='text-foreground'
      >
        <FunnelIcon className='w-5 h-5' weight='bold' />
        {isFiltered && (
          <span className='absolute top-5 right-9 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background animate-pulse' />
        )}
      </Button>

      {mounted &&
        createPortal(
          <>
            <div
              className={`fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-[100] transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={handleBackdropClick}
            />

            <div
              className={`fixed top-0 right-0 h-full bg-background shadow-2xl z-[110] transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
              } w-full sm:w-[23.75rem]`}
            >
              <div className='flex flex-col h-full'>
                <div className='flex items-center justify-between p-6 border-b border-border-foreground'>
                  <div className='flex items-center gap-3'>
                    <div>
                      <h2 className='text-xl text-foreground'>
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
                    onClick={handleCloseFilters}
                    className='h-10 w-10 rounded-xl text-foreground'
                  >
                    <XIcon className='w-5 h-5' />
                  </Button>
                </div>

                <div className='flex-1 overflow-y-auto p-6'>
                  <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-3'>
                      <label className='text-sm font-semibold text-foreground flex items-center gap-2'>
                        <div className='rounded-xl flex items-center justify-center'>
                          <CalendarIcon className='w-4 h-4 text-foreground' />
                        </div>
                        <span>Período</span>
                      </label>
                      <Select
                        value={selectedMonth}
                        onValueChange={handleMonthChange}
                      >
                        <SelectTrigger className='w-full rounded-xl transition-colors'>
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
                      <label className='text-sm font-semibold text-foreground flex items-center gap-2'>
                        <div className='rounded-xl flex items-center justify-center'>
                          <ChartLineIcon className='w-4 h-4 text-foreground' />
                        </div>
                        <span>Previsão</span>
                      </label>
                      <Select
                        value={selectedForecastMonths.toString()}
                        onValueChange={handleForecastMonthsChange}
                      >
                        <SelectTrigger className='w-full rounded-xl transition-colors'>
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
                          Você possui filtros ativos. Os dados exibidos estão
                          sendo filtrados de acordo com suas seleções.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className='border-t border-border-foreground p-6'>
                  <div className='flex gap-3'>
                    <Button
                      variant='outline'
                      onClick={handleResetFilters}
                      className='flex-1 h-12 rounded-xl border-border-foreground bg-transparent hover:bg-accent font-semibold text-foreground transition-all duration-250'
                    >
                      Resetar
                    </Button>
                    <Button
                      onClick={() => {
                        handleApplyFilters();
                        handleCloseFilters();
                      }}
                      variant='primary'
                      className='flex-1 h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};
