import { Suspense } from 'react';
import { PageLoading } from '@/presentation/components';
import { CategoriesListPage } from '@/presentation/pages';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

async function CategoriesContent({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return <CategoriesListPage searchParams={resolvedSearchParams} />;
}

export default function CategoriesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando categorias...' />}>
      <CategoriesContent searchParams={searchParams} />
    </Suspense>
  );
}
