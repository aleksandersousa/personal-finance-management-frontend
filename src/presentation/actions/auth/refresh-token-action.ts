'use server';

import { makeApiUrl } from '@/main/factories/http/api-url-factory';
import { logoutAction } from './logout-action';
import type { AuthTokens } from '@/domain';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { isRedirectError } from '@/presentation/helpers';

export async function refreshTokenAction(): Promise<AuthTokens | null> {
  try {
    const storage = makeNextCookiesStorageAdapter();
    const tokens = (await storage.get('tokens')) as AuthTokens;

    if (!tokens?.refreshToken) {
      console.warn('No refresh token available');
      await logoutAction();
      return null;
    }

    const response = await fetch(`${makeApiUrl('/auth/refresh')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      console.warn('Refresh token failed:', response.status);
      await logoutAction();
      return null;
    }

    const newTokens = await response.json();

    // Atualizar tokens no storage
    await storage.set('tokens', newTokens);
    await storage.set('accessToken', newTokens.accessToken);
    await storage.set('refreshToken', newTokens.refreshToken);

    console.log('Access token refreshed successfully');
    return newTokens;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Refresh token error:', error);
    await logoutAction();
    return null;
  }
}
