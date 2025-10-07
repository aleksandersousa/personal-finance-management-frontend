'use client';

import { LoginForm } from '@/presentation/components';
import { makeLoginFormValidator } from '@/main/factories/validation';

export function LoginFormFactory() {
  const validator = makeLoginFormValidator();
  return <LoginForm validator={validator} />;
}
