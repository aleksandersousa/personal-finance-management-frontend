import { HttpClient } from '@/data/protocols';
import { FetchHttpClient } from '@/infra/http';
import { NextCookiesStorageAdapter } from '@/infra/storage/next-cookie-storage-adapter';
import { AuthorizeHttpClientDecorator } from '@/main/decorators';

export const makeAuthorizedServerHttpClient = (): HttpClient => {
  const httpClient = new FetchHttpClient();
  const cookieStorage = new NextCookiesStorageAdapter();
  return new AuthorizeHttpClientDecorator(cookieStorage, httpClient);
};
