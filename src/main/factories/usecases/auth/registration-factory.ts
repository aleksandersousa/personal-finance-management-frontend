import { RemoteRegistration } from '@/data/usecases';
import { Registration } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export function makeRemoteRegistration(): Registration {
  return new RemoteRegistration(
    makeApiUrl('/auth/register'),
    makeFetchHttpClient()
  );
}
