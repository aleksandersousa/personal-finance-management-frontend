import { RemoteLoadCashFlowForecast } from '@/data/usecases';
import { LoadCashFlowForecast } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/decorators/authorized-server-http-client-factory';
import { makeApiUrl } from '@/main/factories/http';

export function makeRemoteLoadCashFlowForecast(): LoadCashFlowForecast {
  const httpClient = makeAuthorizedServerHttpClient();
  const url = makeApiUrl('');
  return new RemoteLoadCashFlowForecast(url, httpClient);
}
