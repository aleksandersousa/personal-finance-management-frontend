import React from 'react';
import { loadCategoriesAction } from '@/presentation/actions';
import {
  Button,
  CategoriesFilters,
  CategoryListItem,
} from '@/presentation/components';
import { Pagination, SnackbarHandler } from '../components/client';
import { ErrorReloadButton } from '@/presentation/components/error-reload-button';
import { isRedirectError } from '../helpers';
import Link from 'next/link';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';

type Props = {
  searchParams: Record<string, string>;
};

export const CategoriesListPage: React.FC<Props> = async ({ searchParams }) => {
  try {
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 5;

    const result = await loadCategoriesAction({
      type: searchParams.type as 'INCOME' | 'EXPENSE' | 'all' | undefined,
      includeStats: true,
      page,
      limit,
      search: searchParams.search,
    });

    const hasActiveFilters = Boolean(
      (searchParams.type && searchParams.type !== 'all') ||
        (searchParams.search && searchParams.search.trim() !== '')
    );

    const filteredCategories = result.data;
    const contentInfo =
      searchParams.type === 'INCOME' ? 'receitas' : 'despesas';

    return (
      <div className='min-h-screen bg-background-secondary pt-20 pb-20 lg:pb-8'>
        <SnackbarHandler />

        <div className='flex justify-center sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border flex flex-col'>
            <h1 className='text-3xl font-bold text-foreground mb-8 text-center'>
              Categorias
            </h1>

            <CategoriesFilters
              showHeader={filteredCategories.length > 0}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>

        <div className='flex justify-center px-3 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            {filteredCategories.length === 0 ? (
              <div className='text-center py-12'>
                <div className='w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-2xl flex items-center justify-center'>
                  <span className='text-4xl'>📂</span>
                </div>
                <h3 className='text-xl font-bold text-foreground mb-3'>
                  Nenhuma categoria encontrada
                </h3>
                <p className='text-foreground opacity-80 mb-8 max-w-md mx-auto'>
                  {searchParams.type && searchParams.type !== 'all'
                    ? `Não há categorias de ${contentInfo}.`
                    : 'Comece criando suas primeiras categorias para organizar suas finanças.'}
                </p>
                <Button
                  variant='primary'
                  className='flex-1 h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
                >
                  <PlusIcon className='w-5 h-5 sm:w-4 sm:h-4' />
                  <Link href='/categories/add'>Criar Primeira Categoria</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className='divide-y divide-neutral-200'>
                  {filteredCategories.map(category => (
                    <CategoryListItem
                      key={category.id}
                      category={category}
                      showActions={!category.isDefault}
                    />
                  ))}
                </div>

                {result.pagination && (
                  <div className='mt-8'>
                    <Pagination
                      currentPage={result.pagination.page}
                      totalPages={result.pagination.totalPages}
                      totalItems={result.pagination.total}
                      currentLimit={result.pagination.limit}
                    />
                  </div>
                )}
              </>
            )}
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
      <div className='min-h-screen bg-neutral-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            <div className='bg-white rounded-3xl shadow-md border border-neutral-200 p-6 sm:p-8'>
              <div className='flex flex-col items-center justify-center text-center py-16'>
                <div className='w-24 h-24 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center'>
                  <span className='text-5xl'>⚠️</span>
                </div>
                <h2 className='text-2xl font-bold text-neutral-900 mb-3'>
                  Erro ao carregar categorias
                </h2>
                <p className='text-neutral-600 mb-8 max-w-md leading-relaxed'>
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
