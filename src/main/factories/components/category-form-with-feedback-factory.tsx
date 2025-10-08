'use client';

import { CategoryFormWithFeedback } from '@/presentation/components';
import { makeCategoryFormValidator } from '@/main/factories/validation';

export function CategoryFormWithFeedbackFactory() {
  const validator = makeCategoryFormValidator();

  return <CategoryFormWithFeedback validator={validator} />;
}
