import React from 'react';
import { AiChatContainer } from '@/presentation/components/client';
import { Card } from '../components';

export const AiChatPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900 pt-17 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64 h-[calc(100vh-11.225rem)] lg:h-[calc(100vh-7rem)]'>
        <div className='w-full max-w-4xl box-border flex flex-col'>
          <Card className='rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-0 overflow-hidden'>
            <div className='mb-6 shrink-0'>
              <h1 className='text-2xl font-bold text-slate-900 mb-2'>
                Assistente Financeiro (AI)
              </h1>
              <p className='text-slate-600'>
                Faça perguntas sobre suas finanças em linguagem natural
              </p>
            </div>

            <AiChatContainer />
          </Card>
        </div>
      </div>
    </div>
  );
};
