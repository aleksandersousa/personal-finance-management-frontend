import { EntryModel } from '@/domain/models';

export interface LoadEntriesByMonth {
  load: (params: LoadEntriesByMonthParams) => Promise<LoadEntriesByMonthResult>;
}

export type LoadEntriesByMonthParams = {
  month: string; // YYYY-MM
  userId: string;
  page?: number;
  limit?: number;
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  search?: string;
  isPaid?: boolean | 'all';
};

export type LoadEntriesByMonthResult = {
  data: EntryModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
