'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { MonthlyProjectionModel } from '@/domain/models';
import { CheckCircleIcon, WarningIcon } from '@phosphor-icons/react/dist/ssr';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface InteractiveMonthlyProjectionsChartProps {
  projections: MonthlyProjectionModel[];
}

export const InteractiveMonthlyProjectionsChart: React.FC<
  InteractiveMonthlyProjectionsChartProps
> = ({ projections }) => {
  const [hoveredData, setHoveredData] = useState<MonthlyProjectionModel | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const chartRef = useRef<ChartJS>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
  };

  const getConfidenceIcon = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return (
          <CheckCircleIcon className='w-4 h-4 text-green-600' weight='bold' />
        );
      case 'medium':
        return <WarningIcon className='w-4 h-4 text-amber-600' weight='bold' />;
      case 'low':
        return <WarningIcon className='w-4 h-4 text-red-600' weight='bold' />;
    }
  };

  const getConfidenceLabel = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
    }
  };

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'text-emerald-700 bg-emerald-50';
      case 'medium':
        return 'text-amber-700 bg-amber-50';
      case 'low':
        return 'text-rose-700 bg-rose-50';
    }
  };

  const clearTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredData(null);
    setTooltipPosition(null);
  }, []);

  const showTooltip = useCallback(
    (data: MonthlyProjectionModel, position: { x: number; y: number }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Só atualiza se os dados ou posição mudaram significativamente
      const shouldUpdateData = !hoveredData || hoveredData.month !== data.month;
      const shouldUpdatePosition =
        !tooltipPosition ||
        Math.abs(tooltipPosition.x - position.x) > 10 ||
        Math.abs(tooltipPosition.y - position.y) > 10;

      if (shouldUpdateData) {
        setHoveredData(data);
      }

      if (shouldUpdatePosition) {
        setTooltipPosition(position);
      }
    },
    [hoveredData, tooltipPosition]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Prepare chart data
  const labels = projections.map(p => formatMonth(p.month));
  const cumulativeBalanceData = projections.map(p => p.cumulativeBalance / 100);
  const netFlowData = projections.map(p => p.netFlow / 100);

  // Find min and max values for better scaling
  const allValues = [...cumulativeBalanceData, ...netFlowData];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

  const data = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Saldo Acumulado',
        data: cumulativeBalanceData,
        backgroundColor: cumulativeBalanceData.map(value =>
          value >= 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'
        ),
        borderColor: cumulativeBalanceData.map(value =>
          value >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
        ),
        borderWidth: 2,
        borderRadius: 4,
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Fluxo Líquido Mensal',
        data: netFlowData,
        borderColor: 'rgba(6, 182, 212, 1)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgba(6, 182, 212, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        enabled: false, // We'll use custom tooltip
        external: (context: any) => {
          const { tooltip } = context;
          const dataIndex = tooltip.dataPoints?.[0]?.dataIndex;

          if (dataIndex !== undefined && dataIndex < projections.length) {
            setHoveredData(projections[dataIndex]);
          } else {
            setHoveredData(null);
          }
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
            weight: 'bold' as const,
          },
          color: '#64748b',
        },
      },
      y: {
        min: minValue - padding,
        max: maxValue + padding,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            weight: 'bold' as const,
          },
          color: '#64748b',
          callback: function (value: any) {
            return formatCurrency(value * 100);
          },
        },
      },
    },
    onHover: (event: any, activeElements: any[]) => {
      if (activeElements.length > 0) {
        const dataIndex = activeElements[0].index;
        const newData = projections[dataIndex];

        // Calcular posição baseada no mês (eixo X)
        const canvas = event.native?.target;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const chartArea = chartRef.current?.chartArea;

          if (chartArea) {
            // Posição X baseada no mês (centro da barra)
            const xPosition =
              chartArea.left +
              (chartArea.width / projections.length) * (dataIndex + 0.5);
            const yPosition = chartArea.top + 20; // Posição fixa no topo

            // Calcular posição relativa ao container
            const relativeX = xPosition - rect.left;
            const relativeY = yPosition - rect.top;

            // Limitar posição dentro do container
            const tooltipWidth = 280; // min-w-[280px]
            const containerWidth = rect.width;
            const containerHeight = rect.height;

            const clampedX = Math.max(
              tooltipWidth / 2,
              Math.min(relativeX, containerWidth - tooltipWidth / 2)
            );
            const clampedY = Math.max(
              10,
              Math.min(relativeY, containerHeight - 200)
            );

            showTooltip(newData, {
              x: clampedX,
              y: clampedY,
            });
          }
        }
      } else {
        clearTooltip();
      }
    },
    onLeave: () => {
      clearTooltip();
    },
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 p-6 shadow-md'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-slate-900'>
          Projeções Mensais
        </h3>
      </div>

      <div className='relative overflow-hidden' onMouseLeave={clearTooltip}>
        {/* Chart Container */}
        <div className='h-96 mb-4'>
          <Chart ref={chartRef} type='bar' data={data} options={options} />
        </div>

        {/* Custom Tooltip */}
        {hoveredData && tooltipPosition && (
          <div
            className='absolute bg-white rounded-lg border border-slate-200 shadow-xl p-4 min-w-[280px] z-10 pointer-events-none'
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-semibold text-slate-800'>
                  {formatMonth(hoveredData.month)}
                </h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(hoveredData.confidence)}`}
                >
                  {getConfidenceLabel(hoveredData.confidence)}
                </span>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-emerald-400'></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Receitas
                    </span>
                  </div>
                  <span className='text-sm font-bold text-emerald-600'>
                    {formatCurrency(hoveredData.projectedIncome)}
                  </span>
                </div>

                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-rose-400'></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Despesas
                    </span>
                  </div>
                  <span className='text-sm font-bold text-rose-600'>
                    {formatCurrency(hoveredData.projectedExpenses)}
                  </span>
                </div>

                <div className='flex justify-between items-center py-1 border-t border-slate-100 pt-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-slate-400'></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Fluxo Líquido Mensal
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      hoveredData.netFlow >= 0
                        ? 'text-slate-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {formatCurrency(hoveredData.netFlow)}
                  </span>
                </div>

                <div className='flex justify-between items-center py-1'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        hoveredData.cumulativeBalance >= 0
                          ? 'bg-slate-500'
                          : 'bg-rose-400'
                      }`}
                    ></div>
                    <span className='text-sm font-medium text-slate-600'>
                      Saldo Acumulado
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      hoveredData.cumulativeBalance >= 0
                        ? 'text-slate-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {formatCurrency(hoveredData.cumulativeBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
