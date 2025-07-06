'use client';

import { useTransition } from 'react';
import { LoginForm } from './login-form';
import { LoginFormData } from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';
import { loginAction } from '@/presentation/actions';
import type { Authentication } from '@/domain/usecases';
import type { SetStorage } from '@/data/protocols';

export interface LoginFormWithFeedbackProps {
  validator: FormValidator<LoginFormData>;
  authentication: Authentication;
  setStorage: SetStorage;
}

export const LoginFormWithFeedback: React.FC<LoginFormWithFeedbackProps> = ({
  validator,
  authentication,
  setStorage,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: LoginFormData) => {
    startTransition(async () => {
      await loginAction(data, authentication, setStorage);
    });
  };

  return (
    <LoginForm
      validator={validator}
      onSubmit={handleSubmit}
      isLoading={isPending}
    />
  );
};
