import { RemoteAddCategory } from '@/data/usecases';
import { AddCategory } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories';

export const makeRemoteAddCategory = (): AddCategory => {
  return new RemoteAddCategory(
    makeApiUrl('/categories'),
    makeAuthorizedServerHttpClient()
  );
};
