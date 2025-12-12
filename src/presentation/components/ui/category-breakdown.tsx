import React from 'react';
import Link from 'next/link';
import { CategoryBreakdownItemModel } from '@/domain/models/monthly-summary';
import { ChartBarIcon } from '@phosphor-icons/react/dist/ssr';
import { Card, CardHeader, CardTitle, CardContent } from './card';

export interface CategoryBreakdownProps {
  categories: CategoryBreakdownItemModel[];
  type: 'INCOME' | 'EXPENSE';
  title: string;
  totalCategories: number;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  type,
  title,
  totalCategories,
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
    return type === 'INCOME' ? 'bg-success' : 'bg-error';
  };

  if (filteredCategories.length === 0) {
    return (
      <Card className='p-4'>
        <CardHeader className='mb-4'>
          <CardTitle className='text-lg text-foreground'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='text-center text-neutral-500 dark:text-gray-100 py-8'>
          <ChartBarIcon
            className='w-12 h-12 mx-auto mb-4 text-neutral-300 dark:text-gray-100'
            weight='thin'
          />
          <p className='text-sm dark:text-gray-100'>
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
    <Card className='py-6 px-4'>
      <CardHeader className='flex-row items-center justify-between mb-6'>
        <CardTitle className='text-lg text-foreground'>{title}</CardTitle>
        <div className='text-sm px-3 py-1 rounded-full text-neutral-0 bg-primary'>
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
                <div className='flex flex-col gap-1'>
                  <span className='text-foreground'>
                    {category.categoryName}
                  </span>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-neutral-500'>
                      {category.count}{' '}
                      {category.count === 1 ? 'entrada' : 'entradas'}
                    </span>
                    {type === 'EXPENSE' && category.unpaidAmount > 0 && (
                      <span className='text-xs text-warning bg-warning/10 px-2 py-0.5 rounded'>
                        A pagar: {formatCurrency(category.unpaidAmount)}
                      </span>
                    )}
                  </div>
                </div>

                <div className='text-right'>
                  <div
                    className={`${
                      type === 'INCOME' ? 'text-success-500' : 'text-error-500'
                    }`}
                  >
                    {formatCurrency(category.total)}
                  </div>
                  <div className='text-xs text-neutral-500'>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className={`w-full h-2 rounded-full bg-progress-background`}>
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>

      {totalCategories > filteredCategories.length && (
        <div className='mt-4 flex justify-end text-xs text-neutral-500'>
          <span>
            Mostrando {filteredCategories.length} de {totalCategories}{' '}
            {type === 'INCOME'
              ? 'categorias de receita'
              : 'categorias de despesa'}
            .{' '}
            <Link
              href={`/categories?type=${type}`}
              className='text-primary hover:text-primary-dark underline transition-colors'
            >
              Ver todas
            </Link>
          </span>
        </div>
      )}
    </Card>
  );
};
