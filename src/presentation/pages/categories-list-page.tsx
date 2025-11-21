import React from 'react';
import { loadCategoriesAction } from '@/presentation/actions';
import { CategoriesFilters, CategoryListItem } from '@/presentation/components';
import { ErrorReloadButton } from '@/presentation/components/error-reload-button';
import { isRedirectError } from '../helpers';
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

    const hasActiveFilters = Boolean(
      searchParams.type && searchParams.type !== 'all'
    );

    const filteredCategories = result.data;
    const contentInfo =
      searchParams.type === 'INCOME' ? 'receitas' : 'despesas';

    return (
      <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            <div className='bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8'>
              <CategoriesFilters
                totalResults={filteredCategories.length}
                showHeader={filteredCategories.length > 0}
                hasActiveFilters={hasActiveFilters}
              />

              {filteredCategories.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-4xl'>📂</span>
                  </div>
                  <h3 className='text-xl font-bold text-slate-900 mb-3'>
                    Nenhuma categoria encontrada
                  </h3>
                  <p className='text-slate-600 mb-8 max-w-md mx-auto'>
                    {searchParams.type && searchParams.type !== 'all'
                      ? `Não há categorias de ${contentInfo}.`
                      : 'Comece criando suas primeiras categorias para organizar suas finanças.'}
                  </p>
                  <Link
                    href='/categories/add'
                    className='inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-semibold shadow-md hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250'
                  >
                    <span className='text-xl font-bold'>+</span>
                    Criar Primeira Categoria
                  </Link>
                </div>
              ) : (
                <>
                  <div className='divide-y divide-slate-200'>
                    {filteredCategories.map(category => (
                      <CategoryListItem
                        key={category.id}
                        category={category}
                        showActions={!category.isDefault}
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
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Error loading categories:', error);
    return (
      <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            <div className='bg-white rounded-3xl shadow-md border border-slate-200 p-6 sm:p-8'>
              <div className='flex flex-col items-center justify-center text-center py-16'>
                <div className='w-24 h-24 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center'>
                  <span className='text-5xl'>⚠️</span>
                </div>
                <h2 className='text-2xl font-bold text-slate-900 mb-3'>
                  Erro ao carregar categorias
                </h2>
                <p className='text-slate-600 mb-8 max-w-md leading-relaxed'>
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
