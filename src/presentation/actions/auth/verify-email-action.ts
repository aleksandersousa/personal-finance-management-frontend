'use server';

import { VerifyEmailParams, VerifyEmailModel } from '@/domain/usecases';
import { makeRemoteVerifyEmail } from '@/main/factories/usecases';
import { isRedirectError } from '@/presentation/helpers';

export async function verifyEmailAction(
  token: string
): Promise<VerifyEmailModel> {
  const params: VerifyEmailParams = {
    token,
  };

  const verifyEmail = makeRemoteVerifyEmail();

  try {
    const result = await verifyEmail.verify(params);
    return result;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Email verification error:', error);
    throw error;
  }
}
