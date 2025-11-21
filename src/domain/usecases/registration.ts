import { AuthTokens } from '@/domain/models';

export interface Registration {
  register(params: RegistrationParams): Promise<RegistrationModel>;
}

export interface RegistrationParams {
  name: string;
  email: string;
  password: string;
}

export interface RegistrationModel {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  tokens: AuthTokens;
}
