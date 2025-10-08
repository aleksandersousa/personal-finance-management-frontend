'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarIcon, ChartLineIcon } from '@phosphor-icons/react/dist/ssr';
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

  // Gerar opções de meses (últimos 12 meses + próximos 3 meses)
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    // Últimos 12 meses
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

    // Mês atual
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentValue = `${currentYear}-${currentMonthNum}`;
    const currentLabel = currentDate.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
    });
    options.push({ value: currentValue, label: currentLabel });

    // Próximos 3 meses
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

  // Gerar opções de meses para previsão
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
    <div className='bg-white rounded-xl border border-slate-200 p-6 mb-8'>
      <div className='flex flex-col sm:flex-row sm:items-end gap-4'>
        <div className='flex flex-col sm:flex-row gap-4 flex-1'>
          {/* Filtro de Mês */}
          <div className='flex flex-col gap-2 min-w-0 sm:min-w-[200px]'>
            <label className='text-sm font-medium text-slate-700 flex items-center gap-2'>
              <CalendarIcon className='w-4 h-4' />
              Período
            </label>
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecione o mês' />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Meses para Previsão */}
          <div className='flex flex-col gap-2 min-w-0 sm:min-w-[180px]'>
            <label className='text-sm font-medium text-slate-700 flex items-center gap-2'>
              <ChartLineIcon className='w-4 h-4' />
              Previsão
            </label>
            <Select
              value={selectedForecastMonths.toString()}
              onValueChange={handleForecastMonthsChange}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Meses para previsão' />
              </SelectTrigger>
              <SelectContent>
                {forecastOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className='flex justify-end gap-2'>
          <Button
            variant='outline'
            onClick={handleResetFilters}
            className='whitespace-nowrap'
          >
            Resetar
          </Button>
          <Button onClick={handleApplyFilters} className='whitespace-nowrap'>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};
