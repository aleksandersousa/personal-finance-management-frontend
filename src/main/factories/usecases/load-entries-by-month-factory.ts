import { RemoteLoadEntriesByMonth } from '@/data/usecases';
import { LoadEntriesByMonth } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizeHttpClientDecorator } from '../decorators';

export function makeRemoteLoadEntriesByMonth(): LoadEntriesByMonth {
  const httpClient = makeAuthorizeHttpClientDecorator();
  const url = makeApiUrl('/entries');
  return new RemoteLoadEntriesByMonth(url, httpClient);
}
