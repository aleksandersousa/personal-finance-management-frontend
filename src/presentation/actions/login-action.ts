'use server';

import { LoginFormData } from '@/infra/validation';
import { AuthenticationParams, type Authentication } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import type { SetStorage } from '@/data/protocols';

export async function loginAction(
  data: LoginFormData,
  authentication: Authentication,
  setStorage: SetStorage
): Promise<void> {
  const params: AuthenticationParams = {
    email: data.email,
    password: data.password,
    rememberMe: data.rememberMe || false,
  };

  try {
    const result = await authentication.auth(params);

    setStorage.set('user', result.user);
    setStorage.set('tokens', result.tokens);

    redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
