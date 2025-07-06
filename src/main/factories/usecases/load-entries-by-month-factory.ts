import { RemoteLoadEntriesByMonth } from '@/data/usecases/remote-load-entries-by-month';
import { LoadEntriesByMonth } from '@/domain/usecases/load-entries-by-month';
import { makeFetchHttpClient } from '@/main/factories/http/fetch-http-client-factory';
import { makeApiUrl } from '@/main/factories/http/api-url-factory';

export function makeRemoteLoadEntriesByMonth(): LoadEntriesByMonth {
  const httpClient = makeFetchHttpClient();
  const url = makeApiUrl('/entries');
  return new RemoteLoadEntriesByMonth(url, httpClient);
}
