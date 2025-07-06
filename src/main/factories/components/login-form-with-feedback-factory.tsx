'use client';

import { LoginFormWithFeedback } from '@/presentation/components';
import { makeLoginFormValidator } from '@/main/factories/validation';
import { makeRemoteAuthentication } from '../usecases';
import { makeLocalStorageAdapter } from '@/main';

export function LoginFormWithFeedbackFactory() {
  const validator = makeLoginFormValidator();
  const authentication = makeRemoteAuthentication();
  const setStorage = makeLocalStorageAdapter();

  return (
    <LoginFormWithFeedback
      validator={validator}
      authentication={authentication}
      setStorage={setStorage}
    />
  );
}
