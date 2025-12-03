'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { MonthlyProjectionModel } from '@/domain/models';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from './card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface MonthlyProjectionChartProps {
  projections: MonthlyProjectionModel[];
  title?: string;
  className?: string;
}

export const MonthlyProjectionChart: React.FC<MonthlyProjectionChartProps> = ({
  projections,
  title = 'Projeção Mensal',
  className,
}) => {
  const [themeClass, setThemeClass] = useState<string>('');

  // Watch for theme changes by observing the dark class on documentElement
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setThemeClass(isDark ? 'dark' : 'light');
    };

    // Initial check
    updateTheme();

    // Watch for class changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const chartData = useMemo(() => {
    if (!projections || projections.length === 0) {
      return null;
    }

    const labels = projections.map(proj => {
      const [year, month] = proj.month.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('pt-BR', {
        month: 'short',
        year: '2-digit',
      });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Receita',
          data: projections.map(p => p.projectedIncome / 100),
          borderColor: 'rgb(5, 150, 105)', // success color
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          fill: false,
          tension: 0.6,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: 'rgb(5, 150, 105)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Despesas',
          data: projections.map(p => p.projectedExpenses / 100),
          borderColor: 'rgb(220, 38, 38)', // error color
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          fill: false,
          tension: 0.6,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: 'rgb(220, 38, 38)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Fluxo Líquido',
          data: projections.map(p => p.netFlow / 100),
          borderColor: 'rgb(139, 92, 246)', // primary color
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: false,
          tension: 0.6,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: 'rgb(139, 92, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          borderDash: [5, 5],
        },
        {
          label: 'Saldo Acumulado',
          data: projections.map(p => p.cumulativeBalance / 100),
          borderColor: 'rgb(107, 114, 128)', // neutral-500
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          fill: true,
          tension: 0.6,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: 'rgb(107, 114, 128)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          yAxisID: 'y1',
        },
      ],
    };
  }, [projections]);

  const chartOptions = useMemo(() => {
    // Get CSS variable value for theme-aware colors
    const getCSSVariable = (varName: string, fallback: string) => {
      if (typeof window === 'undefined') return fallback;
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      return value || fallback;
    };

    const labelColor = getCSSVariable('--color-foreground', 'rgb(55, 65, 81)');
    const tickColor = getCSSVariable(
      '--color-foreground-secondary',
      'rgb(156, 163, 175)'
    );
    const gridColor = getCSSVariable(
      '--color-border-foreground',
      'rgba(229, 231, 235, 0.5)'
    );
    const isDark = themeClass === 'dark';

    // For grid color, we need to handle opacity properly
    const gridColorWithOpacity = isDark
      ? 'rgba(75, 85, 99, 0.3)' // neutral-600 with opacity for dark mode
      : 'rgba(229, 231, 235, 0.5)'; // neutral-200 with opacity for light mode

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            usePointStyle: true,
            padding: 12,
            font: {
              size: 12,
              family: 'system-ui, -apple-system, sans-serif',
            },
            color: labelColor,
          },
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold' as const,
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: tickColor,
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          grid: {
            color: gridColorWithOpacity,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: tickColor,
            callback: function (value: any) {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(value);
            },
          },
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: tickColor,
            callback: function (value: any) {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1,
              }).format(value);
            },
          },
        },
      },
    };
  }, [themeClass]); // Re-compute when theme changes

  if (!chartData) {
    return null;
  }

  return (
    <Card className={`rounded-lg p-4 sm:p-6 ${className || ''}`}>
      <h4 className='text-sm font-semibold text-foreground mb-4'>{title}</h4>
      <div className='w-full h-[300px] sm:h-[350px] md:h-[400px]'>
        <Line data={chartData} options={chartOptions} />
      </div>
    </Card>
  );
};
