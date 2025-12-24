import { RemoteToggleMonthlyPaymentStatus } from '@/data/usecases';
import { ToggleMonthlyPaymentStatus } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories/http';

export function makeRemoteToggleMonthlyPaymentStatus(): ToggleMonthlyPaymentStatus {
  const httpClient = makeAuthorizedServerHttpClient();
  const url = makeApiUrl('/entries');
  return new RemoteToggleMonthlyPaymentStatus(url, httpClient);
}
