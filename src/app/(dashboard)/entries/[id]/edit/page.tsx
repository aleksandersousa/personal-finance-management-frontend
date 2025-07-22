import { EditEntryPage } from '@/presentation/components/server';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditEntryPageRoute({ params }: PageProps) {
  try {
    // Validar se o ID é válido
    if (!params.id || params.id.trim() === '') {
      notFound();
    }

    // Para este MVP, vamos simular o carregamento da entrada
    // Em uma implementação real, haveria um caso de uso LoadEntryById
    const mockEntry = {
      id: params.id,
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

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Editar Entrada ${params.id} - Financial Manager`,
    description: 'Edite os dados da sua entrada financeira',
  };
}
