'use client';

import React, { useState, useCallback } from 'react';
import {
  Chart,
  ChartDataPoint,
  ForecastControls,
} from '@/presentation/components/ui';
import { XCircleIcon, ChartBarIcon } from '@phosphor-icons/react/dist/ssr';

export interface ForecastFilters {
  period: 3 | 6 | 12;
  includeVariableProjections: boolean;
  confidenceThreshold: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CashFlowForecast {
  id: string;
  userId: string;
  forecastPeriod: number;
  monthlyData: MonthlyForecastData[];
  generatedAt: Date;
  basedOnDataUntil: Date;
}

export interface MonthlyForecastData {
  month: Date;
  projectedIncome: number;
  projectedExpenses: number;
  projectedBalance: number;
  cumulativeBalance: number;
  fixedIncomes: ForecastEntry[];
  fixedExpenses: ForecastEntry[];
  projectedVariableIncomes: number;
  projectedVariableExpenses: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ForecastEntry {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  categoryName: string;
  isFixed: true;
}

export interface ForecastClientWrapperProps {
  initialForecast: CashFlowForecast | null;
  userId: string;
  initialFilters: ForecastFilters;
}

const fetchForecast = async (
  userId: string,
  filters: ForecastFilters
): Promise<CashFlowForecast> => {
  const queryParams = new URLSearchParams({
    period: filters.period.toString(),
    includeVariableProjections: filters.includeVariableProjections.toString(),
    confidenceThreshold: filters.confidenceThreshold,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const response = await fetch(
    `${apiUrl}/users/${userId}/cash-flow-forecast?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    userId: data.userId,
    forecastPeriod: data.forecastPeriod,
    monthlyData: data.monthlyData.map((monthly: unknown) => {
      const m = monthly as Record<string, unknown>;
      return {
        month: new Date(m.month as string),
        projectedIncome: m.projectedIncome as number,
        projectedExpenses: m.projectedExpenses as number,
        projectedBalance: m.projectedBalance as number,
        cumulativeBalance: m.cumulativeBalance as number,
        fixedIncomes: m.fixedIncomes as Array<Record<string, unknown>>,
        fixedExpenses: m.fixedExpenses as Array<Record<string, unknown>>,
        projectedVariableIncomes: m.projectedVariableIncomes as number,
        projectedVariableExpenses: m.projectedVariableExpenses as number,
        confidence: m.confidence as 'HIGH' | 'MEDIUM' | 'LOW',
      };
    }),
    generatedAt: new Date(data.generatedAt),
    basedOnDataUntil: new Date(data.basedOnDataUntil),
  };
};

export const ForecastClientWrapper: React.FC<ForecastClientWrapperProps> = ({
  initialForecast,
  userId,
  initialFilters,
}) => {
  const [forecast, setForecast] = useState<CashFlowForecast | null>(
    initialForecast
  );
  const [filters, setFilters] = useState<ForecastFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedPoint] = useState<ChartDataPoint | null>(null);

  const loadForecast = useCallback(
    async (newFilters: ForecastFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchForecast(userId, newFilters);
        setForecast(result);
        setFilters(newFilters);
      } catch (err) {
        console.error('Error loading forecast:', err);
        // Check if it's a network/API error
        const errorMessage =
          err instanceof Error && err.message.includes('404')
            ? 'API não disponível. Esta é uma demonstração da interface - os dados serão carregados quando a API estiver rodando.'
            : 'Erro ao carregar previsão. Tente novamente.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const handlePeriodChange = useCallback(
    (period: 3 | 6 | 12) => {
      const newFilters = { ...filters, period };
      loadForecast(newFilters);
    },
    [filters, loadForecast]
  );

  const handleIncludeVariableChange = useCallback(
    (includeVariableProjections: boolean) => {
      const newFilters = { ...filters, includeVariableProjections };
      loadForecast(newFilters);
    },
    [filters, loadForecast]
  );

  const handleConfidenceChange = useCallback(
    (confidenceThreshold: 'HIGH' | 'MEDIUM' | 'LOW') => {
      const newFilters = { ...filters, confidenceThreshold };
      loadForecast(newFilters);
    },
    [filters, loadForecast]
  );

  const handleRefresh = useCallback(() => {
    loadForecast(filters);
  }, [filters, loadForecast]);

  const formatCurrency = (value: number): string => {
    return `R$ ${(value / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric',
    });
  };

  const chartData: ChartDataPoint[] =
    forecast?.monthlyData.map(monthly => ({
      label: formatDate(monthly.month),
      value: monthly.cumulativeBalance,
      date: monthly.month,
      metadata: {
        Receitas: formatCurrency(monthly.projectedIncome),
        Despesas: formatCurrency(monthly.projectedExpenses),
        'Saldo do Mês': formatCurrency(monthly.projectedBalance),
        Confiança:
          monthly.confidence === 'HIGH'
            ? 'Alta'
            : monthly.confidence === 'MEDIUM'
              ? 'Média'
              : 'Baixa',
      },
    })) || [];

  const balanceChartData: ChartDataPoint[] =
    forecast?.monthlyData.map(monthly => ({
      label: formatDate(monthly.month),
      value: monthly.projectedBalance,
      date: monthly.month,
      metadata: {
        Receitas: formatCurrency(monthly.projectedIncome),
        Despesas: formatCurrency(monthly.projectedExpenses),
      },
    })) || [];

  return (
    <div className='space-y-6'>
      <ForecastControls
        period={filters.period}
        includeVariableProjections={filters.includeVariableProjections}
        confidenceThreshold={filters.confidenceThreshold}
        onPeriodChange={handlePeriodChange}
        onIncludeVariableChange={handleIncludeVariableChange}
        onConfidenceChange={handleConfidenceChange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <XCircleIcon className='h-5 w-5 text-red-400' weight='fill' />
            </div>
            <div className='ml-3 flex-1'>
              <p className='text-sm text-red-800'>{error}</p>
              {error.includes('API não disponível') && (
                <div className='mt-3'>
                  <button
                    onClick={() => loadForecast(filters)}
                    className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  >
                    📊 Ver demonstração com dados de exemplo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {forecast && (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
            <Chart
              data={chartData}
              title='Saldo acumulado'
              height={400}
              onPointHover={setSelectedPoint}
              formatValue={formatCurrency}
              color='#059669'
            />
          </div>

          <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
            <Chart
              data={balanceChartData}
              title='Saldo mensal'
              height={400}
              formatValue={formatCurrency}
              color='#2563EB'
            />
          </div>
        </div>
      )}

      {forecast && (
        <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-medium text-gray-900'>
              Detalhes mensais
            </h3>
            <p className='text-sm text-gray-500'>
              Previsão gerada em{' '}
              {forecast.generatedAt.toLocaleDateString('pt-BR')}
              baseada em dados até{' '}
              {forecast.basedOnDataUntil.toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Mês
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Receitas
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Despesas
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Saldo
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Acumulado
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Confiança
                  </th>
                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-gray-200'>
                {forecast.monthlyData.map((monthly, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {formatDate(monthly.month)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-green-600'>
                      {formatCurrency(monthly.projectedIncome)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-red-600'>
                      {formatCurrency(monthly.projectedExpenses)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        monthly.projectedBalance >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(monthly.projectedBalance)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        monthly.cumulativeBalance >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(monthly.cumulativeBalance)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          monthly.confidence === 'HIGH'
                            ? 'bg-green-100 text-green-800'
                            : monthly.confidence === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {monthly.confidence === 'HIGH'
                          ? 'Alta'
                          : monthly.confidence === 'MEDIUM'
                            ? 'Média'
                            : 'Baixa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!forecast && !isLoading && !error && (
        <div className='text-center py-12'>
          <ChartBarIcon
            className='mx-auto h-12 w-12 text-gray-400'
            weight='thin'
          />
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            Nenhuma previsão disponível
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Clique em &quot;Atualizar&quot; para gerar uma nova previsão.
          </p>
          <div className='mt-4'>
            <button
              onClick={() => handleRefresh()}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              📊 Ver demonstração
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
