import { DashboardPage } from '@/presentation/pages';
import {
  loadMonthlySummaryAction,
  loadCashFlowForecastAction,
} from '@/presentation/actions';
import { isRedirectError } from '@/presentation/helpers';
import { ErrorReloadButton } from '@/presentation/components/error-reload-button';

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
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Error loading dashboard:', error);

    // Return error UI instead of throwing
    return (
      <div className='min-h-screen bg-background-secondary pt-20 pb-20 lg:pb-8'>
        <div className='flex justify-center px-4 sm:px-6 lg:px-8'>
          <div className='w-full max-w-4xl box-border'>
            <div className='bg-white rounded-3xl shadow-md border border-neutral-200 p-6 sm:p-8'>
              <div className='flex flex-col items-center justify-center text-center py-16'>
                <div className='w-24 h-24 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center'>
                  <span className='text-5xl'>⚠️</span>
                </div>
                <h2 className='text-2xl font-bold text-neutral-900 mb-3'>
                  Erro ao carregar dashboard
                </h2>
                <p className='text-neutral-600 mb-8 max-w-md leading-relaxed'>
                  Ocorreu um erro inesperado ao carregar o dashboard. Verifique
                  sua conexão e tente novamente.
                </p>
                <ErrorReloadButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
