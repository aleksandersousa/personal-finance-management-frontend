export interface EntryModel {
  id: string;
  recurrenceId: string | null;
  userId: string;
  categoryId: string | null;
  description: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  isPaid: boolean;
  entryType?: 'INCOME' | 'EXPENSE';
  categoryName?: string | null;
  isFromPreviousMonth?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
