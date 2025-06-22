import { FetchHttpClient } from '@/infra/http';
import { HttpClient } from '@/data/protocols';

export const makeFetchHttpClient = (): HttpClient => {
  return new FetchHttpClient();
};
