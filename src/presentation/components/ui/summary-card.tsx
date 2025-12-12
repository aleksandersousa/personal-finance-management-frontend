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
    paid?: number;
    unpaid?: number;
    fixed?: number;
    variable?: number;
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

  const getChangeColor = (change: number) => {
    const isPositive = change > 0;
    if (type === 'expense') {
      return isPositive ? 'text-error-500' : 'text-success';
    } else {
      return isPositive ? 'text-success' : 'text-error-500';
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

  const getCardIndicator = (value: number) => {
    if (type === 'expense') {
      return value > 0 ? '-' : '+';
    } else if (type === 'income') {
      return value > 0 ? '+' : '-';
    } else {
      return '';
    }
  };

  return (
    <div className='relative summary-card-container group'>
      <Card
        className='p-4'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <CardHeader className='flex-row items-center justify-between mb-3'>
          <CardTitle className='text-sm font-semibold text-foreground uppercase tracking-wide'>
            {title}
          </CardTitle>
          {icon && <div className='p-2 rounded-lg bg-primary'>{icon}</div>}
        </CardHeader>

        <CardContent className='space-y-3'>
          <div>
            <div className={`text-3xl text-foreground`}>
              {getCardIndicator(value)}
              {formatCurrency(value)}
            </div>
          </div>

          {comparison && (
            <div className='flex items-center gap-2'>
              <div
                className={`flex items-center gap-1 py-0.5 rounded text-xs ${getChangeColor(comparison.change)}`}
              >
                {getChangeIcon(comparison.change)}
                <span>{Math.abs(comparison.change).toFixed(1)}%</span>
              </div>
              <span className='text-xs text-neutral-500'>vs. mês anterior</span>
            </div>
          )}
        </CardContent>
      </Card>

      {shouldShowDetails &&
        details &&
        (type === 'income' || type === 'expense') && (
          <div
            className={`absolute z-20 bg-background rounded-xl border border-border-foreground shadow-xl dark:shadow-[0_25px_60px_rgba(15,23,42,0.4)] p-4 min-w-[280px] ${
              isMobile
                ? 'top-full left-0 right-0 mt-2'
                : 'top-full left-1/2 transform -translate-x-1/2 mt-2'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className='space-y-3'>
              <h4 className='text-sm text-foreground mb-3'>Detalhamento</h4>

              <div className='space-y-2'>
                {type === 'expense' &&
                details.paid !== undefined &&
                details.unpaid !== undefined ? (
                  <>
                    <div className='flex justify-between items-center py-1'>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-success' />
                        <span className='text-sm text-foreground'>Pagas</span>
                      </div>
                      <span className='text-sm text-success'>
                        {formatCurrency(details.paid)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center py-1'>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-warning' />
                        <span className='text-sm text-foreground'>A Pagar</span>
                      </div>
                      <span className='text-sm text-foreground'>
                        {formatCurrency(details.unpaid)}
                      </span>
                    </div>

                    <div className='pt-2 mt-2 border-t border-border-foreground'>
                      <div className='space-y-2'>
                        <div className='flex justify-between items-center py-1'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-error' />
                            <span className='text-sm text-foreground'>
                              Fixas (Pagas)
                            </span>
                          </div>
                          <span className='text-sm text-error'>
                            {formatCurrency(details.fixed || 0)}
                          </span>
                        </div>

                        <div className='flex justify-between items-center py-1'>
                          <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-error' />
                            <span className='text-sm text-foreground'>
                              Variáveis (Pagas)
                            </span>
                          </div>
                          <span className='text-sm text-error'>
                            {formatCurrency(details.variable || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex justify-between items-center py-1'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-success' : 'bg-error'}`}
                        />
                        <span className='text-sm text-foreground'>Fixas</span>
                      </div>
                      <span
                        className={`text-sm ${type === 'income' ? 'text-success' : 'text-error'}`}
                      >
                        {formatCurrency(details.fixed || 0)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center py-1'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`w-2 h-2 rounded-full ${type === 'income' ? 'bg-success' : 'bg-error'}`}
                        />
                        <span className='text-sm text-foreground'>
                          Variáveis
                        </span>
                      </div>
                      <span
                        className={`text-sm ${type === 'income' ? 'text-success' : 'text-error'}`}
                      >
                        {formatCurrency(details.variable || 0)}
                      </span>
                    </div>
                  </>
                )}

                <div className='pt-2 mt-2 border-t border-border-foreground'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-foreground'>
                      Total de entradas
                    </span>
                    <span className='text-sm text-foreground'>
                      {details.entriesCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {!isMobile && (
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-background'></div>
            )}
          </div>
        )}
    </div>
  );
};
