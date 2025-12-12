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
  createdAt: Date;
  updatedAt: Date;
}
