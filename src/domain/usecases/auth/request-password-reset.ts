export interface RequestPasswordReset {
  request(
    params: RequestPasswordResetParams
  ): Promise<RequestPasswordResetModel>;
}

export interface RequestPasswordResetParams {
  email: string;
}

export interface RequestPasswordResetModel {
  success: boolean;
  message: string;
}
