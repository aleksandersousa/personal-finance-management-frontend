import { Suspense } from 'react';
import { EditEntryPage } from '@/presentation/pages';
import { PageLoading } from '@/presentation/components';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function EditEntryContent({ params }: PageProps) {
  try {
    const { id } = await params;

    if (!id || id.trim() === '') {
      notFound();
    }

    // Para este MVP, vamos simular o carregamento da entrada
    // Em uma implementação real, haveria um caso de uso LoadEntryById
    const mockEntry = {
      id,
      description: 'Salário Janeiro 2024',
      amount: 450000, // R$ 4500.00 em centavos
      type: 'INCOME' as const,
      categoryId: '6',
      categoryName: 'Salário',
      userId: 'mock-user-id',
      date: new Date('2024-01-15'),
      isFixed: true,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
    };

    return <EditEntryPage entry={mockEntry} />;
  } catch (error) {
    console.error('Error loading entry for edit:', error);
    notFound();
  }
}

export default function EditEntryPageRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando entrada...' />}>
      <EditEntryContent params={params} />
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
