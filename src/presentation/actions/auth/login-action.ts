'use server';

import { LoginFormData } from '@/infra/validation';
import { AuthenticationParams } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { makeRemoteAuthentication } from '@/main/factories/usecases/auth/authentication-factory';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { isRedirectError } from '@/presentation/helpers';

export async function loginAction(data: LoginFormData): Promise<
  | {
      success: boolean;
      error: string;
      remainingDelaySeconds?: number;
      isEmailNotVerified?: boolean;
    }
  | undefined
> {
  const params: AuthenticationParams = {
    email: data.email,
    password: data.password,
  };

  const authentication = makeRemoteAuthentication();
  const setNextCookieStorage = makeNextCookiesStorageAdapter();

  try {
    const result = await authentication.auth(params);

    await setNextCookieStorage.set('user', result.user);
    await setNextCookieStorage.set('tokens', result.tokens);

    await setNextCookieStorage.set('accessToken', result.tokens.accessToken);
    await setNextCookieStorage.set('refreshToken', result.tokens.refreshToken);

    redirect('/dashboard');
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    const errorCause = error.cause || error;
    const errorMessage = errorCause.message || error.message || String(error);

    const delaySeconds = errorCause.remainingDelaySeconds;

    if (delaySeconds) {
      return {
        success: false,
        error: 'Muitas tentativas. Tente novamente mais tarde.',
        remainingDelaySeconds: delaySeconds,
      };
    }

    const isUnverifiedError =
      errorMessage.includes('Email not verified') ||
      (errorCause.message &&
        typeof errorCause.message === 'string' &&
        errorCause.message.includes('Email not verified'));

    if (isUnverifiedError) {
      return {
        success: false,
        error:
          'E-mail não verificado. Por favor, verifique sua caixa de entrada e clique no link de verificação antes de fazer login.',
        isEmailNotVerified: true,
      };
    }

    return {
      success: false,
      error: 'Ocorreu um erro ao fazer login. Verifique suas credenciais.',
    };
  }
}
