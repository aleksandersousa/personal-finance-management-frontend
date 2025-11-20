import React from 'react';
import { CategoryBreakdownItemModel } from '@/domain/models/monthly-summary';
import { ChartBarIcon } from '@phosphor-icons/react/dist/ssr';
import { Card, CardHeader, CardTitle, CardContent } from './card';

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
    return type === 'INCOME' ? 'bg-emerald-500' : 'bg-red-500';
  };

  const getProgressBgColor = () => {
    return type === 'INCOME' ? 'bg-emerald-50' : 'bg-red-50';
  };

  if (filteredCategories.length === 0) {
    return (
      <Card className='p-6'>
        <CardHeader className='mb-4'>
          <CardTitle className='text-lg font-bold text-slate-900'>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className='text-center text-slate-500 py-8'>
          <ChartBarIcon
            className='w-12 h-12 mx-auto mb-4 text-slate-300'
            weight='thin'
          />
          <p className='text-sm'>
            Nenhuma {type === 'INCOME' ? 'receita' : 'despesa'} encontrada
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar categorias por valor (maior para menor)
  const sortedCategories = [...filteredCategories].sort(
    (a, b) => b.total - a.total
  );

  return (
    <Card className='p-6'>
      <CardHeader className='flex-row items-center justify-between mb-6'>
        <CardTitle className='text-lg font-bold text-slate-900'>
          {title}
        </CardTitle>
        <div
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            type === 'INCOME'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {formatCurrency(total)}
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {sortedCategories.map((category, index) => {
          const percentage = getPercentage(category.total);

          return (
            <div
              key={
                category.categoryId ??
                `${type}-${category.categoryName}-${index}`
              }
              className='space-y-2'
            >
              {/* Category header */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold text-slate-900'>
                    {category.categoryName}
                  </span>
                  <span className='text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full'>
                    {category.count}{' '}
                    {category.count === 1 ? 'entrada' : 'entradas'}
                  </span>
                </div>
                <div className='text-right'>
                  <div
                    className={`font-bold ${
                      type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'
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
      </CardContent>
    </Card>
  );
};
