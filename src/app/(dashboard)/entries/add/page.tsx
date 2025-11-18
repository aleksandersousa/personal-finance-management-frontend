import { Suspense } from 'react';
import { PageLoading } from '@/presentation/components';
import { AddEntryPage } from '@/presentation/pages';

export default function AddEntryRoute() {
  return (
    <Suspense fallback={<PageLoading text='Carregando formulário...' />}>
      <AddEntryPage />
    </Suspense>
  );
}
