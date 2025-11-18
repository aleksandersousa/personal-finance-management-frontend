import { Suspense } from 'react';
import { PageLoading } from '@/presentation/components';
import { EntriesListPage } from '@/presentation/pages';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

async function EntriesContent({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return <EntriesListPage searchParams={resolvedSearchParams} />;
}

export default function EntriesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando entradas...' />}>
      <EntriesContent searchParams={searchParams} />
    </Suspense>
  );
}
