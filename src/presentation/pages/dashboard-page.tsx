import React from 'react';
import {
  SummaryCard,
  CategoryBreakdown,
  ConsolidatedForecastCard,
  InteractiveMonthlyProjectionsChart,
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

export interface DashboardPageProps {
  summary: MonthlySummaryModel;
  forecast?: CashFlowForecastModel;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  forecast,
}) => {
  const categories: CategoryBreakdownItemModel[] =
    summary.categoryBreakdown || [];

  return (
    <div className='bg-slate-50 pt-20 pb-20 lg:pb-8 w-full flex justify-center'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <SummaryCard
            title='Saldo'
            value={summary.summary.balance}
            type='balance'
            icon={
              <CurrencyDollarIcon
                className='w-6 h-6 text-cyan-600'
                weight='bold'
              />
            }
            comparison={{
              previousValue: 0,
              change: summary.comparisonWithPrevious.percentageChanges.balance,
            }}
          />
          <SummaryCard
            title='Receitas'
            value={summary.summary.totalIncome}
            type='income'
            icon={
              <ArrowUpIcon className='w-6 h-6 text-green-600' weight='bold' />
            }
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
            icon={
              <ArrowDownIcon className='w-6 h-6 text-red-600' weight='bold' />
            }
            comparison={{
              previousValue: 0,
              change: summary.comparisonWithPrevious.percentageChanges.expense,
            }}
            details={{
              fixed: summary.summary.fixedExpenses,
              variable: summary.summary.dynamicExpenses,
              entriesCount: summary.summary.entriesCount.expenses,
            }}
          />
        </div>

        {/* Category Breakdowns */}
        {categories.length > 0 && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
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

        {/* Forecast Section */}
        {forecast && (
          <div className='space-y-6 mb-8'>
            {/* Consolidated Forecast Card */}
            <ConsolidatedForecastCard
              summary={forecast.summary}
              insights={forecast.insights}
              monthsCount={forecast.forecastPeriod.monthsCount}
            />

            {/* Interactive Monthly Projections Chart */}
            <InteractiveMonthlyProjectionsChart
              projections={forecast.monthlyProjections}
            />
          </div>
        )}
      </div>
    </div>
  );
};
