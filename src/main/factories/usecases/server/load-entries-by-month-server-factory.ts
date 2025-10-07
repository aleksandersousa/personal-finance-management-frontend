import { RemoteLoadEntriesByMonth } from '@/data/usecases';
import { LoadEntriesByMonth } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizedServerHttpClient } from '@/main/factories/http/authorized-server-http-client-factory';

/**
 * Factory para Server Actions - usa HttpClient com cookies do Next.js
 * ⚠️ APENAS para uso em Server Components/Actions!
 */
export const makeRemoteLoadEntriesByMonthServer = (): LoadEntriesByMonth => {
  return new RemoteLoadEntriesByMonth(
    makeApiUrl('/entries'),
    makeAuthorizedServerHttpClient()
  );
};
