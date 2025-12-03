'use server';

import { ResetPasswordParams, ResetPasswordModel } from '@/domain/usecases';
import { makeRemoteResetPassword } from '@/main/factories/usecases';
import { isRedirectError } from '@/presentation/helpers';

export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<ResetPasswordModel> {
  const params: ResetPasswordParams = {
    token,
    newPassword,
  };

  const resetPassword = makeRemoteResetPassword();

  try {
    const result = await resetPassword.reset(params);
    return result;
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Reset password error:', error);
    throw new Error(
      error.cause?.message || error.message || 'Failed to reset password'
    );
  }
}
