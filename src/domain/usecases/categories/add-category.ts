import { CategoryModel } from '@/domain/models';

export interface AddCategory {
  add(params: AddCategoryParams): Promise<CategoryModel>;
}

export interface AddCategoryParams {
  name: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
}
