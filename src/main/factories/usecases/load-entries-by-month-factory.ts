import { RemoteLoadEntriesByMonth } from '@/data/usecases';
import { LoadEntriesByMonth } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';

export function makeRemoteLoadEntriesByMonth(): LoadEntriesByMonth {
  return new RemoteLoadEntriesByMonth(
    makeApiUrl('/entries'),
    makeAuthorizedServerHttpClient()
  );
}
