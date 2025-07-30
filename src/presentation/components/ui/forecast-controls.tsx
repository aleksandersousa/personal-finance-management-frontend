import React from 'react';
import { Button, Select } from '@/presentation/components/ui';

export interface ForecastControlsProps {
  period: 3 | 6 | 12;
  includeVariableProjections: boolean;
  confidenceThreshold: 'HIGH' | 'MEDIUM' | 'LOW';
  onPeriodChange: (period: 3 | 6 | 12) => void;
  onIncludeVariableChange: (include: boolean) => void;
  onConfidenceChange: (threshold: 'HIGH' | 'MEDIUM' | 'LOW') => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const ForecastControls: React.FC<ForecastControlsProps> = ({
  period,
  includeVariableProjections,
  confidenceThreshold,
  onPeriodChange,
  onIncludeVariableChange,
  onConfidenceChange,
  onRefresh,
  isLoading = false,
  className = '',
}) => {
  const periodOptions = [
    { value: '3', label: '3 meses' },
    { value: '6', label: '6 meses' },
    { value: '12', label: '12 meses' },
  ];

  const confidenceOptions = [
    { value: 'HIGH', label: 'Alta confiança' },
    { value: 'MEDIUM', label: 'Média confiança' },
    { value: 'LOW', label: 'Baixa confiança' },
  ];

  return (
    <div
      className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      <div className='flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6'>
        {/* Period Selection */}
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Período de previsão
          </label>
          <Select
            value={period.toString()}
            onValueChange={value =>
              onPeriodChange(parseInt(value) as 3 | 6 | 12)
            }
            options={periodOptions}
            className='w-full'
          />
        </div>

        {/* Confidence Threshold */}
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Nível de confiança
          </label>
          <Select
            value={confidenceThreshold}
            onValueChange={value =>
              onConfidenceChange(value as 'HIGH' | 'MEDIUM' | 'LOW')
            }
            options={confidenceOptions}
            className='w-full'
          />
        </div>

        {/* Variable Projections Toggle */}
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Opções
          </label>
          <div className='flex items-center space-x-2 h-10'>
            <input
              type='checkbox'
              id='includeVariable'
              checked={includeVariableProjections}
              onChange={e => onIncludeVariableChange(e.target.checked)}
              className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <label htmlFor='includeVariable' className='text-sm text-gray-700'>
              Incluir projeções variáveis
            </label>
          </div>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <div className='flex-shrink-0'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              &nbsp;
            </label>
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              variant='secondary'
              className='h-10'
            >
              {isLoading ? (
                <div className='flex items-center space-x-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                  <span>Atualizando...</span>
                </div>
              ) : (
                'Atualizar'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className='mt-4 text-xs text-gray-500'>
        <p>
          • <strong>Projeções variáveis:</strong> Include estimativas baseadas
          em gastos históricos variáveis
        </p>
        <p>
          • <strong>Nível de confiança:</strong> Determina quais entradas
          incluir com base na consistência histórica
        </p>
      </div>
    </div>
  );
};
