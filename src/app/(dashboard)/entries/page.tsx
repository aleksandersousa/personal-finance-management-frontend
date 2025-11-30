import { EntriesListPage } from '@/presentation/pages';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function EntriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return <EntriesListPage searchParams={resolvedSearchParams} />;
}
