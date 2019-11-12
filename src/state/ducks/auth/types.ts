import { Company } from "../company";
import { AUTH_TOKENS, AUTH_USER, LOGOUT_USER, USER_PERMISSIONS } from "./constants";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginWithCodeRequestBody {
  code: string;
}

export interface LogoutRequestBody {
  AccessToken: string;
}

export interface AuthResponse {
  AccessToken: string;
  RefreshToken?: string;
  ExpiresIn: number;
  IdToken: string;
  id: string;
  name: string;
  email: string;
  company: Company;
}

export interface AuthWithCodeResponse extends AuthResponse {
  email: string;
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
  id: string;
  email: string;
  name: string;
  employeeId: string;
  sessionId: string;
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
  id: string;
  email: string;
  name: string;
  employeeId: string;
  sessionId: string;
}

export interface AuthProps {
  currentUserEmail: string;
}

export interface UserPermissionsAction {
  type: typeof USER_PERMISSIONS;
  payload: string[];
}

export type UserPermissionsState = string[];
