import React from 'react';
import {
  SummaryCard,
  CategoryBreakdown,
  ForecastInsights,
  ForecastSummaryCard,
  MonthlyProjectionsChart,
} from '@/presentation/components/ui';
import {
  MonthlySummaryModel,
  CashFlowForecastModel,
  CategoryBreakdownItemModel,
} from '@/domain/models';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  TrendUpIcon,
  TrendDownIcon,
  ClipboardTextIcon,
  TagIcon,
  ChartBarIcon,
  PlusIcon,
} from '@phosphor-icons/react/dist/ssr';

export interface DashboardPageProps {
  summary: MonthlySummaryModel;
  forecast?: CashFlowForecastModel;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  forecast,
}) => {
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
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
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Convert categoryBreakdown to legacy format if it exists
  const categories: CategoryBreakdownItemModel[] =
    summary.categoryBreakdown || [];

  return (
    <div className='min-h-screen bg-slate-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>
            Dashboard Financeiro
          </h1>
          <p className='text-slate-600'>
            Resumo completo de {formatMonth(summary.month)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
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
          />

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
        </div>

        {/* Detailed Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {/* Fixed Income */}
          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between mb-2'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Receitas Fixas
                </p>
                <p className='text-xl font-bold text-green-600'>
                  {(summary.summary.fixedIncome / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-green-50'>
                <CurrencyDollarIcon
                  className='w-6 h-6 text-green-600'
                  weight='bold'
                />
              </div>
            </div>
            <p className='text-xs text-slate-500'>
              {summary.summary.entriesCount.income} entrada(s)
            </p>
          </div>

          {/* Dynamic Income */}
          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between mb-2'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Receitas Variáveis
                </p>
                <p className='text-xl font-bold text-green-500'>
                  {(summary.summary.dynamicIncome / 100).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    }
                  )}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-green-50'>
                <TrendUpIcon className='w-6 h-6 text-green-500' weight='bold' />
              </div>
            </div>
          </div>

          {/* Fixed Expenses */}
          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between mb-2'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Despesas Fixas
                </p>
                <p className='text-xl font-bold text-red-600'>
                  {(summary.summary.fixedExpenses / 100).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    }
                  )}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-red-50'>
                <CurrencyDollarIcon
                  className='w-6 h-6 text-red-600'
                  weight='bold'
                />
              </div>
            </div>
            <p className='text-xs text-slate-500'>
              {summary.summary.entriesCount.expenses} entrada(s)
            </p>
          </div>

          {/* Dynamic Expenses */}
          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between mb-2'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Despesas Variáveis
                </p>
                <p className='text-xl font-bold text-red-500'>
                  {(summary.summary.dynamicExpenses / 100).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    }
                  )}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-red-50'>
                <TrendDownIcon className='w-6 h-6 text-red-500' weight='bold' />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Total de Entradas
                </p>
                <p className='text-2xl font-bold text-slate-900'>
                  {summary.summary.entriesCount.total}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-slate-100'>
                <ClipboardTextIcon
                  className='w-6 h-6 text-slate-600'
                  weight='bold'
                />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Categorias Ativas
                </p>
                <p className='text-2xl font-bold text-slate-900'>
                  {categories.length}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-slate-100'>
                <TagIcon className='w-6 h-6 text-slate-600' weight='bold' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Taxa de Economia
                </p>
                <p
                  className={`text-2xl font-bold ${
                    summary.summary.balance >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {summary.summary.totalIncome > 0
                    ? `${((summary.summary.balance / summary.summary.totalIncome) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-slate-100'>
                <TrendUpIcon className='w-6 h-6 text-slate-600' weight='bold' />
              </div>
            </div>
          </div>
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
          <>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-slate-900'>
                Previsão de Fluxo de Caixa
              </h2>
              <p className='text-slate-600 mt-1'>
                Projeção para os próximos {forecast.forecastPeriod.monthsCount}{' '}
                meses
              </p>
            </div>

            {/* Forecast Summary */}
            <div className='mb-8'>
              <ForecastSummaryCard
                summary={forecast.summary}
                monthsCount={forecast.forecastPeriod.monthsCount}
              />
            </div>

            {/* Insights and Projections */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
              <div className='lg:col-span-1'>
                <ForecastInsights insights={forecast.insights} />
              </div>

              <div className='lg:col-span-2'>
                <MonthlyProjectionsChart
                  projections={forecast.monthlyProjections}
                />
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className='bg-white rounded-xl border border-slate-200 p-6'>
          <h3 className='text-lg font-semibold text-slate-900 mb-4'>
            Ações Rápidas
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <a
              href='/entries/add'
              className='flex items-center justify-center px-4 py-3 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors'
            >
              <PlusIcon className='w-5 h-5 mr-2' weight='bold' />
              Nova Entrada
            </a>

            <a
              href='/entries'
              className='flex items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors'
            >
              <ClipboardTextIcon className='w-5 h-5 mr-2' weight='bold' />
              Ver Entradas
            </a>

            <a
              href='/categories'
              className='flex items-center justify-center px-4 py-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors'
            >
              <TagIcon className='w-5 h-5 mr-2' weight='bold' />
              Categorias
            </a>

            <a
              href='/reports'
              className='flex items-center justify-center px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors'
            >
              <ChartBarIcon className='w-5 h-5 mr-2' weight='bold' />
              Relatórios
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
