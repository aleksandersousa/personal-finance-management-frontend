import React from 'react';
import {
  loadCategoriesAction,
  deleteCategoryAction,
} from '@/presentation/actions';
import { CategoryListItemWithModal } from '@/presentation/components/client';
import { CategoriesFilters } from '@/presentation/components';
import { ErrorReloadButton } from '@/presentation/components/error-reload-button';
import Link from 'next/link';

type Props = {
  searchParams: Record<string, string>;
};

export const CategoriesListPage: React.FC<Props> = async ({ searchParams }) => {
  try {
    const result = await loadCategoriesAction({
      type: searchParams.type as 'INCOME' | 'EXPENSE' | 'all' | undefined,
      includeStats: true,
    });

    // Check if there are active filters (only 'type' is supported by API)
    const hasActiveFilters = Boolean(
      searchParams.type && searchParams.type !== 'all'
    );

    // Filter categories based on supported search params
    const filteredCategories = result.data;

    return (
      <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            {/* Main Content */}
            <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
              {/* Filters */}
              <CategoriesFilters
                totalResults={filteredCategories.length}
                showHeader={filteredCategories.length > 0}
                hasActiveFilters={hasActiveFilters}
              />
              {filteredCategories.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                  <div className='text-6xl mb-4'>📂</div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Nenhuma categoria encontrada
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    {searchParams.type && searchParams.type !== 'all'
                      ? `Não há categorias de ${searchParams.type === 'INCOME' ? 'receitas' : 'despesas'}.`
                      : 'Comece criando suas primeiras categorias para organizar suas finanças.'}
                  </p>
                  <Link
                    href='/categories/add'
                    className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <span className='text-lg'>+</span>
                    Criar Primeira Categoria
                  </Link>
                </div>
              ) : (
                <>
                  <div className='divide-y'>
                    {filteredCategories.map(category => (
                      <CategoryListItemWithModal
                        key={category.id}
                        category={category}
                        onDelete={deleteCategoryAction}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    return (
      <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
              <div className='flex flex-col items-center justify-center text-center py-12'>
                <div className='text-6xl mb-6'>⚠️</div>
                <h2 className='text-2xl font-bold text-red-600 mb-4'>
                  Erro ao carregar categorias
                </h2>
                <p className='text-gray-600 mb-8 max-w-md'>
                  Ocorreu um erro inesperado ao carregar suas categorias.
                  Verifique sua conexão e tente novamente.
                </p>
                <ErrorReloadButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
