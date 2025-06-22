import React from 'react';
import { EntryFormWithFeedback } from '@/presentation/components/client/entry-form-with-feedback';
import { FormValidator } from '@/presentation/protocols/form-validator';
import { EntryFormData } from '@/infra/validation/entry-form-schema';

interface AddEntryPageProps {
  validator: FormValidator<EntryFormData>;
  onSubmit: (data: EntryFormData) => Promise<void>;
}

export const AddEntryPage: React.FC<AddEntryPageProps> = ({
  validator,
  onSubmit,
}) => {
  return (
    <div className='min-h-screen bg-slate-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>
            Adicionar Nova Entrada
          </h1>
          <p className='text-slate-600'>
            Registre suas receitas e despesas para manter o controle financeiro
          </p>
        </div>

        {/* Main Form Card */}
        <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
          <EntryFormWithFeedback validator={validator} onSubmit={onSubmit} />
        </div>

        {/* Help Section */}
        <div className='mt-8 bg-cyan-50 rounded-xl p-6'>
          <h2 className='text-lg font-semibold text-slate-900 mb-4'>
            💡 Dicas para categorizar suas entradas
          </h2>
          <div className='grid md:grid-cols-2 gap-4 text-sm text-slate-700'>
            <div>
              <h3 className='font-medium text-slate-900 mb-2'>Receitas</h3>
              <ul className='space-y-1'>
                <li>• Salário: renda mensal fixa</li>
                <li>• Freelance: trabalhos extras</li>
                <li>• Investimentos: dividendos e juros</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium text-slate-900 mb-2'>Despesas</h3>
              <ul className='space-y-1'>
                <li>• Alimentação: mercado, restaurantes</li>
                <li>• Transporte: combustível, passagens</li>
                <li>• Lazer: entretenimento, hobbies</li>
              </ul>
            </div>
          </div>
          <div className='mt-4 p-3 bg-white rounded-lg border border-cyan-200'>
            <p className='text-sm text-slate-700'>
              <strong>Entradas fixas:</strong> Marque como &quot;fixa&quot;
              despesas recorrentes como aluguel, internet e salário. Isso
              melhora suas projeções futuras.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mt-6 flex flex-col sm:flex-row gap-3 justify-center'>
          <a
            href='/entries'
            className='inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors'
          >
            📋 Ver Todas as Entradas
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
};
