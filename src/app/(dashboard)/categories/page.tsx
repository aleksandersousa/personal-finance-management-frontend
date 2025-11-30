import { CategoriesListPage } from '@/presentation/pages';

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function CategoriesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return <CategoriesListPage searchParams={resolvedSearchParams} />;
}
