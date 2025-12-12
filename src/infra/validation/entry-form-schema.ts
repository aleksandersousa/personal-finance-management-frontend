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
    message: 'Tipo deve ser Receita ou Despesa',
  }),
  categoryId: z.preprocess(
    val => (val === null || val === '' ? undefined : val),
    z.string().optional()
  ),
  date: z.date({
    message: 'Data inválida',
  }),
  isFixed: z.boolean(),
  isPaid: z.boolean().optional(),
});

export type EntryFormData = z.infer<typeof entryFormSchema>;
