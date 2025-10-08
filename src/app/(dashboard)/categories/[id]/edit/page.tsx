import { PageLoading } from '@/presentation';
import { EditCategoryPage } from '@/presentation/pages';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function EditCategoryPageWrapper({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    notFound();
  }

  return <EditCategoryPage categoryId={id} />;
}

export default function EditCategoryPageRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando categoria...' />}>
      <EditCategoryPageWrapper params={params} />
    </Suspense>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Editar Categoria ${id} - Financial Manager`,
    description: 'Edite os dados da sua categoria',
  };
}
