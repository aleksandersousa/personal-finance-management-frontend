import { AuthorizeHttpClientDecorator } from '@/main/decorators';
import { LocalStorageAdapter } from '@/infra/storage/local-storage-adapter';
import { makeFetchHttpClient } from '@/main/factories/http';
import { HttpClient } from '@/data/protocols/http';

/**
 * Factory para Client Components - usa LocalStorage
 * Para Server Components/Actions, use makeAuthorizedServerHttpClient
 */
export const makeAuthorizeHttpClientDecorator = (): HttpClient =>
  new AuthorizeHttpClientDecorator(
    new LocalStorageAdapter(),
    makeFetchHttpClient()
  );
