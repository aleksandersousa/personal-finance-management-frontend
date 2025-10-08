import { RemoteUpdateCategory } from '@/data/usecases';
import { UpdateCategory } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/decorators/authorized-server-http-client-factory';
import { makeApiUrl } from '@/main/factories';

export const makeRemoteUpdateCategory = (): UpdateCategory => {
  return new RemoteUpdateCategory(
    makeApiUrl('/categories'),
    makeAuthorizedServerHttpClient()
  );
};
