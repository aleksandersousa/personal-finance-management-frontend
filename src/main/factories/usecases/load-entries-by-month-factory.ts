import { RemoteLoadEntriesByMonth } from '@/data/usecases';
import { LoadEntriesByMonth } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizedServerHttpClient } from '@/main/decorators/authorized-server-http-client-factory';

export function makeRemoteLoadEntriesByMonth(): LoadEntriesByMonth {
  return new RemoteLoadEntriesByMonth(
    makeApiUrl('/entries'),
    makeAuthorizedServerHttpClient()
  );
}
