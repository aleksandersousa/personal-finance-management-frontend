import {
  ToggleMonthlyPaymentStatus,
  ToggleMonthlyPaymentStatusParams,
  ToggleMonthlyPaymentStatusResult,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols/http/http-client';

export class RemoteToggleMonthlyPaymentStatus
  implements ToggleMonthlyPaymentStatus
{
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async toggle(
    params: ToggleMonthlyPaymentStatusParams
  ): Promise<ToggleMonthlyPaymentStatusResult> {
    const httpResponse = await this.httpClient.patch<unknown>(
      `${this.url}/${params.entryId}/payment-status`,
      {
        isPaid: params.isPaid,
      }
    );

    const apiResponse = httpResponse as {
      entryId: string;
      isPaid: boolean;
      paidAt: string | null;
    };

    return {
      entryId: apiResponse.entryId,
      isPaid: apiResponse.isPaid,
      paidAt: apiResponse.paidAt ? new Date(apiResponse.paidAt) : null,
    };
  }
}
