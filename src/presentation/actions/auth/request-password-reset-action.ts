'use server';

import {
  RequestPasswordResetParams,
  RequestPasswordResetModel,
} from '@/domain/usecases';
import { makeRemoteRequestPasswordReset } from '@/main/factories/usecases';
import { isRedirectError } from '@/presentation/helpers';

export async function requestPasswordResetAction(
  email: string
): Promise<RequestPasswordResetModel> {
  const params: RequestPasswordResetParams = {
    email,
  };

  const requestPasswordReset = makeRemoteRequestPasswordReset();

  try {
    const result = await requestPasswordReset.request(params);
    return result;
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Request password reset error:', error);
    throw new Error(
      error.cause?.message ||
        error.message ||
        'Failed to request password reset'
    );
  }
}
