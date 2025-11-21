import { RemoteLoadMonthlySummary } from '@/data/usecases';
import { LoadMonthlySummary } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export function makeRemoteLoadMonthlySummary(): LoadMonthlySummary {
  const httpClient = makeAuthorizedServerHttpClient();
  const url = makeApiUrl('');
  return new RemoteLoadMonthlySummary(url, httpClient);
}
