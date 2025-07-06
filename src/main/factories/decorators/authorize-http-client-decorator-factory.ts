import { AuthorizeHttpClientDecorator } from '@/main/decorators';
import { makeLocalStorageAdapter } from '@/main/factories/storage';
import { makeFetchHttpClient } from '@/main/factories/http';
import { HttpClient } from '@/data/protocols/http';

export const makeAuthorizeHttpClientDecorator = (): HttpClient =>
  new AuthorizeHttpClientDecorator(
    makeLocalStorageAdapter(),
    makeFetchHttpClient()
  );
