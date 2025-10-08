import React from 'react';
import { AiChatContainer } from '@/presentation/components/client';

export const AiChatPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-slate-50 pt-20 pb-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64'>
        <div className='w-full max-w-4xl box-border'>
          <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8'>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold text-slate-900 mb-2'>
                Assistente Financeiro (AI)
              </h1>
              <p className='text-slate-600'>
                Faça perguntas sobre suas finanças em linguagem natural
              </p>
            </div>

            <AiChatContainer />
          </div>
        </div>
      </div>
    </div>
  );
};
