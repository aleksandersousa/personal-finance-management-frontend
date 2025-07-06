import { EntriesListPage } from '@/presentation/components/server/entries-list-page';

type Props = {
  searchParams: Record<string, string>;
};

export function makeEntriesListPage({ searchParams }: Props) {
  return <EntriesListPage searchParams={searchParams} />;
}
