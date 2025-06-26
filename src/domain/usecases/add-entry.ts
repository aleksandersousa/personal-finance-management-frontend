import { EntryModel } from '../models/entry';

export interface AddEntry {
  add: (params: AddEntryParams) => Promise<EntryModel>;
}

export type AddEntryParams = {
  amount: number; // em centavos
  description: string;
  type: 'INCOME' | 'EXPENSE';
  isFixed: boolean;
  categoryId: string;
  userId: string;
  date: Date;
};
