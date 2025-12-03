'use server';

import {
  ResendVerificationEmailParams,
  ResendVerificationEmailModel,
} from '@/domain/usecases';
import { makeRemoteResendVerificationEmail } from '@/main/factories/usecases/auth/resend-verification-email-factory';
import { isRedirectError } from '@/presentation/helpers';

export async function resendVerificationEmailAction(
  email: string
): Promise<ResendVerificationEmailModel> {
  const params: ResendVerificationEmailParams = {
    email,
  };

  const resendVerificationEmail = makeRemoteResendVerificationEmail();

  try {
    const result = await resendVerificationEmail.resend(params);
    return result;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Resend verification email error:', error);
    throw error;
  }
}
