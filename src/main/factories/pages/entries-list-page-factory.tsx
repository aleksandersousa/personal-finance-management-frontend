import { EntriesListPage } from '@/presentation/pages';

type Props = {
  searchParams: Record<string, string>;
};

export function makeEntriesListPage({ searchParams }: Props) {
  return <EntriesListPage searchParams={searchParams} />;
}
