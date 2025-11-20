import { PageLoading } from '@/presentation/components';
import { Suspense } from 'react';

export default function NotificationsPage() {
  return (
    <Suspense fallback={<PageLoading text='Carregando notificações...' />}>
      <div className='flex items-center justify-center h-screen text-2xl font-bold'>
        Página ainda em construção 🚧
      </div>
    </Suspense>
  );
}
