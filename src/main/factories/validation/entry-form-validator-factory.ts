import { ZodFormValidator } from '@/infra/validation';
import { entryFormSchema, EntryFormData } from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';

export function makeEntryFormValidator(): FormValidator<EntryFormData> {
  return new ZodFormValidator(entryFormSchema);
}
