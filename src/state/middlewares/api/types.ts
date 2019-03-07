export interface AsyncActionErrorResponse {
  data: {
    error: string | string[];
  };
}

export interface TokenRefreshRequestBody {
  RefreshToken: string;
}
