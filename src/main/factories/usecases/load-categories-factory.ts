import { RemoteLoadCategories } from '@/data/usecases';
import { LoadCategories } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/decorators/authorized-server-http-client-factory';
import { makeApiUrl } from '@/main/factories';

export const makeRemoteLoadCategories = (): LoadCategories => {
  return new RemoteLoadCategories(
    makeApiUrl('/categories'),
    makeAuthorizedServerHttpClient()
  );
};
