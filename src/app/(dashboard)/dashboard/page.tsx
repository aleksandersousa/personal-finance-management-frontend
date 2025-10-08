import { Suspense } from 'react';
import { DashboardPage } from '@/presentation/pages';
import { PageLoading } from '@/presentation/components';
import {
  loadMonthlySummaryAction,
  loadCashFlowForecastAction,
} from '@/presentation/actions';

interface PageProps {
  searchParams: Promise<{
    month?: string;
    forecastMonths?: string;
  }>;
}

async function DashboardContent({ searchParams }: PageProps) {
  const { month, forecastMonths } = await searchParams;

  // Se não especificado, usar mês atual
  const currentDate = new Date();
  const currentMonth =
    month ||
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  // Número de meses para previsão (padrão: 6)
  const forecastMonthsCount = forecastMonths
    ? Math.min(Math.max(parseInt(forecastMonths, 10), 1), 12)
    : 6;

  // Carregar dados do resumo mensal e previsão em paralelo
  const [summary, forecast] = await Promise.all([
    loadMonthlySummaryAction(currentMonth, true),
    loadCashFlowForecastAction(forecastMonthsCount, true, false),
  ]);

  return (
    <DashboardPage
      summary={summary}
      forecast={forecast}
      currentMonth={currentMonth}
      currentForecastMonths={forecastMonthsCount}
    />
  );
}

export default function DashboardPageRoute({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageLoading text='Carregando dashboard...' />}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
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
