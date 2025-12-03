import {
  ZodFormValidator,
  resetPasswordFormSchema,
  ResetPasswordFormData,
} from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeResetPasswordFormValidator(): FormValidator<ResetPasswordFormData> {
  return new ZodFormValidator(resetPasswordFormSchema);
}
