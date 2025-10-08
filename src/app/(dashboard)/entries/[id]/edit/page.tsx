import { PageLoading } from '@/presentation';
import { EditEntryPage } from '@/presentation/pages';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function EditEntryPageWrapper({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    notFound();
  }

  return <EditEntryPage entryId={id} />;
}

export default function EditEntryPageRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando entrada...' />}>
      <EditEntryPageWrapper params={params} />
    </Suspense>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Editar Entrada ${id} - Financial Manager`,
    description: 'Edite os dados da sua entrada financeira',
  };
}
