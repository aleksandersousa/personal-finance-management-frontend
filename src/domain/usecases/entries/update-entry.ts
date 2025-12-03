import { EntryModel } from '../models/entry';

export interface UpdateEntry {
  update(params: UpdateEntryParams): Promise<EntryModel>;
}

export interface UpdateEntryParams {
  id: string;
  description: string;
  amount: number; // Em centavos
  type: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  date: Date;
  isFixed: boolean;
}
