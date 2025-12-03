export interface ResetPassword {
  reset(params: ResetPasswordParams): Promise<ResetPasswordModel>;
}

export interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

export interface ResetPasswordModel {
  success: boolean;
  message: string;
}
