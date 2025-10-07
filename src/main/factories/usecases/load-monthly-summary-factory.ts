import { RemoteLoadMonthlySummary } from '@/data/usecases';
import { LoadMonthlySummary } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/decorators/authorized-server-http-client-factory';
import { makeApiUrl } from '@/main/factories/http';

export function makeRemoteLoadMonthlySummary(): LoadMonthlySummary {
  const httpClient = makeAuthorizedServerHttpClient();
  const url = makeApiUrl('');
  return new RemoteLoadMonthlySummary(url, httpClient);
}
