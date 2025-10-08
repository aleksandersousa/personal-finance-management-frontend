import { CategoriesListPage } from '@/presentation/pages';

type Props = {
  searchParams: Record<string, string>;
};

export function makeCategoriesListPage({ searchParams }: Props) {
  return <CategoriesListPage searchParams={searchParams} />;
}
