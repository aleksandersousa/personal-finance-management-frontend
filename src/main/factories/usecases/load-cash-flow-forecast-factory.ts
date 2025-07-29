import { RemoteLoadCashFlowForecast } from '@/data/usecases';
import { LoadCashFlowForecast } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories/http';

export function makeRemoteLoadCashFlowForecast(): LoadCashFlowForecast {
  const httpClient = makeFetchHttpClient();
  const url = makeApiUrl('');
  return new RemoteLoadCashFlowForecast(url, httpClient);
}
