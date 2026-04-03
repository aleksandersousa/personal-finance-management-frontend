'use client';

import { useMemo, useEffect, useState, type FC } from 'react';
import type { CategoryBreakdownItemModel } from '@/domain/models/monthly-summary';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from './card';
import { ChartBarIcon } from '@phosphor-icons/react/dist/ssr';

ChartJS.register(ArcElement, Tooltip, Legend);

const SLICE_COLORS = [
  'rgb(139, 92, 246)',
  'rgb(5, 150, 105)',
  'rgb(220, 38, 38)',
  'rgb(234, 179, 8)',
  'rgb(59, 130, 246)',
  'rgb(236, 72, 153)',
  'rgb(20, 184, 166)',
  'rgb(249, 115, 22)',
  'rgb(99, 102, 241)',
  'rgb(16, 185, 129)',
  'rgb(239, 68, 68)',
  'rgb(168, 85, 247)',
];

function formatBrl(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

function formatMonthLabel(yyyyMm: string): string {
  const [y, m] = yyyyMm.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

interface DonutBlockProps {
  title: string;
  items: { categoryId: string; name: string; amountCents: number }[];
  emptyCopy: string;
}

const ExpenseDonutBlock: FC<DonutBlockProps> = ({
  title,
  items,
  emptyCopy,
}) => {
  const [themeClass, setThemeClass] = useState('');

  useEffect(() => {
    const updateTheme = () => {
      setThemeClass(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    if (items.length === 0) return null;
    const labels = items.map(i => i.name);
    const data = items.map(i => i.amountCents / 100);
    const backgroundColor = items.map(
      (_, i) => SLICE_COLORS[i % SLICE_COLORS.length]
    );
    return { labels, datasets: [{ data, backgroundColor, borderWidth: 0 }] };
  }, [items]);

  const options = useMemo(() => {
    const isDark = themeClass === 'dark';

    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: {
            label(ctx: { parsed: number; label: string | string[] }) {
              const raw = typeof ctx.parsed === 'number' ? ctx.parsed : 0;
              const cents = Math.round(raw * 100);
              const name = Array.isArray(ctx.label) ? ctx.label[0] : ctx.label;
              return `${formatBrl(cents)} ${name}`;
            },
          },
        },
      },
    };
  }, [themeClass]);

  if (!chartData) {
    return (
      <Card className='rounded-lg p-4 flex flex-col min-h-[200px]'>
        <h4 className='text-sm font-semibold text-foreground mb-3'>{title}</h4>
        <div className='flex-1 flex flex-col items-center justify-center text-center text-neutral-500 dark:text-gray-300 py-6'>
          <ChartBarIcon className='w-10 h-10 mb-2 opacity-60' weight='thin' />
          <p className='text-sm'>{emptyCopy}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='rounded-lg p-4'>
      <h4 className='text-sm font-semibold text-foreground mb-3'>{title}</h4>
      <div className='flex flex-col sm:flex-row gap-4 sm:items-start'>
        <div className='h-[200px] w-full sm:w-[min(100%,220px)] sm:shrink-0 mx-auto sm:mx-0'>
          <Doughnut data={chartData} options={options} />
        </div>
        <ul className='flex-1 space-y-2 text-sm text-foreground min-w-0'>
          {items.map((row, dotIndex) => (
            <li
              key={`${row.categoryId}-${row.amountCents}`}
              className='flex items-start gap-2'
            >
              <span
                className='mt-1.5 h-2 w-2 rounded-full shrink-0'
                style={{
                  backgroundColor: SLICE_COLORS[dotIndex % SLICE_COLORS.length],
                }}
              />
              <span className='break-words'>
                {formatBrl(row.amountCents)} {row.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export interface ForecastCategoryDonutsProps {
  items: CategoryBreakdownItemModel[];
  currentMonthYyyyMm: string;
  className?: string;
}

export const ForecastCategoryDonuts: FC<ForecastCategoryDonutsProps> = ({
  items,
  currentMonthYyyyMm,
  className,
}) => {
  const expenses = useMemo(
    () => items.filter(i => i.type === 'EXPENSE'),
    [items]
  );

  const paidSorted = useMemo(() => {
    return [...expenses]
      .filter(e => e.total > 0)
      .sort((a, b) => b.total - a.total)
      .map(e => ({
        categoryId: e.categoryId,
        name: e.categoryName,
        amountCents: e.total,
      }));
  }, [expenses]);

  const unpaidSorted = useMemo(() => {
    return [...expenses]
      .filter(e => e.unpaidAmount > 0)
      .sort((a, b) => b.unpaidAmount - a.unpaidAmount)
      .map(e => ({
        categoryId: e.categoryId,
        name: e.categoryName,
        amountCents: e.unpaidAmount,
      }));
  }, [expenses]);

  const monthReadable = formatMonthLabel(currentMonthYyyyMm);

  return (
    <div className={className}>
      <p className='text-xs text-foreground-secondary mb-4'>
        Despesas do mês selecionado ({monthReadable})
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
        <ExpenseDonutBlock
          title='Despesas pagas por categoria'
          items={paidSorted}
          emptyCopy='Nenhuma despesa paga por categoria neste mês'
        />
        <ExpenseDonutBlock
          title='Despesas a pagar por categoria'
          items={unpaidSorted}
          emptyCopy='Nenhuma despesa a pagar por categoria neste mês'
        />
      </div>
    </div>
  );
};
