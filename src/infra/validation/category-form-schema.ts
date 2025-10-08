import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(255, 'Descrição muito longa').optional(),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Tipo deve ser Receita ou Despesa',
  }),
  color: z
    .string()
    .min(1, 'Cor é obrigatória')
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Cor deve estar no formato hexadecimal (#RRGGBB)'
    ),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
