import React from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
  date: Date;
  metadata?: Record<string, unknown>;
}

export interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  showTooltip?: boolean;
  onPointHover?: (point: ChartDataPoint | null) => void;
  onPointClick?: (point: ChartDataPoint) => void;
  className?: string;
  formatValue?: (value: number) => string;
  color?: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  title,
  height = 300,
  showTooltip = true,
  onPointHover,
  onPointClick,
  className = '',
  formatValue = value => `R$ ${(value / 100).toFixed(2)}`,
  color = '#3B82F6',
}) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<ChartDataPoint | null>(
    null
  );
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const maxValue = Math.max(...data.map(d => Math.abs(d.value)));
  const minValue = Math.min(...data.map(d => d.value));

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handlePointHover = (point: ChartDataPoint | null) => {
    setHoveredPoint(point);
    onPointHover?.(point);
  };

  const getYPosition = (value: number): number => {
    const range = maxValue - minValue;
    const normalizedValue = (value - minValue) / range;
    return height - 40 - normalizedValue * (height - 80);
  };

  const getXPosition = (index: number): number => {
    const padding = 40;
    const chartWidth = 800 - padding * 2;
    return padding + index * (chartWidth / (data.length - 1 || 1));
  };

  return (
    <div className={`relative ${className}`}>
      {title && (
        <h3 className='text-lg font-semibold mb-4 text-gray-900'>{title}</h3>
      )}

      <svg
        width='800'
        height={height}
        className='border border-gray-200 rounded-lg bg-white'
        onMouseMove={handleMouseMove}
        onMouseLeave={() => handlePointHover(null)}
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id='grid'
            width='40'
            height='40'
            patternUnits='userSpaceOnUse'
          >
            <path
              d='M 40 0 L 0 0 0 40'
              fill='none'
              stroke='#f3f4f6'
              strokeWidth='1'
            />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#grid)' />

        {/* Zero line */}
        {minValue < 0 && (
          <line
            x1='40'
            y1={getYPosition(0)}
            x2='760'
            y2={getYPosition(0)}
            stroke='#6B7280'
            strokeWidth='2'
            strokeDasharray='5,5'
          />
        )}

        {/* Data line */}
        {data.length > 1 && (
          <polyline
            fill='none'
            stroke={color}
            strokeWidth='3'
            points={data
              .map(
                (point, index) =>
                  `${getXPosition(index)},${getYPosition(point.value)}`
              )
              .join(' ')}
          />
        )}

        {/* Data points */}
        {data.map((point, index) => (
          <circle
            key={index}
            cx={getXPosition(index)}
            cy={getYPosition(point.value)}
            r={hoveredPoint === point ? 8 : 6}
            fill={color}
            stroke='white'
            strokeWidth='2'
            className='cursor-pointer hover:r-8'
            onMouseEnter={() => handlePointHover(point)}
            onClick={() => onPointClick?.(point)}
          />
        ))}

        {/* X-axis labels */}
        {data.map((point, index) => (
          <text
            key={`label-${index}`}
            x={getXPosition(index)}
            y={height - 10}
            textAnchor='middle'
            className='text-xs fill-gray-600'
          >
            {point.label}
          </text>
        ))}

        {/* Y-axis labels */}
        {[minValue, (minValue + maxValue) / 2, maxValue].map((value, index) => (
          <text
            key={`y-label-${index}`}
            x='10'
            y={getYPosition(value) + 5}
            textAnchor='start'
            className='text-xs fill-gray-600'
          >
            {formatValue(value)}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div
          className='absolute z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full'
          style={{
            left: mousePosition.x - 400, // Adjust for chart container position
            top: mousePosition.y - 300,
          }}
        >
          <div className='text-sm font-medium'>{hoveredPoint.label}</div>
          <div className='text-sm'>{formatValue(hoveredPoint.value)}</div>
          {hoveredPoint.metadata && (
            <div className='text-xs mt-1 text-gray-300'>
              {Object.entries(hoveredPoint.metadata).map(([key, value]) => (
                <div key={key}>
                  {key}: {String(value)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
