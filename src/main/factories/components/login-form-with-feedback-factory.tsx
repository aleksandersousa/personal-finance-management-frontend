'use client';

import { LoginFormWithFeedback } from '@/presentation/components';
import { makeLoginFormValidator } from '@/main/factories/validation';
import { makeRemoteAuthentication } from '../usecases';
import { LocalTokenStorage } from '@/infra';

export function LoginFormWithFeedbackFactory() {
  const validator = makeLoginFormValidator();
  const authentication = makeRemoteAuthentication();
  const tokenStorage = new LocalTokenStorage();

  return (
    <LoginFormWithFeedback
      validator={validator}
      authentication={authentication}
      tokenStorage={tokenStorage}
    />
  );
}
