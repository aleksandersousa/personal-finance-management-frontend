import { RemoteUpdateEntry } from '@/data/usecases';
import { UpdateEntry } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories/http';

export function makeRemoteUpdateEntry(): UpdateEntry {
  const httpClient = makeFetchHttpClient();
  const url = makeApiUrl('/entries');
  return new RemoteUpdateEntry(url, httpClient);
}
