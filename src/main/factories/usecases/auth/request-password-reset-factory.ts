import { RemoteRequestPasswordReset } from '@/data/usecases';
import { RequestPasswordReset } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export function makeRemoteRequestPasswordReset(): RequestPasswordReset {
  return new RemoteRequestPasswordReset(
    makeApiUrl('/auth/forgot-password'),
    makeFetchHttpClient()
  );
}
