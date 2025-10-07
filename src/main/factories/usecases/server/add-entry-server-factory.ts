import { RemoteAddEntry } from '@/data/usecases';
import { AddEntry } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizedServerHttpClient } from '@/main/factories/http/authorized-server-http-client-factory';

/**
 * Factory para Server Actions - usa HttpClient com cookies do Next.js
 * ⚠️ APENAS para uso em Server Components/Actions!
 */
export const makeRemoteAddEntryServer = (): AddEntry => {
  return new RemoteAddEntry(
    makeApiUrl('/entries'),
    makeAuthorizedServerHttpClient()
  );
};
