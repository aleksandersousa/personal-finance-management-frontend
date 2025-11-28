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
import { Button } from './button';
import { MonthlyProjectionChart } from './monthly-projection-chart';

export interface ConsolidatedForecastCardProps {
  summary: ForecastSummaryModel;
  insights: ForecastInsightsModel;
  monthsCount: number;
  projections: MonthlyProjectionModel[];
}

export const ConsolidatedForecastCard: React.FC<
  ConsolidatedForecastCardProps
> = ({ summary, insights, monthsCount, projections }) => {
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
        return <TrendUpIcon className='w-5 h-5' />;
      case 'negative':
        return <TrendDownIcon className='w-5 h-5' />;
      case 'stable':
        return <MinusIcon className='w-5 h-5' />;
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

  return (
    <Card className='p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h3 className='text-lg font-semibold text-foreground'>
          Previsão Financeira ({monthsCount} meses)
        </h3>

        <div className='flex gap-1 bg-muted rounded-lg p-1 justify-center lg:justify-normal'>
          <Button
            variant={activeTab === 'summary' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-primary text-neutral-0 shadow-sm'
                : 'text-foreground hover:text-foreground'
            }`}
          >
            <ChartLineIcon className='w-4 h-4' />
            <span>Resumo</span>
          </Button>
          <Button
            variant={activeTab === 'insights' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-primary text-neutral-0 shadow-sm'
                : 'text-foreground hover:text-foreground'
            }`}
          >
            <LightbulbIcon className='w-4 h-4' />
            <span>Insights</span>
          </Button>
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card className='rounded-lg p-4'>
              <p className='text-sm text-foreground mb-1'>Receita Total</p>
              <p className='text-xl text-foreground'>
                {formatCurrency(summary.totalProjectedIncome)}
              </p>
            </Card>

            <Card className=' rounded-lg p-4'>
              <p className='text-sm text-foreground mb-1'>Despesas Totais</p>
              <p className='text-xl text-foreground'>
                {formatCurrency(summary.totalProjectedExpenses)}
              </p>
            </Card>

            <Card className=' rounded-lg p-4'>
              <p className='text-sm text-foreground mb-1'>Fluxo Líquido</p>
              <p
                className={`text-xl ${
                  summary.totalNetFlow >= 0
                    ? 'text-foreground'
                    : 'text-foreground'
                }`}
              >
                {formatCurrency(summary.totalNetFlow)}
              </p>
            </Card>

            <Card className=' rounded-lg p-4'>
              <p className='text-sm text-foreground mb-1'>Saldo Final</p>
              <p
                className={`text-xl ${
                  summary.finalBalance >= 0
                    ? 'text-foreground'
                    : 'text-foreground'
                }`}
              >
                {formatCurrency(summary.finalBalance)}
              </p>
            </Card>
          </div>

          {/* Chart */}
          <MonthlyProjectionChart projections={projections} />
        </div>
      )}

      {activeTab === 'insights' && (
        <div className='space-y-4'>
          {/* Trend and Risk */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Card className='rounded-lg p-4 text-foreground '>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm'>Tendência</span>
                {getTrendIcon(insights.trend)}
              </div>
              <p className='text-lg'>{getTrendLabel(insights.trend)}</p>
            </Card>

            <Card className='rounded-lg  p-4'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-foreground'>Nível de Risco</span>
                <WarningIcon className='w-5 h-5 text-foreground' />
              </div>
              <p className='text-lg text-foreground'>
                {getRiskLabel(insights.riskLevel)}
              </p>
            </Card>
          </div>

          {/* Recommendations */}
          {insights.recommendations && insights.recommendations.length > 0 && (
            <Card className='rounded-lg p-4'>
              <h4 className='text-sm text-foreground mb-3'>Recomendações</h4>
              <ul className='space-y-2'>
                {insights.recommendations.map((recommendation, index) => (
                  <li key={index} className='flex items-start'>
                    <CheckCircleIcon className='w-4 h-4 text-foreground mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-sm text-foreground'>
                      {recommendation}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
};
