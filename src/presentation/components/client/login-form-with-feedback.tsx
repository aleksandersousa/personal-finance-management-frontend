'use client';

import { useTransition } from 'react';
import { LoginForm } from './login-form';
import { LoginFormData } from '@/infra/validation';
import { FormValidator } from '@/presentation/protocols';
import { loginAction } from '@/presentation/actions';
import type { Authentication } from '@/domain/usecases';
import type { TokenStorage } from '@/data/protocols';

export interface LoginFormWithFeedbackProps {
  validator: FormValidator<LoginFormData>;
  authentication: Authentication;
  tokenStorage: TokenStorage;
}

export const LoginFormWithFeedback: React.FC<LoginFormWithFeedbackProps> = ({
  validator,
  authentication,
  tokenStorage,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (data: LoginFormData) => {
    startTransition(async () => {
      await loginAction(data, authentication, tokenStorage);
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
