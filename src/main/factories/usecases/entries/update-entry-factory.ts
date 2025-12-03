import { RemoteUpdateEntry } from '@/data/usecases';
import { UpdateEntry } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export function makeRemoteUpdateEntry(): UpdateEntry {
  const httpClient = makeAuthorizedServerHttpClient();
  const url = makeApiUrl('/entries');
  return new RemoteUpdateEntry(url, httpClient);
}
