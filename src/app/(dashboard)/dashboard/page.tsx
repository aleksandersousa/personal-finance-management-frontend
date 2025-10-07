import { DashboardPage } from '@/presentation/pages';
import {
  loadMonthlySummaryAction,
  loadCashFlowForecastAction,
} from '@/presentation/actions';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{
    month?: string;
    forecastMonths?: string;
  }>;
}

export default async function DashboardPageRoute({ searchParams }: PageProps) {
  try {
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
    const [summary, forecast] = await Promise.allSettled([
      loadMonthlySummaryAction(currentMonth, true),
      loadCashFlowForecastAction(forecastMonthsCount, true, false),
    ]);

    // Verificar se conseguimos carregar o summary (obrigatório)
    if (summary.status === 'rejected') {
      console.error('Failed to load summary:', summary.reason);
      notFound();
    }

    // Forecast é opcional - se falhar, continua sem ele
    const forecastData =
      forecast.status === 'fulfilled' ? forecast.value : undefined;

    if (forecast.status === 'rejected') {
      console.warn('Failed to load forecast:', forecast.reason);
    }

    return <DashboardPage summary={summary.value} forecast={forecastData} />;
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
