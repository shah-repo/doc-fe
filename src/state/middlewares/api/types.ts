export interface AsyncActionErrorResponse {
  data: {
    message: string | string[];
  };
}

export interface TokenRefreshRequestBody {
  RefreshToken: string;
}
