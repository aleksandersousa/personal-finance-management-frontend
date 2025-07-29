import { ForecastPage } from '@/presentation/components/server';
import { makeRemoteLoadCashFlowForecast } from '@/main/factories/usecases';
import { ForecastFilters } from '@/domain/models';

export interface MakeForecastPageProps {
  userId: string;
  initialFilters?: ForecastFilters;
}

export function makeForecastPage({
  userId,
  initialFilters,
}: MakeForecastPageProps) {
  const loadCashFlowForecast = makeRemoteLoadCashFlowForecast();

  return (
    <ForecastPage
      loadCashFlowForecast={loadCashFlowForecast}
      userId={userId}
      initialFilters={initialFilters}
    />
  );
}
