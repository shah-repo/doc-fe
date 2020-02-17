import { Nullable } from "../common";
import { Employee } from "../company";
import {
  AUTH_USER,
  CONFIRM_FORGOT_PASSWORD_URL,
  CONFIRM_SET_NEW_PASSWORD_URL,
  FORGOT_PASSWORD_URL,
  LOGOUT_USER,
  SET_EMPLOYEE,
  SIGNUP_URL,
  USER_GROUPS,
  USERS_ME_URL,
} from "./constants";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ForgotPasswordConfirmation {
  email: string;
  code: string;
  password: string;
}

export interface  NewPasswordConfirmation {
  email: string;
  newPassword: string;
  oldPassword: string;
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
  avatar: string | null;
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
  avatar: string | null;
}

export interface Group {
  id: string;
  name: string;
  tags: Nullable<GroupTag[]>;
  permissions: Permission[];
}

export type AuthUserPayload = User;

export interface AuthUserAction {
  type: typeof AUTH_USER;
  payload: AuthResponse;
}

export interface SignupAction {
  type: typeof SIGNUP_URL;
}

export interface ForgotPasswordAction {
  type: typeof FORGOT_PASSWORD_URL;
}

export interface ConfirmPasswordAction {
  type: typeof CONFIRM_FORGOT_PASSWORD_URL;
}

export interface NewUserSetPasswordAction {
  type: typeof CONFIRM_SET_NEW_PASSWORD_URL;
}

export interface LogoutUserAction {
  type: typeof LOGOUT_USER;
}

export interface EditUserMeAction {
  type: typeof USERS_ME_URL;
  payload: User;
}

export interface UserState {
  id: string;
  email: string;
  name: string;
  employeeId: string;
  sessionId: string;
  employees: Employee[];
  avatar: string | null;
  groups: Group[];
  employee: Employee;
}

export interface AuthProps {
  currentUserEmail: string;
}

export interface UserGroupsAction {
  type: typeof USER_GROUPS;
  payload: Group[];
}

export interface UserGroupsState {
  tags: GroupTag[];
  permissions: Permission[];
}

export interface SelectEmployeeAction {
  type: typeof SET_EMPLOYEE;
  payload: Employee;
}

export interface EmployeeEditRequestBody {
  name: string;
  avatar: string | null;
}

export enum Permission {
  // Company
  COMPANY_BOOTSTRAP = "COMPANY_BOOTSTRAP",
  COMPANY_CREATE = "COMPANY_CREATE",
  COMPANY_DELETE = "COMPANY_DELETE",
  COMPANY_GET = "COMPANY_GET",
  COMPANY_UPDATE = "COMPANY_UPDATE",
  COMPANY_UPDATE_CURRENT = "COMPANY_UPDATE_CURRENT",
  CR_OWNER_AS_APPROVER = "CR_OWNER_AS_APPROVER",
  CR_ON_APPROVER_LIST = "CR_ON_APPROVER_LIST",
  // Company data
  // COMPANY_DATA = "COMPANY_DATA",
  // Employee
  EMPLOYEE_CREATE = "EMPLOYEE_CREATE",
  EMPLOYEE_DELETE = "EMPLOYEE_DELETE",
  EMPLOYEE_GET = "EMPLOYEE_GET",
  EMPLOYEE_UPDATE = "EMPLOYEE_UPDATE",
  EMPLOYEE_ADMIN_CREATE = "EMPLOYEE_ADMIN_CREATE",
  EMPLOYEE_ADMIN_DELETE = "EMPLOYEE_ADMIN_DELETE",
  EMPLOYEE_ADMIN_UPDATE = "EMPLOYEE_ADMIN_UPDATE",
  EMPLOYEE_ADMIN_GET = "EMPLOYEE_ADMIN_GET",
  FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED = "FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED",
  // Group
  GROUP_CREATE = "GROUP_CREATE",
  GROUP_DELETE = "GROUP_DELETE",
  GROUP_GET = "GROUP_GET",
  GROUP_UPDATE = "GROUP_UPDATE",
  // Users
  USERS_CREATE = "USERS_CREATE",
  USERS_GET = "USERS_GET",
  USERS_UPDATE = "USERS_UPDATE",
  // Suppliers
  SUPPLIER_SURVEY_GET = "SUPPLIER_SURVEY_GET",
  SUPPLIER_SURVEY_CREATE = "SUPPLIER_SURVEY_CREATE",
  // TODO unused, remove
  USERS_GET_IN_COMPANY = "USERS_GET_IN_COMPANY",
  USERS_UPDATE_IN_COMPANY = "USERS_UPDATE_IN_COMPANY",
  USERS_ANONYMIZE_EMAILS = "USERS_ANONYMIZE_EMAILS",
  // Slack
  SLACK_APP_INSTALL = "SLACK_APP_INSTALL",
}

export enum GroupTag {
  USER_MANAGEMENT = "USER_MANAGEMENT",
  OWNERSHIP_CHANGE = "OWNERSHIP_CHANGE ",
  GROUP_MANAGEMENT = "GROUP_MANAGEMENT",
}
