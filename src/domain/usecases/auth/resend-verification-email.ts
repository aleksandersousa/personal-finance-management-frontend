export interface ResendVerificationEmail {
  resend(
    params: ResendVerificationEmailParams
  ): Promise<ResendVerificationEmailModel>;
}

export interface ResendVerificationEmailParams {
  email: string;
}

export interface ResendVerificationEmailModel {
  success: boolean;
  message: string;
}
