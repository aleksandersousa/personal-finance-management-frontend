import { AuthTokens } from '@/domain/models';

export interface Authentication {
  auth(params: AuthenticationParams): Promise<AuthenticationModel>;
}

export interface AuthenticationParams {
  email: string;
  password: string;
}

export interface AuthenticationModel {
  user: {
    id: string;
    name: string;
    email: string;
  };
  tokens: AuthTokens;
}
