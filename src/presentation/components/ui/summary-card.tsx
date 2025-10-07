import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { TrendUpIcon, TrendDownIcon } from '@phosphor-icons/react/dist/ssr';

export interface SummaryCardProps {
  title: string;
  value: number; // em centavos
  type: 'income' | 'expense' | 'balance';
  comparison?: {
    previousValue: number;
    change: number; // percentual
  };
  icon?: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  type,
  comparison,
  icon,
}) => {
  const formatCurrency = (amount: number) => {
    return `R$ ${(Math.abs(amount) / 100).toFixed(2).replace('.', ',')}`;
  };

  const getCardStyles = () => {
    switch (type) {
      case 'income':
        return 'bg-gradient-to-r from-green-50 to-green-100 border-green-200';
      case 'expense':
        return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200';
      case 'balance':
        return value >= 0
          ? 'bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200'
          : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200';
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'balance':
        return value >= 0 ? 'text-cyan-600' : 'text-amber-600';
      default:
        return 'text-slate-600';
    }
  };

  const getChangeColor = (change: number) => {
    if (type === 'expense') {
      // Para despesas, aumento é ruim (vermelho), diminuição é bom (verde)
      return change > 0 ? 'text-red-500' : 'text-green-500';
    } else {
      // Para receitas e saldo, aumento é bom (verde), diminuição é ruim (vermelho)
      return change > 0 ? 'text-green-500' : 'text-red-500';
    }
  };

  const getChangeIcon = (change: number) => {
    const isPositive = change > 0;
    return isPositive ? (
      <TrendUpIcon className='w-4 h-4' weight='bold' />
    ) : (
      <TrendDownIcon className='w-4 h-4' weight='bold' />
    );
  };

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-md ${getCardStyles()}`}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-slate-700'>
          {title}
        </CardTitle>
        {icon && <div className='p-2 rounded-lg bg-white/50'>{icon}</div>}
      </CardHeader>

      <CardContent>
        {/* Value */}
        <div className='mb-3'>
          <div className={`text-2xl font-bold ${getValueColor()}`}>
            {type === 'expense' && value > 0 ? '-' : ''}
            {formatCurrency(value)}
          </div>
        </div>

        {/* Comparison */}
        {comparison && (
          <div className='flex items-center text-sm'>
            <div
              className={`flex items-center space-x-1 ${getChangeColor(comparison.change)}`}
            >
              {getChangeIcon(comparison.change)}
              <span className='font-medium'>
                {Math.abs(comparison.change).toFixed(1)}%
              </span>
            </div>
            <span className='text-muted-foreground ml-2'>vs. mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
