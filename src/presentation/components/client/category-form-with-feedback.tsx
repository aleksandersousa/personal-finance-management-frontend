'use client';

import { useState, useTransition } from 'react';
import { CategoryForm } from './category-form';
import { FormValidator } from '@/presentation/protocols';
import { CategoryFormData } from '@/infra/validation';
import { addCategoryAction } from '@/presentation/actions';

export interface CategoryFormWithFeedbackProps {
  validator: FormValidator<CategoryFormData>;
}

export function CategoryFormWithFeedback({
  validator,
}: CategoryFormWithFeedbackProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);

    try {
      await addCategoryAction(data);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CategoryForm
      validator={validator}
      onSubmit={handleSubmit}
      isLoading={isLoading || isPending}
    />
  );
}
