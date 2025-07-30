'use client';

import React, { useState, useCallback } from 'react';
import { CashFlowForecast, ForecastFilters } from '@/domain/models';
import {
  Chart,
  ChartDataPoint,
  ForecastControls,
} from '@/presentation/components/ui';

export interface ForecastClientWrapperProps {
  initialForecast: CashFlowForecast | null;
  userId: string;
  initialFilters: ForecastFilters;
}

// Mock data for demonstration
const createMockForecast = (filters: ForecastFilters): CashFlowForecast => {
  const months = [];
  const today = new Date();
  let cumulativeBalance = 250000; // R$ 2500.00 starting balance

  for (let i = 0; i < filters.period; i++) {
    const monthDate = new Date(
      today.getFullYear(),
      today.getMonth() + i + 1,
      1
    );
    const baseIncome = 400000; // R$ 4000.00
    const baseExpenses = 300000; // R$ 3000.00

    // Add some variation based on month
    const variation =
      Math.sin(i * 0.5) * 50000 + (Math.random() * 20000 - 10000);

    const projectedIncome =
      baseIncome + (filters.includeVariableProjections ? variation : 0);
    const projectedExpenses =
      baseExpenses + (filters.includeVariableProjections ? variation * 0.3 : 0);
    const projectedBalance = projectedIncome - projectedExpenses;
    cumulativeBalance += projectedBalance;

    months.push({
      month: monthDate,
      projectedIncome: Math.round(projectedIncome),
      projectedExpenses: Math.round(projectedExpenses),
      projectedBalance: Math.round(projectedBalance),
      cumulativeBalance: Math.round(cumulativeBalance),
      fixedIncomes: [
        {
          id: `income-${i}`,
          description: 'Salário',
          amount: 400000,
          type: 'INCOME' as const,
          categoryId: 'cat-salary',
          categoryName: 'Salário',
          isFixed: true as const,
        },
      ],
      fixedExpenses: [
        {
          id: `expense-${i}`,
          description: 'Aluguel',
          amount: 150000,
          type: 'EXPENSE' as const,
          categoryId: 'cat-rent',
          categoryName: 'Moradia',
          isFixed: true as const,
        },
      ],
      projectedVariableIncomes: filters.includeVariableProjections
        ? Math.round(variation > 0 ? variation : 0)
        : 0,
      projectedVariableExpenses: filters.includeVariableProjections
        ? Math.round(variation * 0.3 > 0 ? variation * 0.3 : 0)
        : 0,
      confidence: filters.confidenceThreshold,
    });
  }

  return {
    id: 'mock-forecast-' + Date.now(),
    userId: 'mock-user',
    forecastPeriod: filters.period,
    monthlyData: months,
    generatedAt: new Date(),
    basedOnDataUntil: new Date(),
  };
};

// Client-side API call function
const fetchForecast = async (
  userId: string,
  filters: ForecastFilters
): Promise<CashFlowForecast> => {
  const queryParams = new URLSearchParams({
    period: filters.period.toString(),
    includeVariableProjections: filters.includeVariableProjections.toString(),
    confidenceThreshold: filters.confidenceThreshold,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
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
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [, setSelectedPoint] = useState<ChartDataPoint | null>(null);

  const loadForecast = useCallback(
    async (newFilters: ForecastFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchForecast(userId, newFilters);
        setForecast(result);
        setFilters(newFilters);
        setIsUsingMockData(false);
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

  const loadMockData = useCallback((newFilters: ForecastFilters) => {
    setIsLoading(true);
    setError(null);

    // Simulate loading time
    setTimeout(() => {
      const mockForecast = createMockForecast(newFilters);
      setForecast(mockForecast);
      setFilters(newFilters);
      setIsUsingMockData(true);
      setIsLoading(false);
    }, 500);
  }, []);

  const handlePeriodChange = useCallback(
    (period: 3 | 6 | 12) => {
      const newFilters = { ...filters, period };
      if (isUsingMockData) {
        loadMockData(newFilters);
      } else {
        loadForecast(newFilters);
      }
    },
    [filters, loadForecast, loadMockData, isUsingMockData]
  );

  const handleIncludeVariableChange = useCallback(
    (includeVariableProjections: boolean) => {
      const newFilters = { ...filters, includeVariableProjections };
      if (isUsingMockData) {
        loadMockData(newFilters);
      } else {
        loadForecast(newFilters);
      }
    },
    [filters, loadForecast, loadMockData, isUsingMockData]
  );

  const handleConfidenceChange = useCallback(
    (confidenceThreshold: 'HIGH' | 'MEDIUM' | 'LOW') => {
      const newFilters = { ...filters, confidenceThreshold };
      if (isUsingMockData) {
        loadMockData(newFilters);
      } else {
        loadForecast(newFilters);
      }
    },
    [filters, loadForecast, loadMockData, isUsingMockData]
  );

  const handleRefresh = useCallback(() => {
    if (isUsingMockData) {
      loadMockData(filters);
    } else {
      loadForecast(filters);
    }
  }, [filters, loadForecast, loadMockData, isUsingMockData]);

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

  // Transform forecast data to chart data
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
      {/* Mock Data Banner */}
      {isUsingMockData && (
        <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-blue-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-blue-800'>
                📊 Exibindo dados de demonstração. Esta é uma prévia da
                funcionalidade de previsão de fluxo de caixa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
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

      {/* Error State */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg
                className='h-5 w-5 text-red-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3 flex-1'>
              <p className='text-sm text-red-800'>{error}</p>
              {error.includes('API não disponível') && (
                <div className='mt-3'>
                  <button
                    onClick={() => loadMockData(filters)}
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

      {/* Charts */}
      {forecast && (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
          {/* Cumulative Balance Chart */}
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

          {/* Monthly Balance Chart */}
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

      {/* Monthly Details */}
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

      {/* Empty State */}
      {!forecast && !isLoading && !error && (
        <div className='text-center py-12'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            Nenhuma previsão disponível
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Clique em &quot;Atualizar&quot; para gerar uma nova previsão.
          </p>
          <div className='mt-4'>
            <button
              onClick={() => loadMockData(filters)}
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
