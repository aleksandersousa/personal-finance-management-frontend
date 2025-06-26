import { ZodFormValidator } from '@/infra/validation/zod-form-validator';
import {
  entryFormSchema,
  EntryFormData,
} from '@/infra/validation/entry-form-schema';
import { FormValidator } from '@/presentation/protocols';

export function makeEntryFormValidator(): FormValidator<EntryFormData> {
  return new ZodFormValidator(entryFormSchema);
}
