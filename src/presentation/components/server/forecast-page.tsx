import React from 'react';
import { LoadCashFlowForecast } from '@/domain/usecases';
import { ForecastFilters } from '@/domain/models';
import { ForecastClientWrapper } from '../client/forecast-client-wrapper';

export interface ForecastPageProps {
  loadCashFlowForecast: LoadCashFlowForecast;
  userId: string;
  initialFilters?: ForecastFilters;
}

export const ForecastPage: React.FC<ForecastPageProps> = async ({
  loadCashFlowForecast,
  userId,
  initialFilters = {
    period: 6,
    includeVariableProjections: true,
    confidenceThreshold: 'MEDIUM',
  },
}) => {
  // Skip server-side data loading in development to avoid API dependency
  const isProduction = process.env.NODE_ENV === 'production';
  let initialForecast = null;

  if (isProduction) {
    try {
      // Only load data on server in production
      initialForecast = await loadCashFlowForecast.load({
        userId,
        filters: initialFilters,
      });
    } catch (error) {
      console.error('Error loading cash flow forecast:', error);
      // Continue with null data, will be loaded on client
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Previsão de Fluxo de Caixa
          </h1>
          <p className='mt-2 text-gray-600'>
            Visualize suas projeções financeiras baseadas em entradas fixas e
            histórico de gastos
          </p>
        </div>

        {/* Forecast Content - Only pass serializable data */}
        <ForecastClientWrapper
          initialForecast={initialForecast}
          userId={userId}
          initialFilters={initialFilters}
        />
      </div>
    </div>
  );
};
