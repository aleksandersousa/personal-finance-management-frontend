'use server';

import { LoadCategoriesParams } from '@/domain/usecases';
import { CategoryListResponseModel } from '@/domain/models/category';
import { getCurrentUser, isRedirectError } from '@/presentation/helpers';
import { makeNextCookiesStorageAdapter } from '@/main/factories/storage/next-cookie-storage-adapter-factory';
import { makeRemoteLoadCategories } from '@/main/factories/usecases/categories/load-categories-factory';
import { logoutAction } from '@/presentation/actions/auth/logout-action';

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
    const search = params?.search;

    const loadCategories = makeRemoteLoadCategories();
    const result = await loadCategories.load({
      ...params,
      page,
      limit,
      ...(search && search.trim() && { search: search.trim() }),
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
