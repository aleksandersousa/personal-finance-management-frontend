'use client';

import { useState, useTransition } from 'react';
import { EditCategoryForm } from './edit-category-form';
import { FormValidator } from '@/presentation/protocols';
import { CategoryFormData } from '@/infra/validation';
import { updateCategoryAction } from '@/presentation/actions';

export interface EditCategoryFormWithFeedbackProps {
  categoryId: string;
  validator: FormValidator<CategoryFormData>;
}

export function EditCategoryFormWithFeedback({
  categoryId,
  validator,
}: EditCategoryFormWithFeedbackProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);

    try {
      await updateCategoryAction(categoryId, data);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditCategoryForm
      categoryId={categoryId}
      validator={validator}
      onSubmit={handleSubmit}
      isLoading={isLoading || isPending}
    />
  );
}
