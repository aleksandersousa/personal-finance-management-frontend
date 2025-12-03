export interface VerifyEmail {
  verify(params: VerifyEmailParams): Promise<VerifyEmailModel>;
}

export interface VerifyEmailParams {
  token: string;
}

export interface VerifyEmailModel {
  success: boolean;
  message: string;
}
