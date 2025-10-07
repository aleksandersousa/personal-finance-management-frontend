import React from 'react';
import { CategoryBreakdownItemModel } from '@/domain/models/monthly-summary';
import { ChartBarIcon } from '@phosphor-icons/react/dist/ssr';

export interface CategoryBreakdownProps {
  categories: CategoryBreakdownItemModel[];
  type: 'INCOME' | 'EXPENSE';
  title: string;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  type,
  title,
}) => {
  const filteredCategories = categories.filter(cat => cat.type === type);
  const total = filteredCategories.reduce((sum, cat) => sum + cat.total, 0);

  const formatCurrency = (amount: number) => {
    return `R$ ${(amount / 100).toFixed(2).replace('.', ',')}`;
  };

  const getPercentage = (amount: number) => {
    if (total === 0) return 0;
    return (amount / total) * 100;
  };

  const getProgressColor = () => {
    return type === 'INCOME' ? 'bg-green-400' : 'bg-red-400';
  };

  const getProgressBgColor = () => {
    return type === 'INCOME' ? 'bg-green-100' : 'bg-red-100';
  };

  if (filteredCategories.length === 0) {
    return (
      <div className='bg-white rounded-xl border border-slate-200 p-6'>
        <h3 className='text-lg font-semibold text-slate-900 mb-4'>{title}</h3>
        <div className='text-center text-slate-500 py-8'>
          <ChartBarIcon
            className='w-12 h-12 mx-auto mb-4 text-slate-300'
            weight='thin'
          />
          <p>Nenhuma {type === 'INCOME' ? 'receita' : 'despesa'} encontrada</p>
        </div>
      </div>
    );
  }

  // Ordenar categorias por valor (maior para menor)
  const sortedCategories = [...filteredCategories].sort(
    (a, b) => b.total - a.total
  );

  return (
    <div className='bg-white rounded-xl border border-slate-200 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
        <div
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            type === 'INCOME'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {formatCurrency(total)}
        </div>
      </div>

      <div className='space-y-4'>
        {sortedCategories.map(category => {
          const percentage = getPercentage(category.total);

          return (
            <div key={category.categoryId} className='space-y-2'>
              {/* Category header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <span className='font-medium text-slate-900'>
                    {category.categoryName}
                  </span>
                  <span className='text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full'>
                    {category.count}{' '}
                    {category.count === 1 ? 'entrada' : 'entradas'}
                  </span>
                </div>
                <div className='text-right'>
                  <div
                    className={`font-semibold ${
                      type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(category.total)}
                  </div>
                  <div className='text-xs text-slate-500'>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div
                className={`w-full h-2 rounded-full ${getProgressBgColor()}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
