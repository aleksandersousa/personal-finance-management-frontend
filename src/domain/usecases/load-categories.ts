import { CategoryListResponseModel } from '../models';

export interface LoadCategories {
  load(params?: LoadCategoriesParams): Promise<CategoryListResponseModel>;
}

export interface LoadCategoriesParams {
  type?: 'INCOME' | 'EXPENSE' | 'all';
  includeStats?: boolean;
  page?: number;
  limit?: number;
}
