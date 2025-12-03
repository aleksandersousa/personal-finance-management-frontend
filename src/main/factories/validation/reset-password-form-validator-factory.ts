import {
  makeResetPasswordFormValidator,
  ResetPasswordFormData,
} from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeResetPasswordFormValidatorFactory(): FormValidator<ResetPasswordFormData> {
  return makeResetPasswordFormValidator();
}
