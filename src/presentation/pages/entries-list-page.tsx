import React from 'react';
import {
  loadEntriesByMonthAction,
  handleDeleteEntryAction,
} from '@/presentation/actions';
import { EntryListItemWithModal } from '@/presentation/components/client';
import { Pagination } from '../components/client';

type Props = {
  searchParams: Record<string, string>;
};

export const EntriesListPage: React.FC<Props> = async ({ searchParams }) => {
  try {
    const result = await loadEntriesByMonthAction(searchParams);

    return (
      <div className='min-h-screen bg-slate-50 py-8 pb-20 lg:pb-8'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-64'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 mb-2'>
              Entradas do Mês
            </h1>
            <p className='text-slate-600'>
              Visualize e gerencie todas as suas receitas e despesas
            </p>
          </div>

          {/* Main Content */}
          <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
            {result.data.length === 0 ? (
              <div className='text-center text-gray-400 py-8'>
                Nenhuma entrada encontrada.
              </div>
            ) : (
              <>
                <div className='mb-4'>
                  <h2 className='text-xl font-bold mb-4'>Entradas do mês</h2>
                  {/* TODO: Adicionar filtros aqui */}
                </div>

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
                  <Pagination
                    currentPage={result.meta.page}
                    totalPages={result.meta.totalPages}
                  />
                )}
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className='mt-6 flex flex-col sm:flex-row gap-3 justify-center'>
            <a
              href='/entries/add'
              className='inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors'
            >
              ➕ Adicionar Nova Entrada
            </a>

            <a
              href='/summary'
              className='inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors'
            >
              📈 Ver Resumo Mensal
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading entries:', error);
    return (
      <div className='min-h-screen bg-slate-50 py-8 pb-20 lg:pb-8'>
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
