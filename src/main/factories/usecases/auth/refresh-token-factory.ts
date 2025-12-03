import { RemoteRefreshToken } from '@/data/usecases';
import { RefreshToken } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export const makeRemoteRefreshToken = (): RefreshToken => {
  return new RemoteRefreshToken(
    makeApiUrl('/auth/refresh'),
    makeFetchHttpClient()
  );
};
