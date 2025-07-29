import React from 'react';
import { SummaryCard, CategoryBreakdown } from '@/presentation/components/ui';
import { MonthlySummaryModel } from '@/domain/models/monthly-summary';

export interface DashboardPageProps {
  summary: MonthlySummaryModel;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ summary }) => {
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

  // Ícones para os cartões
  const incomeIcon = (
    <svg
      className='w-6 h-6 text-green-600'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M7 11l5-5m0 0l5 5m-5-5v12'
      />
    </svg>
  );

  const expenseIcon = (
    <svg
      className='w-6 h-6 text-red-600'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M17 13l-5 5m0 0l-5-5m5 5V6'
      />
    </svg>
  );

  const balanceIcon = (
    <svg
      className='w-6 h-6 text-cyan-600'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
      />
    </svg>
  );

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
            value={summary.totalIncome}
            type='income'
            icon={incomeIcon}
            comparison={
              summary.comparison
                ? {
                    previousValue: 0, // Não usado no cálculo visual
                    change: summary.comparison.incomeChange,
                  }
                : undefined
            }
          />

          <SummaryCard
            title='Despesas'
            value={summary.totalExpenses}
            type='expense'
            icon={expenseIcon}
            comparison={
              summary.comparison
                ? {
                    previousValue: 0, // Não usado no cálculo visual
                    change: summary.comparison.expenseChange,
                  }
                : undefined
            }
          />

          <SummaryCard
            title='Saldo'
            value={summary.balance}
            type='balance'
            icon={balanceIcon}
            comparison={
              summary.comparison
                ? {
                    previousValue: 0, // Não usado no cálculo visual
                    change: summary.comparison.balanceChange,
                  }
                : undefined
            }
          />
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-xl border border-slate-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-slate-700'>
                  Total de Entradas
                </p>
                <p className='text-2xl font-bold text-slate-900'>
                  {summary.entriesCount}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-slate-100'>
                <svg
                  className='w-6 h-6 text-slate-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
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
                  {summary.categories.length}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-slate-100'>
                <svg
                  className='w-6 h-6 text-slate-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                  />
                </svg>
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
                    summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {summary.totalIncome > 0
                    ? `${((summary.balance / summary.totalIncome) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
              <div className='p-3 rounded-lg bg-slate-100'>
                <svg
                  className='w-6 h-6 text-slate-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdowns */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <CategoryBreakdown
            categories={summary.categories}
            type='INCOME'
            title='Receitas por Categoria'
          />

          <CategoryBreakdown
            categories={summary.categories}
            type='EXPENSE'
            title='Despesas por Categoria'
          />
        </div>

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
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
              Nova Entrada
            </a>

            <a
              href='/entries'
              className='flex items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
              </svg>
              Ver Entradas
            </a>

            <a
              href='/categories'
              className='flex items-center justify-center px-4 py-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                />
              </svg>
              Categorias
            </a>

            <a
              href='/reports'
              className='flex items-center justify-center px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
              Relatórios
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
