import { HttpClient } from '@/data/protocols/http';
import { GetStorage } from '@/data/protocols/storage';
import { HttpInterceptor } from '@/infra/http/http-interceptor';
import { makeFetchHttpClient } from './fetch-http-client-factory';

export interface HttpInterceptorFactoryConfig {
  getStorage: GetStorage;
  onAuthError?: () => void;
}

export const makeHttpInterceptor = (
  config: HttpInterceptorFactoryConfig
): HttpClient => {
  const httpClient = makeFetchHttpClient();

  return new HttpInterceptor(httpClient, {
    getStorage: config.getStorage,
    onAuthError: config.onAuthError,
  });
};
