import { RemoteAddEntry } from '@/data/usecases';
import { AddEntry } from '@/domain/usecases';
import { makeApiUrl, makeAuthorizeHttpClientDecorator } from '@/main/factories';

export const makeRemoteAddEntry = (): AddEntry => {
  return new RemoteAddEntry(
    makeApiUrl('/entries'),
    makeAuthorizeHttpClientDecorator()
  );
};
