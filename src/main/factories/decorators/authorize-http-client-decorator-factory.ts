import { AuthorizeHttpClientDecorator } from '@/main/decorators';
import { makeCookieStorageAdapter } from '@/main/factories/storage';
import { makeFetchHttpClient } from '@/main/factories/http';
import { HttpClient } from '@/data/protocols/http';

export const makeAuthorizeHttpClientDecorator = (): HttpClient =>
  new AuthorizeHttpClientDecorator(
    makeCookieStorageAdapter(),
    makeFetchHttpClient()
  );
