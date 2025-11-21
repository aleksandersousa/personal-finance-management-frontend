import { RemoteDeleteCategory } from '@/data/usecases';
import { DeleteCategory } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories';

export const makeRemoteDeleteCategory = (): DeleteCategory => {
  return new RemoteDeleteCategory(
    makeApiUrl('/categories'),
    makeAuthorizedServerHttpClient()
  );
};
