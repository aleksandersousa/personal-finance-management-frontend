'use client';

import React, { useEffect, useState } from 'react';
import {
  SummaryCard,
  CategoryBreakdown,
  ConsolidatedForecastCard,
  TopBar,
} from '@/presentation/components';
import {
  MonthlySummaryModel,
  CashFlowForecastModel,
  CategoryBreakdownItemModel,
} from '@/domain/models';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
} from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/lib/utils';

export interface DashboardPageProps {
  summary: MonthlySummaryModel;
  forecast?: CashFlowForecastModel;
  currentMonth: string;
  currentForecastMonths: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  forecast,
  currentMonth,
  currentForecastMonths,
}) => {
  const categories: CategoryBreakdownItemModel[] =
    summary.categoryBreakdown || [];

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }

    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setIsCollapsed(savedState === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebarToggle', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleStorageChange);
    };
  }, []);

  return (
    <div className='relative w-full min-h-screen overflow-x-hidden'>
      <div className='fixed inset-0 bg-background-secondary -z-10' />

      <div className='pt-17 pb-20 lg:pb-8'>
        <div
          className={cn(
            'px-4 sm:px-6 lg:px-8 box-border transition-all duration-300',
            isCollapsed ? 'lg:pl-[7rem] lg:pr-8' : 'lg:pl-[20rem] lg:pr-8'
          )}
        >
          <TopBar
            currentMonth={currentMonth}
            currentForecastMonths={currentForecastMonths}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <SummaryCard
              title='Saldo'
              type='balance'
              value={summary.summary.balance}
              icon={<CurrencyDollarIcon className='w-6 h-6 text-neutral-0' />}
              comparison={{
                previousValue: 0,
                change:
                  summary.comparisonWithPrevious.percentageChanges.balance,
              }}
            />
            <SummaryCard
              title='Receitas'
              value={summary.summary.totalIncome}
              type='income'
              icon={<ArrowUpIcon className='w-6 h-6 text-neutral-0' />}
              comparison={{
                previousValue: 0,
                change: summary.comparisonWithPrevious.percentageChanges.income,
              }}
              details={{
                fixed: summary.summary.fixedIncome,
                variable: summary.summary.dynamicIncome,
                entriesCount: summary.summary.entriesCount.income,
              }}
            />
            <SummaryCard
              title='Despesas'
              value={summary.summary.totalExpenses}
              type='expense'
              icon={<ArrowDownIcon className='w-6 h-6 text-neutral-0' />}
              comparison={{
                previousValue: 0,
                change:
                  summary.comparisonWithPrevious.percentageChanges.expense,
              }}
              details={{
                fixed: summary.summary.fixedExpenses,
                variable: summary.summary.dynamicExpenses,
                entriesCount: summary.summary.entriesCount.expenses,
              }}
            />
          </div>

          {categories.length > 0 && (
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150'>
              <CategoryBreakdown
                categories={categories}
                type='INCOME'
                title='Receitas por Categoria'
              />

              <CategoryBreakdown
                categories={categories}
                type='EXPENSE'
                title='Despesas por Categoria'
              />
            </div>
          )}

          {forecast && (
            <div className='mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300'>
              <ConsolidatedForecastCard
                summary={forecast.summary}
                insights={forecast.insights}
                monthsCount={forecast.forecastPeriod.monthsCount}
                projections={forecast.monthlyProjections}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
