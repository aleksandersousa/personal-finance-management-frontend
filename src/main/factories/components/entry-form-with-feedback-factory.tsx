'use client';

import { EntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';
import { makeRemoteAddEntry } from '@/main/factories/usecases';
import { LocalTokenStorage } from '@/infra/storage/local-token-storage';

export function EntryFormWithFeedbackFactory() {
  const validator = makeEntryFormValidator();
  const addEntry = makeRemoteAddEntry();
  const tokenStorage = new LocalTokenStorage();

  return (
    <EntryFormWithFeedback
      validator={validator}
      addEntry={addEntry}
      tokenStorage={tokenStorage}
    />
  );
}
