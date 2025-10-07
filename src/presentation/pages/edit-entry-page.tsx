import React from 'react';
import { EditEntryFormWithFeedbackFactory } from '@/main/factories/components';
import { EntryModel } from '@/domain/models/entry';

export interface EditEntryPageProps {
  entry: EntryModel;
}

export const EditEntryPage: React.FC<EditEntryPageProps> = ({ entry }) => {
  return (
    <div className='min-h-screen bg-slate-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>
            Editar Entrada
          </h1>
          <p className='text-slate-600'>
            Atualize os dados da sua entrada financeira
          </p>
        </div>

        {/* Main Form Card */}
        <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
          <EditEntryFormWithFeedbackFactory entry={entry} />
        </div>

        {/* Help Section */}
        <div className='mt-8 bg-cyan-50 rounded-xl p-6'>
          <h2 className='text-lg font-semibold text-slate-900 mb-4'>
            ⚠️ Importante sobre edições
          </h2>
          <div className='space-y-3 text-sm text-slate-700'>
            <div className='p-3 bg-white rounded-lg border border-cyan-200'>
              <p>
                <strong>Entradas fixas:</strong> Alterar uma entrada de fixa
                para variável (ou vice-versa) afetará suas projeções de fluxo de
                caixa futuras.
              </p>
            </div>
            <div className='p-3 bg-white rounded-lg border border-cyan-200'>
              <p>
                <strong>Categorias:</strong> Mudanças de categoria podem
                impactar relatórios e análises por categoria.
              </p>
            </div>
            <div className='p-3 bg-white rounded-lg border border-cyan-200'>
              <p>
                <strong>Valores e datas:</strong> Alterações são refletidas
                imediatamente nos resumos mensais e cálculos de saldo.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mt-6 flex flex-col sm:flex-row gap-3 justify-center'>
          <a
            href='/entries'
            className='inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors'
          >
            ← Voltar para Lista
          </a>

          <a
            href='/entries/add'
            className='inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors'
          >
            ➕ Nova Entrada
          </a>

          <a
            href='/summary'
            className='inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors'
          >
            📈 Ver Resumo
          </a>
        </div>
      </div>
    </div>
  );
};
