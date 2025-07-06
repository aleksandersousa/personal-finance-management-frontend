'use server';

import { LoginFormData } from '@/infra/validation';
import { AuthenticationParams, type Authentication } from '@/domain/usecases';
import { redirect } from 'next/navigation';
import type { TokenStorage } from '@/data';

export async function loginAction(
  data: LoginFormData,
  authentication: Authentication,
  tokenStorage: TokenStorage
): Promise<void> {
  const params: AuthenticationParams = {
    email: data.email,
    password: data.password,
    rememberMe: data.rememberMe || false,
  };

  try {
    const result = await authentication.auth(params);

    // Store tokens using the new setTokens method
    tokenStorage.setTokens(result.tokens);

    // Redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw so component can handle the error
  }
}
