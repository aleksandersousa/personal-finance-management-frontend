'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { TrendUpIcon, TrendDownIcon } from '@phosphor-icons/react/dist/ssr';
import { formatCurrency } from '@/lib/utils';

export interface SummaryCardProps {
  title: string;
  value: number; // em centavos
  type: 'income' | 'expense' | 'balance';
  comparison?: {
    previousValue: number;
    change: number; // percentual
  };
  icon?: React.ReactNode;
  details?: {
    fixed: number;
    variable: number;
    entriesCount: number;
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  type,
  comparison,
  icon,
  details,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isClicked) {
        const target = event.target as Element;
        if (!target.closest('.summary-card-container')) {
          setIsClicked(false);
        }
      }
    };

    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isClicked]);

  const shouldShowDetails = isMobile ? isClicked : isHovered;

  const handleCardClick = () => {
    if (isMobile) {
      setIsClicked(!isClicked);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  const getCardStyles = () => {
    return 'p-6';
  };

  const getValueColor = () => {
    switch (type) {
      case 'income':
        return 'text-income';
      case 'expense':
        return 'text-expense';
      case 'balance':
        return value >= 0
          ? 'text-foreground dark:text-gray-100'
          : 'text-expense';
      default:
        return 'text-muted-foreground dark:text-gray-100';
    }
  };

  const getChangeColor = (change: number) => {
    if (type === 'expense') {
      // Para despesas, aumento é ruim (vermelho), diminuição é bom (verde)
      return change > 0 ? 'text-expense' : 'text-income';
    } else {
      // Para receitas e saldo, aumento é bom (verde), diminuição é ruim (vermelho)
      return change > 0 ? 'text-income' : 'text-expense';
    }
  };

  const getChangeIcon = (change: number) => {
    const isPositive = change >= 0;
    return isPositive ? (
      <TrendUpIcon className='w-4 h-4' weight='bold' />
    ) : (
      <TrendDownIcon className='w-4 h-4' weight='bold' />
    );
  };

  return (
    <div className='relative summary-card-container group'>
      <Card
        className={`${getCardStyles()} ${isMobile ? 'cursor-pointer' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <CardHeader className='flex-row items-center justify-between mb-3'>
          <CardTitle className='text-sm font-semibold text-text-primary dark:text-gray-100 uppercase tracking-wide'>
            {title}
          </CardTitle>
          {icon && (
            <div className='p-2 rounded-lg bg-slate-100 dark:bg-slate-800'>
              {icon}
            </div>
          )}
        </CardHeader>

        <CardContent className='space-y-3'>
          {/* Value */}
          <div>
            <div className={`text-3xl font-bold ${getValueColor()}`}>
              {type === 'expense' && value > 0 ? '-' : ''}
              {formatCurrency(value)}
            </div>
          </div>

          {/* Comparison */}
          {comparison && (
            <div className='flex items-center gap-2'>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${getChangeColor(comparison.change)} ${
                  comparison.change > 0
                    ? type === 'expense'
                      ? 'bg-red-50 dark:bg-red-500/10'
                      : 'bg-emerald-50 dark:bg-emerald-500/10'
                    : type === 'expense'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10'
                      : 'bg-red-50 dark:bg-red-500/10'
                }`}
              >
                {getChangeIcon(comparison.change)}
                <span>{Math.abs(comparison.change).toFixed(1)}%</span>
              </div>
              <span className='text-xs text-text-secondary'>
                vs. mês anterior
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hover Details */}
      {shouldShowDetails &&
        details &&
        (type === 'income' || type === 'expense') && (
          <div
            className={`absolute z-20 bg-background rounded-xl border border-border shadow-xl dark:shadow-[0_25px_60px_rgba(15,23,42,0.4)] p-4 min-w-[280px] ${
              isMobile
                ? 'top-full left-0 right-0 mt-2'
                : 'top-full left-1/2 transform -translate-x-1/2 mt-2'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className='space-y-3'>
              <h4 className='text-sm font-semibold text-text-primary dark:text-gray-100 mb-3'>
                Detalhamento
              </h4>

              <div className='space-y-2'>
                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-income' : 'bg-expense'}`}
                    />
                    <span className='text-sm font-medium text-text-primary dark:text-gray-100'>
                      Fixas
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${type === 'income' ? 'text-income' : 'text-expense'}`}
                  >
                    {formatCurrency(details.fixed)}
                  </span>
                </div>

                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-green-400' : 'bg-red-400'}`}
                    />
                    <span className='text-sm font-medium text-text-primary dark:text-gray-100'>
                      Variáveis
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${type === 'income' ? 'text-income' : 'text-expense'}`}
                  >
                    {formatCurrency(details.variable)}
                  </span>
                </div>

                <div className='pt-2 mt-2 border-t border-border'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs font-medium text-text-secondary dark:text-gray-100'>
                      Total de entradas
                    </span>
                    <span className='text-sm font-semibold text-text-primary dark:text-gray-100'>
                      {details.entriesCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow pointing to card (desktop only) */}
            {!isMobile && (
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-background'></div>
            )}
          </div>
        )}
    </div>
  );
};
