'use client';

import { EntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';

export function EntryFormWithFeedbackFactory() {
  const validator = makeEntryFormValidator();

  return <EntryFormWithFeedback validator={validator} />;
}
