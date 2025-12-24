export interface EntryModel {
  id: string;
  amount: number; // em centavos
  description: string;
  type: 'INCOME' | 'EXPENSE';
  isFixed: boolean;
  isPaid: boolean;
  categoryId: string;
  categoryName: string;
  userId: string;
  date: Date;
  isFromPreviousMonth?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
