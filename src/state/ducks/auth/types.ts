import { AUTH_TOKENS, AUTH_USER, LOGOUT_USER } from "./constants";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LogoutRequestBody {
  AccessToken: string;
}

export interface AuthResponse {
  AccessToken: string;
  RefreshToken?: string;
  ExpiresIn: number;
  IdToken: string;
}

export interface Token {
  value: string;
  expiresAt: string;
}

export interface Tokens {
  id: Token;
  access: Token;
  refresh?: Token;
}

export interface User {
  email: string;
}

export type AuthUserPayload = User;

export interface AuthTokensPayload {
  tokens: Tokens;
}

export interface AuthTokensAction {
  type: typeof AUTH_TOKENS;
  payload: AuthTokensPayload;
}

export interface AuthUserAction {
  type: typeof AUTH_USER;
  payload: AuthUserPayload;
}

export interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

export type TokensState = Required<Tokens>;
export interface UserState {
  email: string;
}
