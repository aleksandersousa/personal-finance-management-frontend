import { DashboardPage } from '@/presentation/components/server';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    month?: string;
  }>;
}

export default async function DashboardPageRoute({ searchParams }: PageProps) {
  try {
    const { month } = await searchParams;

    // Se não especificado, usar mês atual
    const currentDate = new Date();
    const currentMonth =
      month ||
      `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    // Criar mock de dados para o MVP
    const mockSummary = {
      month: currentMonth,
      totalIncome: 450000, // R$ 4500.00 em centavos
      totalExpenses: 275000, // R$ 2750.00 em centavos
      balance: 175000, // R$ 1750.00 em centavos
      entriesCount: 12,
      categories: [
        {
          categoryId: '1',
          categoryName: 'Salário',
          total: 450000,
          count: 1,
          type: 'INCOME' as const,
        },
        {
          categoryId: '2',
          categoryName: 'Alimentação',
          total: 120000,
          count: 8,
          type: 'EXPENSE' as const,
        },
        {
          categoryId: '3',
          categoryName: 'Transporte',
          total: 85000,
          count: 4,
          type: 'EXPENSE' as const,
        },
        {
          categoryId: '4',
          categoryName: 'Lazer',
          total: 70000,
          count: 3,
          type: 'EXPENSE' as const,
        },
      ],
      comparison: {
        previousMonth: `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`,
        incomeChange: 5.2, // +5.2%
        expenseChange: -3.1, // -3.1% (diminuição é boa)
        balanceChange: 15.8, // +15.8%
      },
    };

    return <DashboardPage summary={mockSummary} />;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    notFound();
  }
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { month } = await searchParams;

  const formatMonth = (monthStr: string) => {
    const [year, monthNum] = monthStr.split('-');
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
  };

  const currentDate = new Date();
  const currentMonth =
    month ||
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  return {
    title: `Dashboard - ${formatMonth(currentMonth)} - Financial Manager`,
    description: `Visualize seu resumo financeiro completo de ${formatMonth(currentMonth)}`,
  };
}
