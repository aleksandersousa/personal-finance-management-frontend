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
        return <TrendUpIcon className='w-5 h-5 text-income' weight='bold' />;
      case 'negative':
        return <TrendDownIcon className='w-5 h-5 text-expense' weight='bold' />;
      case 'stable':
        return (
          <MinusIcon className='w-5 h-5 text-muted-foreground' weight='bold' />
        );
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
        return 'text-income bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
      case 'negative':
        return 'text-expense bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case 'stable':
        return 'text-muted-foreground bg-muted border-border';
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
        return 'text-income bg-emerald-50 dark:bg-emerald-500/10';
      case 'medium':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10';
      case 'high':
        return 'text-expense bg-red-50 dark:bg-red-500/10';
    }
  };

  return (
    <Card className='p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h3 className='text-lg font-bold text-foreground'>
          Previsão Financeira ({monthsCount} meses)
        </h3>

        <div className='flex gap-1 bg-muted rounded-lg p-1 justify-center lg:justify-normal'>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-background text-foreground dark:text-gray-100 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ChartLineIcon className='w-4 h-4' />
            <span>Resumo</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-background dark:bg-primary text-foreground dark:text-gray-100 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
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
            <div className='bg-muted rounded-lg p-4'>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Receita Total
              </p>
              <p className='text-xl font-bold text-income'>
                {formatCurrency(summary.totalProjectedIncome)}
              </p>
            </div>

            <div className='bg-muted rounded-lg p-4'>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Despesas Totais
              </p>
              <p className='text-xl font-bold text-expense'>
                {formatCurrency(summary.totalProjectedExpenses)}
              </p>
            </div>

            <div className='bg-muted rounded-lg p-4'>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Fluxo Líquido
              </p>
              <p
                className={`text-xl font-bold ${
                  summary.totalNetFlow >= 0 ? 'text-foreground' : 'text-expense'
                }`}
              >
                {formatCurrency(summary.totalNetFlow)}
              </p>
            </div>

            <div className='bg-muted rounded-lg p-4'>
              <p className='text-sm font-medium text-muted-foreground mb-1'>
                Saldo Final
              </p>
              <p
                className={`text-xl font-bold ${
                  summary.finalBalance >= 0 ? 'text-foreground' : 'text-expense'
                }`}
              >
                {formatCurrency(summary.finalBalance)}
              </p>
            </div>
          </div>

          <div className='bg-muted rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium text-muted-foreground'>
                Fluxo Médio Mensal
              </p>
              <p
                className={`text-lg font-bold ${
                  summary.averageMonthlyFlow >= 0
                    ? 'text-foreground'
                    : 'text-expense'
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

            <div className='rounded-lg border border-border bg-muted p-4'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-muted-foreground'>
                  Nível de Risco
                </span>
                <WarningIcon
                  className='w-5 h-5 text-muted-foreground'
                  weight='bold'
                />
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
            <div className='bg-muted rounded-lg p-4'>
              <h4 className='text-sm font-semibold text-foreground mb-3'>
                Recomendações
              </h4>
              <ul className='space-y-2'>
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className='flex items-start'>
                    <CheckCircleIcon
                      className='w-4 h-4 text-income mr-2 mt-0.5 flex-shrink-0'
                      weight='bold'
                    />
                    <span className='text-sm text-muted-foreground'>
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
