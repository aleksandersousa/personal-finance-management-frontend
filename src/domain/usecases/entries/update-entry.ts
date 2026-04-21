import { EntryModel } from '@/domain/models';

export interface UpdateEntry {
  update(params: UpdateEntryParams): Promise<EntryModel>;
}

export interface UpdateEntryParams {
  id: string;
  description: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  categoryId: string;
  recurrenceId?: string;
}
