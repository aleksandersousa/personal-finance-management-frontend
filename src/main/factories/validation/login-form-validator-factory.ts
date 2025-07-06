import {
  ZodFormValidator,
  loginFormSchema,
  LoginFormData,
} from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeLoginFormValidator(): FormValidator<LoginFormData> {
  return new ZodFormValidator(loginFormSchema);
}
