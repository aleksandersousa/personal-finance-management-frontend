'use server';

import { LoginFormData } from '@/infra/validation';
import { AuthenticationParams } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { makeRemoteAuthentication } from '@/main/factories/usecases/auth/authentication-factory';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { isRedirectError } from '@/presentation/helpers';

export async function loginAction(data: LoginFormData): Promise<void> {
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

    throw new Error(error.cause.message);
  }
}
