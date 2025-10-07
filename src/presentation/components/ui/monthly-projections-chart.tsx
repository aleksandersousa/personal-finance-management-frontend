import React from 'react';
import { MonthlyProjectionModel } from '@/domain/models';

export interface MonthlyProjectionsChartProps {
  projections: MonthlyProjectionModel[];
}

export const MonthlyProjectionsChart: React.FC<
  MonthlyProjectionsChartProps
> = ({ projections }) => {
  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
  };

  const getConfidenceBadge = (confidence: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-green-100 text-green-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-red-100 text-red-700',
    };
    const labels = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[confidence]}`}
      >
        {labels[confidence]}
      </span>
    );
  };

  // Find max value for scaling
  const maxValue = Math.max(
    ...projections.map(p =>
      Math.max(
        Math.abs(p.projectedIncome),
        Math.abs(p.projectedExpenses),
        Math.abs(p.cumulativeBalance)
      )
    )
  );

  return (
    <div className='bg-white rounded-xl border border-slate-200 p-6'>
      <h3 className='text-lg font-semibold text-slate-900 mb-6'>
        Projeções Mensais
      </h3>

      {/* Table View */}
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-slate-200'>
              <th className='text-left py-3 px-2 font-semibold text-slate-700'>
                Mês
              </th>
              <th className='text-right py-3 px-2 font-semibold text-slate-700'>
                Receitas
              </th>
              <th className='text-right py-3 px-2 font-semibold text-slate-700'>
                Despesas
              </th>
              <th className='text-right py-3 px-2 font-semibold text-slate-700'>
                Fluxo Líquido
              </th>
              <th className='text-right py-3 px-2 font-semibold text-slate-700'>
                Saldo Acumulado
              </th>
              <th className='text-center py-3 px-2 font-semibold text-slate-700'>
                Confiança
              </th>
            </tr>
          </thead>
          <tbody>
            {projections.map((projection, index) => (
              <tr
                key={projection.month}
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                <td className='py-3 px-2 font-medium text-slate-900'>
                  {formatMonth(projection.month)}
                </td>
                <td className='py-3 px-2 text-right text-green-600 font-medium'>
                  {formatCurrency(projection.projectedIncome)}
                </td>
                <td className='py-3 px-2 text-right text-red-600 font-medium'>
                  {formatCurrency(projection.projectedExpenses)}
                </td>
                <td
                  className={`py-3 px-2 text-right font-semibold ${
                    projection.netFlow >= 0 ? 'text-cyan-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(projection.netFlow)}
                </td>
                <td
                  className={`py-3 px-2 text-right font-semibold ${
                    projection.cumulativeBalance >= 0
                      ? 'text-cyan-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatCurrency(projection.cumulativeBalance)}
                </td>
                <td className='py-3 px-2 text-center'>
                  {getConfidenceBadge(projection.confidence)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Bar Chart */}
      <div className='mt-8 space-y-4'>
        <h4 className='text-sm font-semibold text-slate-700'>
          Visualização do Saldo Acumulado
        </h4>
        <div className='space-y-3'>
          {projections.map(projection => {
            const percentage =
              (Math.abs(projection.cumulativeBalance) / maxValue) * 100;
            const isPositive = projection.cumulativeBalance >= 0;

            return (
              <div key={projection.month}>
                <div className='flex items-center justify-between text-xs mb-1'>
                  <span className='font-medium text-slate-700'>
                    {formatMonth(projection.month)}
                  </span>
                  <span
                    className={`font-semibold ${
                      isPositive ? 'text-cyan-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(projection.cumulativeBalance)}
                  </span>
                </div>
                <div className='w-full bg-slate-100 rounded-full h-3 overflow-hidden'>
                  <div
                    className={`h-full rounded-full transition-all ${
                      isPositive
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600'
                        : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
