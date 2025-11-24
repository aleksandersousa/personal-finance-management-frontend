import { RemoteLoadEntriesMonthsYears } from '@/data/usecases';
import { LoadEntriesMonthsYears } from '@/domain/usecases';
import { makeAuthorizedServerHttpClient } from '@/main/factories/decorators';
import { makeApiUrl } from '@/main/factories';

export const makeRemoteLoadEntriesMonthsYears = (): LoadEntriesMonthsYears => {
  return new RemoteLoadEntriesMonthsYears(
    makeApiUrl('/entries/months-years'),
    makeAuthorizedServerHttpClient()
  );
};
