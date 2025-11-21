export interface CategoryModel {
  id: string;
  name: string;
  description?: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithStatsModel extends CategoryModel {
  entriesCount: number;
  totalAmount: number;
  lastUsed?: Date;
}

export interface CategoryListResponseModel {
  data: CategoryWithStatsModel[];
  summary: {
    total: number;
    income: number;
    expense: number;
  };
}
