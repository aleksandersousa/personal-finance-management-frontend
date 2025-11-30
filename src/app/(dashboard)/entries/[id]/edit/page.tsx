import { EditEntryPage } from '@/presentation/pages';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEntryPageRoute({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    notFound();
  }

  return <EditEntryPage entryId={id} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Editar Entrada ${id} - Financial Manager`,
    description: 'Edite os dados da sua entrada financeira',
  };
}
