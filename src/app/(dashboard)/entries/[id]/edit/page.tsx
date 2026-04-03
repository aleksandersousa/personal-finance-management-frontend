import { EditEntryPage } from '@/presentation/pages';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EditEntryPageRoute({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const monthParam = resolvedSearchParams.month;
  const listMonthFilter =
    typeof monthParam === 'string' && /^\d{4}-\d{2}$/.test(monthParam)
      ? monthParam
      : undefined;

  if (!id || id.trim() === '') {
    notFound();
  }

  return <EditEntryPage entryId={id} listMonthFilter={listMonthFilter} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Editar Entrada ${id} - Financial Manager`,
    description: 'Edite os dados da sua entrada financeira',
  };
}
