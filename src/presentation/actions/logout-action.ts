'use server';

import { redirect } from 'next/navigation';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';

export async function logoutAction(): Promise<void> {
  try {
    const cookieStorage = makeNextCookiesStorageAdapter();
    await cookieStorage.set('user', null);
    await cookieStorage.set('tokens', null);
    await cookieStorage.set('accessToken', null);
    await cookieStorage.set('refreshToken', null);

    console.log('Logout completed successfully');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    redirect('/login');
  }
}
