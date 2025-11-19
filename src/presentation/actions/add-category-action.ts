'use server';

import { CategoryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '../helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteAddCategory } from '@/main/factories/usecases';
import { logoutAction } from './logout-action';

export async function addCategoryAction(data: CategoryFormData): Promise<void> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return;
    }

    const addCategory = makeRemoteAddCategory();
    await addCategory.add(data);

    revalidateTag('categories');
    revalidateTag(`categories-${user.id}`);

    redirect('/categories');
  } catch (error: any) {
    console.error('Add category error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
