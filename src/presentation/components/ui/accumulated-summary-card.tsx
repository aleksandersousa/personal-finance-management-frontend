'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { formatCurrency } from '@/lib/utils';
import { AccumulatedSummaryDataModel } from '@/domain/models/monthly-summary';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  WarningCircleIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr';

export interface AccumulatedSummaryCardProps {
  title: string;
  accumulated: AccumulatedSummaryDataModel | null;
}

export const AccumulatedSummaryCard: React.FC<AccumulatedSummaryCardProps> = ({
  title,
  accumulated,
}) => {
  return (
    <Card className='p-4'>
      <CardHeader className='flex-row items-center justify-between mb-3'>
        <CardTitle className='text-sm font-semibold text-foreground uppercase tracking-wide'>
          {title}
        </CardTitle>
        <div className='p-2 rounded-lg bg-primary'>
          <WalletIcon className='w-6 h-6 text-neutral-0' />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 rounded-full bg-success/10'>
              <ArrowUpIcon className='w-4 h-4 text-success' />
            </div>
            <span className='text-sm text-foreground'>Receitas Totais</span>
          </div>
          <span className='text-lg font-semibold text-success'>
            {formatCurrency(accumulated?.totalIncome || 0)}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 rounded-full bg-error/10'>
              <ArrowDownIcon className='w-4 h-4 text-error' />
            </div>
            <span className='text-sm text-foreground'>Despesas Pagas</span>
          </div>
          <span className='text-lg font-semibold text-error'>
            {formatCurrency(accumulated?.totalPaidExpenses || 0)}
          </span>
        </div>

        {accumulated?.previousMonthsUnpaidExpenses &&
        accumulated.previousMonthsUnpaidExpenses > 0 ? (
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='p-1.5 rounded-full bg-warning/10'>
                <WarningCircleIcon className='w-4 h-4 text-amber-600' />
              </div>
              <span className='text-sm text-foreground'>
                Despesas Não Pagas (Meses Anteriores)
              </span>
            </div>
            <span className='text-lg font-semibold text-amber-600'>
              {formatCurrency(accumulated.previousMonthsUnpaidExpenses || 0)}
            </span>
          </div>
        ) : null}

        <div className='pt-3 mt-3 border-t border-border-foreground'>
          <div className='flex items-center justify-between'>
            <span className='text-base font-semibold text-foreground'>
              Saldo Real
            </span>
            <span
              className={`text-2xl font-bold ${
                accumulated?.realBalance && accumulated.realBalance >= 0
                  ? 'text-success'
                  : 'text-error'
              }`}
            >
              {formatCurrency(accumulated?.realBalance || 0)}
            </span>
          </div>
          <p className='text-xs text-neutral-500 mt-2'>
            Saldo acumulado considerando todas as receitas e despesas pagas até
            o mês selecionado
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
