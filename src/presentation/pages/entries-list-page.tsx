import React from 'react';
import { loadEntriesByMonthAction } from '@/presentation/actions';
import {
  EntryListItem,
  SnackbarHandler,
} from '@/presentation/components/client';
import { Pagination } from '../components/client';
import { Button, EntriesFilters } from '@/presentation/components';
import { ErrorReloadButton } from '@/presentation/components/error-reload-button';
import Link from 'next/link';
import { EntriesCache } from '@/presentation/components/entries-cache';
import { isRedirectError } from '@/presentation/helpers';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';

type Props = {
  searchParams: Record<string, string>;
};

export const EntriesListPage: React.FC<Props> = async ({ searchParams }) => {
  try {
    const result = await loadEntriesByMonthAction(searchParams);

    const entries = result.data;

    const currentMonth = new Date().toISOString().slice(0, 7);

    const selectedMonth = searchParams.month || currentMonth;
    const [selectedYear, selectedMonthNum] = selectedMonth
      .split('-')
      .map(Number);
    const hasActiveFilters = Boolean(
      (searchParams.month && searchParams.month !== currentMonth) ||
        (searchParams.type && searchParams.type !== 'all') ||
        (searchParams.category && searchParams.category !== 'all') ||
        (searchParams.sort && searchParams.sort !== 'date') ||
        (searchParams.order && searchParams.order !== 'desc') ||
        (searchParams.search && searchParams.search.trim() !== '') ||
        (searchParams.isPaid && searchParams.isPaid !== 'all')
    );
    const contentInfo =
      searchParams.type === 'INCOME' ? 'receitas' : 'despesas';

    return (
      <div className='min-h-screen w-full bg-background-secondary pt-20 pb-20 lg:pb-8'>
        <SnackbarHandler />
        <EntriesCache entries={entries} />

        <div className='flex justify-center sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border flex flex-col'>
            <h1 className='text-3xl font-bold text-foreground mb-8 text-center'>
              Entradas do mês
            </h1>

            <EntriesFilters
              currentMonth={
                searchParams.month || new Date().toISOString().slice(0, 7)
              }
              showHeader={true}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>

        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            {entries.length === 0 ? (
              <div className='text-center py-12'>
                <div className='w-20 h-20 mx-auto mb-6 bg-neutral-100 rounded-2xl flex items-center justify-center'>
                  <span className='text-4xl'>📝</span>
                </div>

                <h3 className='text-xl font-bold text-foreground mb-3'>
                  Nenhuma entrada encontrada
                </h3>
                <p className='text-foreground opacity-80 mb-8 max-w-md mx-auto'>
                  {hasActiveFilters
                    ? 'Nenhuma entrada encontrada com os filtros aplicados. Tente ajustar os filtros ou limpar para ver todas as entradas.'
                    : 'Comece adicionando suas primeiras entradas financeiras.'}
                </p>

                <Button
                  variant='primary'
                  className='flex-1 h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-250'
                >
                  <PlusIcon className='w-5 h-5 sm:w-4 sm:h-4' />
                  <Link href='/entries/add'>Adicionar Primeira Entrada</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className='divide-y divide-neutral-200'>
                  {entries.map(entry => (
                    <EntryListItem
                      key={entry.id}
                      entry={entry}
                      currentYear={selectedYear}
                      currentMonth={selectedMonthNum}
                    />
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
      <div className='min-h-screen bg-neutral-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            <div className='bg-white rounded-3xl shadow-md border border-neutral-200 p-6 sm:p-8'>
              <div className='flex flex-col items-center justify-center text-center py-16'>
                <div className='w-24 h-24 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center'>
                  <span className='text-5xl'>⚠️</span>
                </div>
                <h2 className='text-2xl font-bold text-neutral-900 mb-3'>
                  Erro ao carregar entradas
                </h2>
                <p className='text-neutral-600 mb-8 max-w-md leading-relaxed'>
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
