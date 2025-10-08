'use client';

import React, { useState } from 'react';
import { ForecastSummaryModel, ForecastInsightsModel } from '@/domain/models';
import {
  MinusIcon,
  CheckCircleIcon,
  WarningIcon,
  TrendDownIcon,
  TrendUpIcon,
  ChartLineIcon,
  LightbulbIcon,
} from '@phosphor-icons/react/dist/ssr';

export interface ConsolidatedForecastCardProps {
  summary: ForecastSummaryModel;
  insights: ForecastInsightsModel;
  monthsCount: number;
}

export const ConsolidatedForecastCard: React.FC<
  ConsolidatedForecastCardProps
> = ({ summary, insights, monthsCount }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'insights'>('summary');

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const getTrendIcon = (trend: 'positive' | 'negative' | 'stable') => {
    switch (trend) {
      case 'positive':
        return <TrendUpIcon className='w-5 h-5 text-green-600' weight='bold' />;
      case 'negative':
        return <TrendDownIcon className='w-5 h-5 text-red-600' weight='bold' />;
      case 'stable':
        return <MinusIcon className='w-5 h-5 text-blue-600' weight='bold' />;
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
        return 'text-green-700 bg-green-100';
      case 'medium':
        return 'text-amber-700 bg-amber-100';
      case 'high':
        return 'text-red-700 bg-red-100';
    }
  };

  return (
    <div className='bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-6'>
      {/* Header with Tabs */}
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-slate-900'>
          Previsão Financeira ({monthsCount} meses)
        </h3>

        <div className='flex space-x-1 bg-white/50 rounded-lg p-1'>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-cyan-100 text-cyan-700'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <ChartLineIcon className='w-4 h-4' />
            <span>Resumo</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-cyan-100 text-cyan-700'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <LightbulbIcon className='w-4 h-4' />
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className='space-y-6'>
          {/* Main Metrics Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-white/70 rounded-lg p-4'>
              <p className='text-sm text-slate-600 mb-1'>Receita Total</p>
              <p className='text-xl font-bold text-green-600'>
                {formatCurrency(summary.totalProjectedIncome)}
              </p>
            </div>

            <div className='bg-white/70 rounded-lg p-4'>
              <p className='text-sm text-slate-600 mb-1'>Despesas Totais</p>
              <p className='text-xl font-bold text-red-600'>
                {formatCurrency(summary.totalProjectedExpenses)}
              </p>
            </div>

            <div className='bg-white/70 rounded-lg p-4'>
              <p className='text-sm text-slate-600 mb-1'>Fluxo Líquido</p>
              <p
                className={`text-xl font-bold ${
                  summary.totalNetFlow >= 0 ? 'text-cyan-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(summary.totalNetFlow)}
              </p>
            </div>

            <div className='bg-white/70 rounded-lg p-4'>
              <p className='text-sm text-slate-600 mb-1'>Saldo Final</p>
              <p
                className={`text-xl font-bold ${
                  summary.finalBalance >= 0 ? 'text-cyan-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(summary.finalBalance)}
              </p>
            </div>
          </div>

          {/* Average Monthly Flow */}
          <div className='bg-white/70 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium text-slate-700'>
                Fluxo Médio Mensal
              </p>
              <p
                className={`text-lg font-bold ${
                  summary.averageMonthlyFlow >= 0
                    ? 'text-cyan-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(summary.averageMonthlyFlow)}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className='space-y-6'>
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

            <div className='rounded-lg border border-slate-200 bg-white/70 p-4'>
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
            <div className='bg-white/70 rounded-lg p-4'>
              <h4 className='text-sm font-semibold text-slate-900 mb-3'>
                Recomendações
              </h4>
              <ul className='space-y-2'>
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className='flex items-start'>
                    <CheckCircleIcon
                      className='w-4 h-4 text-cyan-600 mr-2 mt-0.5 flex-shrink-0'
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
    </div>
  );
};
