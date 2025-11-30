'use client';

import { useState, useTransition } from 'react';
import { aiChatAction } from '@/presentation/actions';
import { AiChatMessage } from '@/domain/models';
import { PaperPlaneRightIcon } from '@phosphor-icons/react';

export function AiChatContainer() {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (question: string) => {
    setFeedback({ type: null, message: '' });

    const userMessage: AiChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    startTransition(async () => {
      try {
        const response = await aiChatAction({ question });
        const assistantMessage: AiChatMessage = {
          role: 'assistant',
          content: response?.answer ?? '',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setFeedback({ type: null, message: '' });
      } catch (error) {
        console.error(error);
        const errorMessage: AiChatMessage = {
          role: 'assistant',
          content:
            'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setFeedback({
          type: 'error',
          message: 'Erro ao obter resposta. Tente novamente.',
        });
      }
    });
  };

  return (
    <div className='flex flex-col gap-4 flex-1 min-h-0'>
      <div className='space-y-3 flex-1 overflow-y-auto min-h-0 px-2 py-4 rounded-xl'>
        {messages.length === 0 ? (
          <div className='flex items-center justify-center h-full text-neutral-400 text-sm'>
            Nenhuma mensagem ainda. Comece a conversar!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-success text-white rounded-tr-md'
                    : 'bg-neutral-200 text-neutral-900 rounded-tl-md'
                }`}
              >
                <p className='text-sm leading-relaxed'>{message.content}</p>
                <p className='text-xs opacity-60 mt-1 text-right'>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {feedback.type === 'error' && (
        <div className='p-3 rounded-lg shrink-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm'>
          {feedback.message}
        </div>
      )}

      <div className='shrink-0'>
        <AiChatForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}

interface AiChatFormProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

function AiChatForm({ onSubmit, isLoading }: AiChatFormProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
      setQuestion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex items-end gap-2'>
      <div className='flex-1 bg-background-secondary rounded-full border border-border-foreground px-4 py-2 flex items-center shadow-sm'>
        <input
          type='text'
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder='Digite sua mensagem...'
          className='flex-1 bg-transparent outline-none text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400'
          disabled={isLoading}
        />
      </div>
      <button
        type='submit'
        disabled={isLoading || !question.trim()}
        className='size-10 rounded-full bg-success hover:bg-success/90 disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-sm shrink-0'
        aria-label='Enviar mensagem'
      >
        {isLoading ? (
          <div className='size-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
        ) : (
          <PaperPlaneRightIcon
            className='size-5 text-neutral-0'
            weight='fill'
          />
        )}
      </button>
    </form>
  );
}
