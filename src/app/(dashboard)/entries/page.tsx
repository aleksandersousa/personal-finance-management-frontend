import { Suspense } from 'react';
import { makeEntriesListPage } from '@/main/factories/pages/entries-list-page-factory';
import { PageLoading } from '@/presentation/components';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

async function EntriesContent({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return makeEntriesListPage({ searchParams: resolvedSearchParams });
}

export default function EntriesPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando entradas...' />}>
      <EntriesContent searchParams={searchParams} />
    </Suspense>
  );
}
