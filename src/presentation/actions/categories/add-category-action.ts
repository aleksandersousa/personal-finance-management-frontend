'use server';

import { CategoryFormData } from '@/infra/validation';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteAddCategory } from '@/main/factories/usecases';
import { logoutAction } from '@/presentation/actions/auth/logout-action';

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

    redirect('/categories?success=category_created');
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Add category error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
      return;
    }
    redirect('/categories?error=category_create_failed');
  }
}
