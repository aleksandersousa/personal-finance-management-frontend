'use client';

import { EntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { makeRemoteAddEntry } from '@/main/factories/usecases';
import { makeCookieStorageAdapter } from '@/main/factories/storage';

export function EntryFormWithFeedbackFactory() {
  const validator = makeEntryFormValidator();
  const addEntry = makeRemoteAddEntry();
  const getStorage = makeCookieStorageAdapter();

  return (
    <EntryFormWithFeedback
      validator={validator}
      addEntry={addEntry}
      getStorage={getStorage}
    />
  );
}
