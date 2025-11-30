'use server';

import { RegistrationFormData } from '@/infra/validation';
import { RegistrationParams } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { makeRemoteRegistration } from '@/main/factories/usecases/registration-factory';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { isRedirectError } from '../helpers';

export async function registrationAction(
  data: RegistrationFormData
): Promise<void> {
  const params: RegistrationParams = {
    name: data.name,
    email: data.email,
    password: data.password,
  };

  const registration = makeRemoteRegistration();
  const setNextCookieStorage = makeNextCookiesStorageAdapter();

  try {
    const result = await registration.register(params);

    await setNextCookieStorage.set('user', {
      id: result.id,
      name: result.name,
      email: result.email,
    });
    await setNextCookieStorage.set('tokens', result.tokens);

    await setNextCookieStorage.set('accessToken', result.tokens.accessToken);
    await setNextCookieStorage.set('refreshToken', result.tokens.refreshToken);

    redirect('/dashboard');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Registration error:', error);
    throw error;
  }
}
