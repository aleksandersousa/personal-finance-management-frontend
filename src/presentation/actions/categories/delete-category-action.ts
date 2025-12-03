'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteDeleteCategory } from '@/main/factories/usecases/categories/delete-category-factory';
import { logoutAction } from '@/presentation/actions/auth/logout-action';

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

    redirect('/categories?success=category_deleted');
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Delete category error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
      return;
    }
    redirect('/categories?error=category_delete_failed');
  }
}
