import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email('Email deve ter formato válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
