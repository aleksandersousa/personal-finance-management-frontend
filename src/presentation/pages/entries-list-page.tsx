import React from 'react';
import {
  loadEntriesByMonthAction,
  handleDeleteEntryAction,
} from '@/presentation/actions';
import { EntryListItemWithModal } from '@/presentation/components/client';
import { Pagination } from '../components/client';
import { EntriesFilters } from '@/presentation/components';
import Link from 'next/link';

type Props = {
  searchParams: Record<string, string>;
};

export const EntriesListPage: React.FC<Props> = async ({ searchParams }) => {
  try {
    const result = await loadEntriesByMonthAction(searchParams);

    return (
      <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='w-full max-w-4xl box-border'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-slate-900 mb-2'>
                Entradas do Mês
              </h1>
              <p className='text-slate-600'>
                Visualize e gerencie todas as suas receitas e despesas
              </p>
            </div>

            {/* Filters */}
            <EntriesFilters
              currentMonth={
                searchParams.month || new Date().toISOString().slice(0, 7)
              }
              totalResults={result.data.length}
              showHeader={result.data.length > 0}
            />

            {/* Main Content */}
            <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
              {result.data.length === 0 ? (
                <div className='text-center text-gray-400 py-8'>
                  <div className='text-6xl mb-4'>📝</div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Nenhuma entrada encontrada
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    {searchParams.type && searchParams.type !== 'all'
                      ? `Não há ${searchParams.type === 'INCOME' ? 'receitas' : 'despesas'} para este mês.`
                      : 'Comece adicionando suas primeiras entradas financeiras.'}
                  </p>
                  <Link
                    href='/entries/add'
                    className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <span className='text-lg'>+</span>
                    Adicionar Primeira Entrada
                  </Link>
                </div>
              ) : (
                <>
                  <div className='divide-y'>
                    {result.data.map(entry => (
                      <EntryListItemWithModal
                        key={entry.id}
                        entry={entry}
                        onDelete={handleDeleteEntryAction}
                      />
                    ))}
                  </div>

                  {result.meta.totalPages > 1 && (
                    <div className='mt-6'>
                      <Pagination
                        currentPage={result.meta.page}
                        totalPages={result.meta.totalPages}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading entries:', error);
    return (
      <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-64'>
          <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
            <div className='text-center text-red-500 py-8'>
              Erro ao carregar entradas. Tente novamente.
            </div>
          </div>
        </div>
      </div>
    );
  }
};
