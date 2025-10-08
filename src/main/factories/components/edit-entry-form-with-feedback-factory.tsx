'use client';

import { EditEntryFormWithFeedback } from '@/presentation/components';
import { makeEntryFormValidator } from '@/main/factories/validation';

export interface EditEntryFormWithFeedbackFactoryProps {
  entryId: string;
}

export function EditEntryFormWithFeedbackFactory({
  entryId,
}: EditEntryFormWithFeedbackFactoryProps) {
  const validator = makeEntryFormValidator();

  return <EditEntryFormWithFeedback entryId={entryId} validator={validator} />;
}
