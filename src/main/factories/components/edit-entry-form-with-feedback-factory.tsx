'use client';

import { EditEntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { EntryModel } from '@/domain/models/entry';

export interface EditEntryFormWithFeedbackFactoryProps {
  entry: EntryModel;
}

export function EditEntryFormWithFeedbackFactory({
  entry,
}: EditEntryFormWithFeedbackFactoryProps) {
  const validator = makeEntryFormValidator();

  return <EditEntryFormWithFeedback entry={entry} validator={validator} />;
}
