import React from 'react';
import { ForecastInsightsModel } from '@/domain/models';

export interface ForecastInsightsProps {
  insights: ForecastInsightsModel;
}

export const ForecastInsights: React.FC<ForecastInsightsProps> = ({
  insights,
}) => {
  const getTrendIcon = (trend: 'positive' | 'negative' | 'stable') => {
    switch (trend) {
      case 'positive':
        return (
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
              d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
            />
          </svg>
        );
      case 'negative':
        return (
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
              d='M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6'
            />
          </svg>
        );
      case 'stable':
        return (
          <svg
            className='w-6 h-6 text-blue-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 12h14'
            />
          </svg>
        );
    }
  };

  const getTrendLabel = (trend: 'positive' | 'negative' | 'stable') => {
    switch (trend) {
      case 'positive':
        return 'Tendência Positiva';
      case 'negative':
        return 'Tendência Negativa';
      case 'stable':
        return 'Tendência Estável';
    }
  };

  const getTrendColor = (trend: 'positive' | 'negative' | 'stable') => {
    switch (trend) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'stable':
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getRiskLabel = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'Risco Baixo';
      case 'medium':
        return 'Risco Médio';
      case 'high':
        return 'Risco Alto';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'text-green-700 bg-green-100';
      case 'medium':
        return 'text-amber-700 bg-amber-100';
      case 'high':
        return 'text-red-700 bg-red-100';
    }
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 p-6 space-y-6'>
      <div>
        <h3 className='text-lg font-semibold text-slate-900 mb-4'>
          Insights Financeiros
        </h3>
      </div>

      {/* Trend and Risk */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Trend */}
        <div
          className={`rounded-lg border p-4 ${getTrendColor(insights.trend)}`}
        >
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium'>Tendência</span>
            {getTrendIcon(insights.trend)}
          </div>
          <p className='text-lg font-bold'>{getTrendLabel(insights.trend)}</p>
        </div>

        {/* Risk Level */}
        <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-slate-700'>
              Nível de Risco
            </span>
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
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(insights.riskLevel)}`}
          >
            {getRiskLabel(insights.riskLevel)}
          </span>
        </div>
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div>
          <h4 className='text-sm font-semibold text-slate-900 mb-3'>
            Recomendações
          </h4>
          <ul className='space-y-2'>
            {insights.recommendations.map((recommendation, index) => (
              <li key={index} className='flex items-start'>
                <svg
                  className='w-5 h-5 text-cyan-600 mr-2 mt-0.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='text-sm text-slate-700'>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
