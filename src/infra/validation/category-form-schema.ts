import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(255, 'Descrição muito longa').optional(),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Tipo deve ser INCOME ou EXPENSE',
  }),
  color: z
    .string()
    .min(1, 'Cor é obrigatória')
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Cor deve estar no formato hexadecimal (#RRGGBB)'
    ),
  icon: z
    .string()
    .min(1, 'Ícone é obrigatório')
    .max(50, 'Nome do ícone muito longo'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
