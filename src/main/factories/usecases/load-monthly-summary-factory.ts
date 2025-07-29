import { RemoteLoadMonthlySummary } from '@/data/usecases';
import { LoadMonthlySummary } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories/http';

export function makeRemoteLoadMonthlySummary(): LoadMonthlySummary {
  const httpClient = makeFetchHttpClient();
  const url = makeApiUrl('');
  return new RemoteLoadMonthlySummary(url, httpClient);
}
