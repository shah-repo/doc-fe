import { Employee } from "../company";
import {
  AUTH_USER,
  LOGOUT_USER,
  SET_EMPLOYEE,
  USER_PERMISSIONS,
} from "./constants";

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
  ExpiresAt: string;
  ExpiresIn: number;
  id: string;
  email: string;
  name: string;
  sessionId: string;
  employees: Employee[];
}

export interface Token {
  value: string;
  expiresAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  employeeId: string;
  sessionId: string;
  employees: Employee[];
}

export type AuthUserPayload = User;

export interface AuthUserAction {
  type: typeof AUTH_USER;
  payload: AuthUserPayload;
}

export interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

export interface UserState {
  id: string;
  email: string;
  name: string;
  employeeId: string;
  sessionId: string;
  employees: Employee[];
}

export interface AuthProps {
  currentUserEmail: string;
}

export interface UserPermissionsAction {
  type: typeof USER_PERMISSIONS;
  payload: string[];
}

export type UserPermissionsState = string[];

export interface SelectEmployeeAction {
  type: typeof SET_EMPLOYEE;
  payload: Employee;
}
