import { EntryModel } from '@/domain/models';

export interface LoadEntriesByMonth {
  load: (params: LoadEntriesByMonthParams) => Promise<LoadEntriesByMonthResult>;
}

export type LoadEntriesByMonthParams = {
  month: string; // YYYY-MM
  userId: string;
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'dueDate' | 'amount' | 'description';
  order?: 'asc' | 'desc';
};

export type LoadEntriesByMonthResult = {
  data: EntryModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
  summary?: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    entriesCount: number;
  };
};
