import { Suspense } from 'react';
import { makeAddCategoryPage } from '@/main/factories/pages';
import { PageLoading } from '@/presentation/components';

export default function AddCategoryRoute() {
  return (
    <Suspense fallback={<PageLoading text='Carregando formulário...' />}>
      {makeAddCategoryPage()}
    </Suspense>
  );
}
