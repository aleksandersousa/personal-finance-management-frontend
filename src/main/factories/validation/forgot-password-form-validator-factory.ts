import {
  makeForgotPasswordFormValidator,
  ForgotPasswordFormData,
} from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeForgotPasswordFormValidatorFactory(): FormValidator<ForgotPasswordFormData> {
  return makeForgotPasswordFormValidator();
}
