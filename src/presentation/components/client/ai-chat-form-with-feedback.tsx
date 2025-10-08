'use client';

import { useState, useTransition } from 'react';
import { aiChatAction } from '@/presentation/actions';
import { AiChatMessage } from '@/domain/models';

export interface AiChatFormWithFeedbackProps {
  onMessageSent: (message: AiChatMessage) => void;
}

export function AiChatFormWithFeedback({
  onMessageSent,
}: AiChatFormWithFeedbackProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (question: string) => {
    setFeedback({ type: null, message: '' });

    // Add user message immediately
    onMessageSent({
      role: 'user',
      content: question,
      timestamp: new Date(),
    });

    startTransition(async () => {
      try {
        const response = await aiChatAction({ question });
        onMessageSent({
          role: 'assistant',
          content: response?.answer ?? '',
          timestamp: new Date(),
        });
        setFeedback({
          type: 'success',
          message: 'Resposta recebida com sucesso!',
        });
      } catch (error) {
        console.error(error);
        onMessageSent({
          role: 'assistant',
          content:
            'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
          timestamp: new Date(),
        });
        setFeedback({
          type: 'error',
          message: 'Erro ao obter resposta. Tente novamente.',
        });
      }
    });
  };

  return (
    <div className='space-y-4'>
      {feedback.type && (
        <div
          className={`p-4 rounded-lg ${
            feedback.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <AiChatForm onSubmit={handleSubmit} isLoading={isPending} />
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
    <form onSubmit={handleSubmit} className='flex gap-2'>
      <input
        type='text'
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder='Pergunte: Quanto tenho que pagar ainda este mês?'
        className='flex-1 border px-3 py-2 rounded'
        disabled={isLoading}
      />
      <button
        type='submit'
        disabled={isLoading || !question.trim()}
        className='px-4 py-2 bg-black text-white rounded disabled:opacity-50'
      >
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
