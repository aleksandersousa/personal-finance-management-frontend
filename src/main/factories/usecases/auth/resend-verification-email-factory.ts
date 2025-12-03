import { RemoteResendVerificationEmail } from '@/data/usecases';
import { ResendVerificationEmail } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export function makeRemoteResendVerificationEmail(): ResendVerificationEmail {
  return new RemoteResendVerificationEmail(
    makeApiUrl('/auth/resend-verification'),
    makeFetchHttpClient()
  );
}
