import { RemoteAddEntry } from '@/data/usecases';
import { AddEntry } from '@/domain/usecases';
import { makeFetchHttpClient, makeApiUrl } from '@/main/factories';

export const makeRemoteAddEntry = (): AddEntry => {
  return new RemoteAddEntry(makeApiUrl('/entries'), makeFetchHttpClient());
};
