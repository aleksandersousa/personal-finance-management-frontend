'use client';

import { EntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { makeRemoteAddEntry } from '@/main/factories/usecases';
import { LocalStorageAdapter } from '@/infra/storage';

export function EntryFormWithFeedbackFactory() {
  const validator = makeEntryFormValidator();
  const addEntry = makeRemoteAddEntry();
  const getStorage = new LocalStorageAdapter();

  return (
    <EntryFormWithFeedback
      validator={validator}
      addEntry={addEntry}
      getStorage={getStorage}
    />
  );
}
