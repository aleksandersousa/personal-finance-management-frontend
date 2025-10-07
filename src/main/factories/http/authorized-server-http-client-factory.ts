import { HttpClient } from '@/data/protocols';
import { FetchHttpClient } from '@/infra/http';
import { NextCookiesStorageAdapter } from '@/infra/storage/next-cookie-storage-adapter';
import { AuthorizeHttpClientDecorator } from '@/main/decorators';

/**
 * Factory específica para Server Actions e Server Components
 * Cria um HttpClient já decorado com autorização usando cookies do Next.js
 *
 * ⚠️ APENAS para uso em Server Components/Actions!
 */
export const makeAuthorizedServerHttpClient = (): HttpClient => {
  const httpClient = new FetchHttpClient();
  const cookieStorage = new NextCookiesStorageAdapter();

  return new AuthorizeHttpClientDecorator(cookieStorage, httpClient);
};
