import { Suspense } from 'react';
import { makeCategoriesListPage } from '@/main/factories/pages/categories-list-page-factory';
import { PageLoading } from '@/presentation/components';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

async function CategoriesContent({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return makeCategoriesListPage({ searchParams: resolvedSearchParams });
}

export default function CategoriesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando categorias...' />}>
      <CategoriesContent searchParams={searchParams} />
    </Suspense>
  );
}
