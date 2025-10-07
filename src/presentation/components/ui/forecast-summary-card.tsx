import React from 'react';
import { ForecastSummaryModel } from '@/domain/models';

export interface ForecastSummaryCardProps {
  summary: ForecastSummaryModel;
  monthsCount: number;
}

export const ForecastSummaryCard: React.FC<ForecastSummaryCardProps> = ({
  summary,
  monthsCount,
}) => {
  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  return (
    <div className='bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-6'>
      <h3 className='text-lg font-semibold text-slate-900 mb-4'>
        Resumo da Previsão ({monthsCount} meses)
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Left Column */}
        <div className='space-y-4'>
          <div>
            <p className='text-sm text-slate-600 mb-1'>
              Receita Total Prevista
            </p>
            <p className='text-2xl font-bold text-green-600'>
              {formatCurrency(summary.totalProjectedIncome)}
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-600 mb-1'>
              Despesas Totais Previstas
            </p>
            <p className='text-2xl font-bold text-red-600'>
              {formatCurrency(summary.totalProjectedExpenses)}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-4'>
          <div>
            <p className='text-sm text-slate-600 mb-1'>Fluxo Líquido Total</p>
            <p
              className={`text-2xl font-bold ${
                summary.totalNetFlow >= 0 ? 'text-cyan-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(summary.totalNetFlow)}
            </p>
          </div>

          <div>
            <p className='text-sm text-slate-600 mb-1'>Saldo Final Previsto</p>
            <p
              className={`text-2xl font-bold ${
                summary.finalBalance >= 0 ? 'text-cyan-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(summary.finalBalance)}
            </p>
          </div>
        </div>
      </div>

      {/* Average Monthly Flow */}
      <div className='mt-6 pt-4 border-t border-cyan-300'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium text-slate-700'>
            Fluxo Médio Mensal
          </p>
          <p
            className={`text-xl font-bold ${
              summary.averageMonthlyFlow >= 0 ? 'text-cyan-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(summary.averageMonthlyFlow)}
          </p>
        </div>
      </div>
    </div>
  );
};
