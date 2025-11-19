'use client';

import { useState, useTransition } from 'react';
import { aiChatAction } from '@/presentation/actions';
import { AiChatMessage } from '@/domain/models';

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
        setFeedback({
          type: 'success',
          message: 'Resposta recebida com sucesso!',
        });
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
    <div className='space-y-6'>
      <div className='space-y-3 max-h-96 overflow-y-auto'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className='text-sm'>{message.content}</p>
              <p className='text-xs opacity-70 mt-1'>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

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
