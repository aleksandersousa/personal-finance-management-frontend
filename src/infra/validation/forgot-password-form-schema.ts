import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
  email: z.email('Email deve ter formato válido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;
