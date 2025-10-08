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
    <div className='relative summary-card-container'>
      <Card
        className={`transition-all duration-300 hover:shadow-md ${getCardStyles()} ${isMobile ? 'cursor-pointer' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
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
              <span className='text-muted-foreground ml-2'>
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
            className={`absolute z-20 bg-white rounded-xl border border-slate-200 shadow-xl p-4 min-w-[280px] ${
              isMobile
                ? 'top-full left-0 right-0 mt-2'
                : 'top-full left-1/2 transform -translate-x-1/2 mt-2'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className='space-y-3'>
              <h4 className='text-sm font-semibold text-slate-800 mb-3'>
                Detalhamento
              </h4>

              <div className='space-y-2'>
                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-green-600' : 'bg-red-600'}`}
                    ></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Fixas
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatCurrency(details.fixed)}
                  </span>
                </div>

                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}
                    ></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Variáveis
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {formatCurrency(details.variable)}
                  </span>
                </div>

                <div className='pt-2 border-t border-slate-100'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-slate-500'>
                      Total de entradas
                    </span>
                    <span className='text-sm font-medium text-slate-700'>
                      {details.entriesCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow pointing to card (desktop only) */}
            {!isMobile && (
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white'></div>
            )}
          </div>
        )}
    </div>
  );
};
