'use server';

import { RegistrationFormData } from '@/infra/validation';
import { RegistrationParams, RegistrationModel } from '@/domain/usecases';
import { makeRemoteRegistration } from '@/main/factories/usecases/auth/registration-factory';
import { isRedirectError } from '@/presentation/helpers';

export async function registrationAction(
  data: RegistrationFormData
): Promise<RegistrationModel> {
  const params: RegistrationParams = {
    name: data.name,
    email: data.email,
    password: data.password,
  };

  const registration = makeRemoteRegistration();

  try {
    const result = await registration.register(params);
    return result;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error('Registration error:', error);
    throw error;
  }
}
