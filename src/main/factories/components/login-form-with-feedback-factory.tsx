'use client';

import { LoginFormWithFeedback } from '@/presentation/components';
import { makeLoginFormValidator } from '@/main/factories/validation';
import { makeRemoteAuthentication } from '../usecases';
import { makeCookieStorageAdapter } from '@/main';

export function LoginFormWithFeedbackFactory() {
  const validator = makeLoginFormValidator();
  const authentication = makeRemoteAuthentication();
  const setStorage = makeCookieStorageAdapter();

  return (
    <LoginFormWithFeedback
      validator={validator}
      authentication={authentication}
      setStorage={setStorage}
    />
  );
}
