import { makeEntriesListPage } from '@/main/factories/pages/entries-list-page-factory';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function EntriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return makeEntriesListPage({ searchParams: resolvedSearchParams });
}
