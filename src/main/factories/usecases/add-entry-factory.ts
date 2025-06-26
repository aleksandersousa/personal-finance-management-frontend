import { RemoteAddEntry } from '@/data/usecases/remote-add-entry';
import { AddEntry } from '@/domain/usecases/add-entry';
import { makeFetchHttpClient } from '@/main/factories/http/fetch-http-client-factory';
import { makeApiUrl } from '@/main/factories/http/api-url-factory';

export const makeRemoteAddEntry = (): AddEntry => {
  return new RemoteAddEntry(makeApiUrl('/entries'), makeFetchHttpClient());
};
