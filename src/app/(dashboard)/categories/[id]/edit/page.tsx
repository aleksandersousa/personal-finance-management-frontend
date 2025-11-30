import { EditCategoryPage } from '@/presentation/pages';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPageRoute({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    notFound();
  }

  return <EditCategoryPage categoryId={id} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Editar Categoria ${id} - Financial Manager`,
    description: 'Edite os dados da sua categoria',
  };
}
