import { z } from 'zod';

export const entryFormSchema = z
  .object({
    description: z
      .string()
      .min(1, 'Descrição é obrigatória')
      .max(255, 'Descrição muito longa'),
    amount: z
      .number()
      .positive('Valor deve ser positivo')
      .max(999999.99, 'Valor muito alto'),
    categoryId: z.preprocess(
      val => (val === null || val === '' ? undefined : val),
      z.string().min(1, 'Categoria é obrigatória')
    ),
    issueDate: z.date({
      message: 'Data de emissão inválida',
    }),
    dueDate: z.date({
      message: 'Data de vencimento inválida',
    }),
  })
  .refine(
    data => {
      const issueDate = new Date(data.issueDate);
      issueDate.setHours(0, 0, 0, 0);
      const dueDate = new Date(data.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() >= issueDate.getTime();
    },
    {
      message: 'Data de vencimento não pode ser anterior à data de emissão',
      path: ['dueDate'],
    }
  );

export type EntryFormData = z.infer<typeof entryFormSchema>;
