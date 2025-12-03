export interface RefreshToken {
  refresh(refreshToken: string): Promise<RefreshTokenModel>;
}

export interface RefreshTokenModel {
  accessToken: string;
  expiresIn: number;
}
