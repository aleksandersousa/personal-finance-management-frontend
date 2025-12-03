import { RemoteVerifyEmail } from '@/data/usecases';
import { VerifyEmail } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export function makeRemoteVerifyEmail(): VerifyEmail {
  return new RemoteVerifyEmail(
    makeApiUrl('/auth/verify-email'),
    makeFetchHttpClient()
  );
}
