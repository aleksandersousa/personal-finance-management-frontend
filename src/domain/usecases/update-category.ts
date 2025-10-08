import { CategoryModel } from '../models';

export interface UpdateCategory {
  update(params: UpdateCategoryParams): Promise<CategoryModel>;
}

export interface UpdateCategoryParams {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}
