'use server';

import { LoginFormData } from '@/infra/validation';
import { AuthenticationParams } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import { NextCookiesStorageAdapter } from '@/infra/storage/next-cookie-storage-adapter';
import { makeRemoteAuthentication } from '@/main/factories/usecases/authentication-factory';

export async function loginAction(data: LoginFormData): Promise<void> {
  const params: AuthenticationParams = {
    email: data.email,
    password: data.password,
  };

  const authentication = makeRemoteAuthentication();
  const setStorage = new NextCookiesStorageAdapter();

  try {
    const result = await authentication.auth(params);

    await setStorage.set('user', result.user);
    await setStorage.set('tokens', result.tokens);

    redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
