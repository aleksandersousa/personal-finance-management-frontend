import { EntryModel } from '../models';

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
};

export type LoadEntriesByMonthResult = {
  data: EntryModel[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
