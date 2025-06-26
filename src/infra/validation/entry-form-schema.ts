import { z } from 'zod';

export const entryFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição muito longa'),
  amount: z
    .number()
    .positive('Valor deve ser positivo')
    .max(999999.99, 'Valor muito alto'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Tipo é obrigatório',
    invalid_type_error: 'Tipo deve ser INCOME ou EXPENSE',
  }),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  date: z.date({
    required_error: 'Data é obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  isFixed: z.boolean(),
});

export type EntryFormData = z.infer<typeof entryFormSchema>;
