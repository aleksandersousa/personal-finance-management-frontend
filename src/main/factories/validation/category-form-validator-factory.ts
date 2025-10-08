import { ZodFormValidator } from '@/infra/validation';
import { categoryFormSchema, CategoryFormData } from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeCategoryFormValidator(): FormValidator<CategoryFormData> {
  return new ZodFormValidator(categoryFormSchema);
}
