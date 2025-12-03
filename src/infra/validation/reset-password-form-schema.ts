import { z } from 'zod';

export const resetPasswordFormSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
