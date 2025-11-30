import React from 'react';
import { AiChatContainer } from '@/presentation/components/client';

export const AiChatPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-background-secondary pt-20 lg:pb-8'>
      <div className='flex justify-center px-4 sm:px-6 lg:px-8 lg:ml-64 h-[calc(100vh-11.225rem)] lg:h-[calc(100vh-7rem)]'>
        <div className='w-full max-w-4xl box-border flex flex-col'>
          <div className='mb-6 shrink-0 text-center'>
            <h1 className='text-2xl font-bold text-foreground mb-2'>
              Assistente Financeiro (AI)
            </h1>
            <p className='text-foreground'>
              Faça perguntas sobre suas finanças em linguagem natural
            </p>
          </div>

          <div className='rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-0 overflow-hidden'>
            <AiChatContainer />
          </div>
        </div>
      </div>
    </div>
  );
};
