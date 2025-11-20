import {
  ZodFormValidator,
  registrationFormSchema,
  RegistrationFormData,
} from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeRegistrationFormValidator(): FormValidator<RegistrationFormData> {
  return new ZodFormValidator(registrationFormSchema);
}
