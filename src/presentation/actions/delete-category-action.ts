'use server';

import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '../helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteDeleteCategory } from '@/main/factories/usecases/delete-category-factory';
import { logoutAction } from './logout-action';

export async function deleteCategoryAction(id: string): Promise<void> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      return;
    }

    const deleteCategory = makeRemoteDeleteCategory();
    await deleteCategory.delete({ id });

    revalidateTag('categories');
    revalidateTag(`categories-${user.id}`);
    revalidateTag(`category-${id}`);
  } catch (error: any) {
    console.error('Delete category error:', error);
    throw error;
  }
}
