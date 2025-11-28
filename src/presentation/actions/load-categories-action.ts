'use server';

import { LoadCategoriesParams } from '@/domain/usecases/load-categories';
import { CategoryListResponseModel } from '@/domain/models/category';
import { getCurrentUser, isRedirectError } from '../helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteLoadCategories } from '@/main/factories/usecases/load-categories-factory';
import { logoutAction } from './logout-action';

export async function loadCategoriesAction(
  params?: LoadCategoriesParams
): Promise<CategoryListResponseModel> {
  try {
    const getStorage = makeNextCookiesStorageAdapter();
    const user = await getCurrentUser(getStorage);

    if (!user) {
      console.warn('User not found, redirecting to logout');
      await logoutAction();
      throw new Error('User not authenticated');
    }

    const page = params?.page ? Number(params.page) : 1;
    const limit = params?.limit ? Number(params.limit) : 5;

    const loadCategories = makeRemoteLoadCategories();
    const result = await loadCategories.load({
      ...params,
      page,
      limit,
    });

    return result;
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Load categories error:', error);
    if (error.message.includes('401')) {
      await logoutAction();
    }
    throw error;
  }
}
