import {
  ZodFormValidator,
  forgotPasswordFormSchema,
  ForgotPasswordFormData,
} from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeForgotPasswordFormValidator(): FormValidator<ForgotPasswordFormData> {
  return new ZodFormValidator(forgotPasswordFormSchema);
}
