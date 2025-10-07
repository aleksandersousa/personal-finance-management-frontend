import { RemoteAuthentication } from '@/data/usecases';
import { Authentication } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export function makeRemoteAuthentication(): Authentication {
  return new RemoteAuthentication(
    makeApiUrl('/auth/login'),
    makeFetchHttpClient()
  );
}
