import { Nullable } from "../common";
import { Employee } from "../company";
import { AUTH_USER, CLEAR_NON_AUTH_DATA, CONFIRM_FORGOT_PASSWORD_URL, CONFIRM_SET_NEW_PASSWORD_URL, FORGOT_PASSWORD_URL, LOGOUT_USER, SET_CREDENTIALS, SET_EMPLOYEE, SIGNUP_URL, TOGGLE_CUSTOM_LABELS, USERS_ME_URL, USER_GROUPS } from "./constants";

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
  iotCredentials: IotCredentials;
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
  joinedTags: Nullable<GroupTag[]>;
  permissions: Permission[];
  joinedPermissions: Nullable<Permission[]>;
  joinedParents: Group[];
  parents: Group[];
  joinedEmployees: Employee[];
  type?: GroupType;
  groupApprover?: string; // FE property for POAM check (ENC-4125)
  documentStage?: number;
}

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
  iotCredentials: IotCredentials;
  customLabels: boolean;
}

export interface IotCredentials {
  credentials: Credentials;
  endpoint: string;
  environment: string;
  companyId: string;
  region: string;
}

interface Credentials {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string;
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

export interface SetCredentialsAction {
  type: typeof SET_CREDENTIALS;
  payload: any;
}

export interface ToggleCustomLabelsAction {
  type: typeof TOGGLE_CUSTOM_LABELS;
  payload: boolean;
}

export interface EmployeeEditRequestBody {
  name: string;
  avatar: string | null;
}

export interface ClearNonAuthDataAction {
  type: typeof CLEAR_NON_AUTH_DATA;
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
  DOCUMENT_OWNER_CHANGE = "DOCUMENT_OWNER_CHANGE",
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
  HTML_UPDATE = "HTML_UPDATE",
  // Group
  GROUP_DELETE = "GROUP_DELETE",
  // Group Official
  GROUP_CREATE = "GROUP_CREATE",
  GROUP_UPDATE = "GROUP_UPDATE",
  // Group unofficial
  GROUP_CREATE_UNOFFICIAL = "GROUP_CREATE_UNOFFICIAL",
  GROUP_UPDATE_UNOFFICIAL = "GROUP_UPDATE_UNOFFICIAL",
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
  DEVELOPERS = "DEVELOPERS",
}

export enum GroupTag {
  USER_MANAGEMENT = "USER_MANAGEMENT",
  OWNERSHIP_CHANGE = "OWNERSHIP_CHANGE",
  QMS_DEFAULT = "QMS_DEFAULT",
  GROUP_MANAGEMENT = "GROUP_MANAGEMENT",
  FB_COMPONENT_PURCHASE_ORDER = "FB_COMPONENT_PURCHASE_ORDER",
  FB_COMPONENT_RECEIVE_PURCHASE_ORDER = "FB_COMPONENT_RECEIVE_PURCHASE_ORDER",
  FB_COMPONENT_INLINE_APPROVAL = "FB_COMPONENT_INLINE_APPROVAL",
  FB_COMPONENT_EQUIPMENT_MAINTENANCE = "FB_COMPONENT_EQUIPMENT_MAINTENANCE",
  FB_COMPONENT_REQUEST_APPROVAL = "FB_COMPONENT_REQUEST_APPROVAL",
  CREATE_DOCS_OF_RESTRICTED_DOC_TYPES = "CREATE_DOCS_OF_RESTRICTED_DOC_TYPES",
  NAVIGATION_WITH_RESTRICTED_DOC_TYPES = "NAVIGATION_WITH_RESTRICTED_DOC_TYPES",
  DOCUMENT_TYPE_MANAGEMENT = "DOCUMENT_TYPE_MANAGEMENT",
  LABEL_TOOLTIPS = "LABEL_TOOLTIPS",
  COMPANY_CONFIG_WHITELABELING = "COMPANY_CONFIG_WHITELABELING",
  COMPANY_CONFIG_NAVIGATION = "COMPANY_CONFIG_NAVIGATION",
  COMPANY_CONFIG_DOCUMENT_REV_STAGES = "COMPANY_CONFIG_DOCUMENT_REV_STAGES",
  PAGE_DETAILS_MANAGEMENT = "PAGE_DETAILS_MANAGEMENT"
}

export enum GroupType{
  MANAGMENT = "MANAGMENT",
  REVISION_APPROVAL = "REVISION_APPROVAL",
  PURCHASE_APPROVAL = "PURCHASE_APPROVAL",
}
