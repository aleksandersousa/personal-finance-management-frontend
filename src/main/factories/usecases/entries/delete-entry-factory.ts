import { RemoteDeleteEntry } from '@/data/usecases';
import { DeleteEntry } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export function makeRemoteDeleteEntry(): DeleteEntry {
  const httpClient = makeAuthorizedServerHttpClient();
  const url = makeApiUrl('/entries');
  return new RemoteDeleteEntry(url, httpClient);
}
