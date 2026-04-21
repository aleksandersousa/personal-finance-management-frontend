import { EntryModel } from '@/domain/models';

export interface AddEntry {
  add: (params: AddEntryParams) => Promise<EntryModel>;
}

export type AddEntryParams = {
  amount: number;
  description: string;
  issueDate: Date;
  dueDate: Date;
  categoryId: string;
  recurrenceId?: string;
};
