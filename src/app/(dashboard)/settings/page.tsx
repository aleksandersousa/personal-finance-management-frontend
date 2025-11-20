import { PageLoading } from '@/presentation/components';
import { Suspense } from 'react';

export default function SettingsPage() {
  return (
    <Suspense fallback={<PageLoading text='Carregando configurações...' />}>
      <div className='flex items-center justify-center h-screen text-2xl font-bold'>
        Página ainda em construção 🚧
      </div>
    </Suspense>
  );
}
