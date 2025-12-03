import { RemoteResetPassword } from '@/data/usecases';
import { ResetPassword } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export function makeRemoteResetPassword(): ResetPassword {
  return new RemoteResetPassword(
    makeApiUrl('/auth/reset-password'),
    makeFetchHttpClient()
  );
}
