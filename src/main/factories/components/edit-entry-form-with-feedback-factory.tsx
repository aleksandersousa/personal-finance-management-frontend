'use client';

import { EditEntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { makeRemoteUpdateEntry } from '@/main/factories/usecases';
import { EntryModel } from '@/domain/models/entry';

export interface EditEntryFormWithFeedbackFactoryProps {
  entry: EntryModel;
}

export function EditEntryFormWithFeedbackFactory({
  entry,
}: EditEntryFormWithFeedbackFactoryProps) {
  const validator = makeEntryFormValidator();
  const updateEntry = makeRemoteUpdateEntry();

  return (
    <EditEntryFormWithFeedback
      entry={entry}
      validator={validator}
      updateEntry={updateEntry}
    />
  );
}
