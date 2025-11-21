'use server';

import { CategoryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '../helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteUpdateCategory } from '@/main/factories/usecases/update-category-factory';
import { logoutAction } from './logout-action';

export async function updateCategoryAction(
  id: string,
  data: CategoryFormData
): Promise<void> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return;
    }

    const updateCategory = makeRemoteUpdateCategory();
    await updateCategory.update({ id, ...data });

    revalidateTag('categories');
    revalidateTag(`categories-${user.id}`);
    revalidateTag(`category-${id}`);

    redirect('/categories');
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Update category error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
