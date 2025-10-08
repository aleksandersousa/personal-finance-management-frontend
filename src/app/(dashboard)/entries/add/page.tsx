import { Suspense } from 'react';
import { makeAddEntryPage } from '@/main/factories/pages';
import { PageLoading } from '@/presentation/components';

export default function AddEntryRoute() {
  return (
    <Suspense fallback={<PageLoading text='Carregando formulário...' />}>
      {makeAddEntryPage()}
    </Suspense>
  );
}
