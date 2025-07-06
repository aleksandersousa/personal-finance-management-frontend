import { RemoteAuthentication } from '@/data/usecases';
import { Authentication } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export function makeRemoteAuthentication(): Authentication {
  const httpClient = makeFetchHttpClient();
  const url = makeApiUrl('/auth/login');
  return new RemoteAuthentication(url, httpClient);
}
