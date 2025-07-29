import { makeForecastPage } from '@/main/factories/pages';
import { ForecastFilters } from '@/domain/models';

export default async function ForecastPageRoute({
  searchParams,
}: {
  searchParams: Promise<{
    period?: string;
    includeVariableProjections?: string;
    confidenceThreshold?: string;
  }>;
}) {
  const params = await searchParams;
  // Parse query parameters for initial filters
  const initialFilters: ForecastFilters = {
    period: (parseInt(params.period || '6') as 3 | 6 | 12) || 6,
    includeVariableProjections: params.includeVariableProjections !== 'false',
    confidenceThreshold:
      (params.confidenceThreshold as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
  };

  // In a real implementation, you would get the userId from auth
  const userId = 'mock-user-id';

  return makeForecastPage({ userId, initialFilters });
}
