import { Suspense } from 'react';
import { PageLoading } from '@/presentation/components';
import { AddCategoryPage } from '@/presentation/pages';

export default function AddCategoryRoute() {
  return (
    <Suspense fallback={<PageLoading text='Carregando formulário...' />}>
      <AddCategoryPage />
    </Suspense>
  );
}
