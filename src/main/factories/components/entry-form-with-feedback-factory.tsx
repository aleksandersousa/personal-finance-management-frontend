'use client';

import { EntryFormWithFeedback } from '@/presentation/components/client/entry-form-with-feedback';
import { makeEntryFormValidator } from '@/main/factories/validation/entry-form-validator-factory';

export function EntryFormWithFeedbackFactory() {
  const validator = makeEntryFormValidator();

  return <EntryFormWithFeedback validator={validator} />;
}
