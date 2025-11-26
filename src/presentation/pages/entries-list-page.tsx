import React from 'react';
import { loadEntriesByMonthAction } from '@/presentation/actions';
import { EntryListItem } from '@/presentation/components/client';
import { Pagination } from '../components/client';
import { Card, EntriesFilters } from '@/presentation/components';
import { ErrorReloadButton } from '@/presentation/components/error-reload-button';
import Link from 'next/link';
import { EntriesCache } from '@/presentation/components/entries-cache';
import { isRedirectError } from '@/presentation/helpers';

type Props = {
  searchParams: Record<string, string>;
};

export const EntriesListPage: React.FC<Props> = async ({ searchParams }) => {
  try {
    const result = await loadEntriesByMonthAction(searchParams);

    const entries = result.data;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const hasActiveFilters = Boolean(
      (searchParams.month && searchParams.month !== currentMonth) ||
        (searchParams.type && searchParams.type !== 'all') ||
        (searchParams.category && searchParams.category !== 'all') ||
        (searchParams.sort && searchParams.sort !== 'date') ||
        (searchParams.order && searchParams.order !== 'desc') ||
        (searchParams.search && searchParams.search.trim() !== '')
    );
    const contentInfo =
      searchParams.type === 'INCOME' ? 'receitas' : 'despesas';

    return (
      <div className='min-h-screen bg-slate-50 pt-17 pb-20 lg:pb-8'>
        <EntriesCache entries={entries} />

        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            <Card className='rounded-3xl p-6 sm:p-8'>
              <EntriesFilters
                currentMonth={
                  searchParams.month || new Date().toISOString().slice(0, 7)
                }
                totalResults={entries.length}
                showHeader={entries.length > 0}
                hasActiveFilters={hasActiveFilters}
              />

              {entries.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-4xl'>📝</span>
                  </div>
                  <h3 className='text-xl font-bold text-slate-900 mb-3'>
                    Nenhuma entrada encontrada
                  </h3>
                  <p className='text-slate-600 mb-8 max-w-md mx-auto'>
                    {searchParams.type && searchParams.type !== 'all'
                      ? `Não há ${contentInfo} para este mês.`
                      : 'Comece adicionando suas primeiras entradas financeiras.'}
                  </p>
                  <Link
                    href='/entries/add'
                    className='inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-semibold shadow-md hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250'
                  >
                    <span className='text-xl font-bold'>+</span>
                    Adicionar Primeira Entrada
                  </Link>
                </div>
              ) : (
                <>
                  <div className='divide-y divide-slate-200'>
                    {entries.map(entry => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </div>

                  <div className='mt-8'>
                    <Pagination
                      currentPage={result.pagination.page}
                      totalPages={result.pagination.totalPages}
                      totalItems={result.pagination.total}
                      currentLimit={result.pagination.limit}
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Error loading entries:', error);
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
                  Erro ao carregar entradas
                </h2>
                <p className='text-slate-600 mb-8 max-w-md leading-relaxed'>
                  Ocorreu um erro inesperado ao carregar suas entradas.
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
