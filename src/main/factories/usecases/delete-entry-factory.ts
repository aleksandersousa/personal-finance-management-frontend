import { RemoteDeleteEntry } from '@/data/usecases';
import { DeleteEntry } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories/http';

export function makeRemoteDeleteEntry(): DeleteEntry {
  const httpClient = makeFetchHttpClient();
  const url = makeApiUrl('/entries');
  return new RemoteDeleteEntry(url, httpClient);
}
