'use client';

import React, { useState } from 'react';
import {
  ForecastSummaryModel,
  ForecastInsightsModel,
  MonthlyProjectionModel,
} from '@/domain/models';
import {
  MinusIcon,
  CheckCircleIcon,
  WarningIcon,
  TrendDownIcon,
  TrendUpIcon,
  ChartLineIcon,
  LightbulbIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Card } from './card';

export interface ConsolidatedForecastCardProps {
  summary: ForecastSummaryModel;
  insights: ForecastInsightsModel;
  monthsCount: number;
  projections: MonthlyProjectionModel[];
}

export const ConsolidatedForecastCard: React.FC<
  ConsolidatedForecastCardProps
> = ({ summary, insights, monthsCount, projections }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'insights' | 'chart'>(
    'summary'
  );

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const getTrendIcon = (trend: 'positive' | 'negative' | 'stable') => {
    switch (trend) {
      case 'positive':
        return (
          <TrendUpIcon className='w-5 h-5 text-emerald-500' weight='bold' />
        );
      case 'negative':
        return <TrendDownIcon className='w-5 h-5 text-red-500' weight='bold' />;
      case 'stable':
        return <MinusIcon className='w-5 h-5 text-slate-700' weight='bold' />;
    }
  };

  const getTrendLabel = (trend: 'positive' | 'negative' | 'stable') => {
    switch (trend) {
      case 'positive':
        return 'Positiva';
      case 'negative':
        return 'Negativa';
      case 'stable':
        return 'Estável';
    }
  };

  const getTrendColor = (trend: 'positive' | 'negative' | 'stable') => {
    switch (trend) {
      case 'positive':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'stable':
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getRiskLabel = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'Baixo';
      case 'medium':
        return 'Médio';
      case 'high':
        return 'Alto';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'text-emerald-600 bg-emerald-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'high':
        return 'text-red-600 bg-red-50';
    }
  };

  return (
    <Card className='p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h3 className='text-lg font-bold text-slate-900'>
          Previsão Financeira ({monthsCount} meses)
        </h3>

        <div className='flex gap-1 bg-slate-100 rounded-lg p-1 justify-center lg:justify-normal'>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <ChartLineIcon className='w-4 h-4' />
            <span>Resumo</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <LightbulbIcon className='w-4 h-4' />
            <span>Insights</span>
          </button>
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-slate-50 rounded-lg p-4'>
              <p className='text-sm font-medium text-slate-600 mb-1'>
                Receita Total
              </p>
              <p className='text-xl font-bold text-emerald-500'>
                {formatCurrency(summary.totalProjectedIncome)}
              </p>
            </div>

            <div className='bg-slate-50 rounded-lg p-4'>
              <p className='text-sm font-medium text-slate-600 mb-1'>
                Despesas Totais
              </p>
              <p className='text-xl font-bold text-red-500'>
                {formatCurrency(summary.totalProjectedExpenses)}
              </p>
            </div>

            <div className='bg-slate-50 rounded-lg p-4'>
              <p className='text-sm font-medium text-slate-600 mb-1'>
                Fluxo Líquido
              </p>
              <p
                className={`text-xl font-bold ${
                  summary.totalNetFlow >= 0 ? 'text-slate-900' : 'text-red-500'
                }`}
              >
                {formatCurrency(summary.totalNetFlow)}
              </p>
            </div>

            <div className='bg-slate-50 rounded-lg p-4'>
              <p className='text-sm font-medium text-slate-600 mb-1'>
                Saldo Final
              </p>
              <p
                className={`text-xl font-bold ${
                  summary.finalBalance >= 0 ? 'text-slate-900' : 'text-red-500'
                }`}
              >
                {formatCurrency(summary.finalBalance)}
              </p>
            </div>
          </div>

          <div className='bg-slate-50 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium text-slate-700'>
                Fluxo Médio Mensal
              </p>
              <p
                className={`text-lg font-bold ${
                  summary.averageMonthlyFlow >= 0
                    ? 'text-slate-900'
                    : 'text-red-500'
                }`}
              >
                {formatCurrency(summary.averageMonthlyFlow)}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className='space-y-4'>
          {/* Trend and Risk */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div
              className={`rounded-lg border p-4 ${getTrendColor(insights.trend)}`}
            >
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium'>Tendência</span>
                {getTrendIcon(insights.trend)}
              </div>
              <p className='text-lg font-bold'>
                {getTrendLabel(insights.trend)}
              </p>
            </div>

            <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-slate-700'>
                  Nível de Risco
                </span>
                <WarningIcon className='w-5 h-5 text-slate-600' weight='bold' />
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
            <div className='bg-slate-50 rounded-lg p-4'>
              <h4 className='text-sm font-semibold text-slate-900 mb-3'>
                Recomendações
              </h4>
              <ul className='space-y-2'>
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className='flex items-start'>
                    <CheckCircleIcon
                      className='w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0'
                      weight='bold'
                    />
                    <span className='text-sm text-slate-700'>
                      {recommendation}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
