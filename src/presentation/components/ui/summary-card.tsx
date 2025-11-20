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
        return 'bg-white border-slate-200 shadow-md';
      case 'expense':
        return 'bg-white border-slate-200 shadow-md';
      case 'balance':
        return 'bg-white border-slate-200 shadow-md';
      default:
        return 'bg-white border-slate-200 shadow-md';
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'income':
        return 'text-emerald-600';
      case 'expense':
        return 'text-rose-600';
      case 'balance':
        return value >= 0 ? 'text-slate-700' : 'text-amber-600';
      default:
        return 'text-slate-600';
    }
  };

  const getChangeColor = (change: number) => {
    if (type === 'expense') {
      // Para despesas, aumento é ruim (vermelho), diminuição é bom (verde)
      return change > 0 ? 'text-rose-600' : 'text-emerald-600';
    } else {
      // Para receitas e saldo, aumento é bom (verde), diminuição é ruim (vermelho)
      return change > 0 ? 'text-emerald-600' : 'text-rose-600';
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
    <div className='relative summary-card-container group'>
      <Card
        className={`${getCardStyles()} ${isMobile ? 'cursor-pointer' : ''} border-2`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-slate-600'>
            {title}
          </CardTitle>
          {icon && <div className='p-2 rounded-lg bg-slate-100'>{icon}</div>}
        </CardHeader>

        <CardContent className='space-y-3'>
          {/* Value */}
          <div>
            <div className={`text-2xl font-bold ${getValueColor()}`}>
              {type === 'expense' && value > 0 ? '-' : ''}
              {formatCurrency(value)}
            </div>
          </div>

          {/* Comparison */}
          {comparison && (
            <div className='flex items-center gap-2'>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getChangeColor(comparison.change)} ${
                  comparison.change > 0
                    ? type === 'expense'
                      ? 'bg-rose-50'
                      : 'bg-emerald-50'
                    : type === 'expense'
                      ? 'bg-emerald-50'
                      : 'bg-rose-50'
                }`}
              >
                {getChangeIcon(comparison.change)}
                <span>{Math.abs(comparison.change).toFixed(1)}%</span>
              </div>
              <span className='text-xs text-slate-500'>vs. mês anterior</span>
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
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    ></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Fixas
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {formatCurrency(details.fixed)}
                  </span>
                </div>

                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'}`}
                    ></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Variáveis
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}
                  >
                    {formatCurrency(details.variable)}
                  </span>
                </div>

                <div className='pt-2 mt-2 border-t border-slate-100'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs font-medium text-slate-500'>
                      Total de entradas
                    </span>
                    <span className='text-sm font-semibold text-slate-700'>
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
