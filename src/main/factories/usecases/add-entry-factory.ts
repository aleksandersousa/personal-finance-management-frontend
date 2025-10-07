import { RemoteAddEntry } from '@/data/usecases';
import { AddEntry } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/decorators/authorized-server-http-client-factory';
import { makeApiUrl } from '@/main/factories';

export const makeRemoteAddEntry = (): AddEntry => {
  return new RemoteAddEntry(
    makeApiUrl('/entries'),
    makeAuthorizedServerHttpClient()
  );
};
