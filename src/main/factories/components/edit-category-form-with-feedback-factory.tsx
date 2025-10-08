'use client';

import { EditCategoryFormWithFeedback } from '@/presentation/components';
import { makeCategoryFormValidator } from '@/main/factories/validation';

export interface EditCategoryFormWithFeedbackFactoryProps {
  categoryId: string;
}

export function EditCategoryFormWithFeedbackFactory({
  categoryId,
}: EditCategoryFormWithFeedbackFactoryProps) {
  const validator = makeCategoryFormValidator();

  return (
    <EditCategoryFormWithFeedback
      categoryId={categoryId}
      validator={validator}
    />
  );
}
