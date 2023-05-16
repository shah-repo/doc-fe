import { Dictionary } from 'lodash';
import { Group, GroupTag, GroupType, Permission } from '../auth/types';
import { Id, Nullable, User } from '../common/types';
import { Company, Employee } from '../company/types';
import { COMPANY_GROUPS_LIST } from './constants';

export interface GetEmployeeResponse {
  id: string;
  active: boolean;
  groups: Group[];
  user: User;
}

export interface UMExportDataProp extends GetEmployeeResponse {
  status: string;
}

export interface GetSlackUrl {
  url: string;
}

export interface AddEmployeeRequest {
  user: Partial<User>;
  groups: Nullable<Id[]>;
}

export interface LoadCompanyGroup {
  id: string;
  name: string;
  permissions: Permission[];
  defaultForNewUsers: boolean;
  tags: Nullable<GroupTag[]>;
  company: Company;
  employees: Employee[];
  isOfficial: boolean;
  parents: Group[];
  joinedParents: Group[];
  type?: GroupType;
  inEdit?: boolean | string;
}

export interface EmployeeGroupsEditRequestBody {
  groups: Id[];
}

export interface EmployeeActiveStatusRequestBody {
  active: boolean;
}

export type LoadCompanyGroups = LoadCompanyGroup[];

export interface CompanyGroupsListAction {
  type: typeof COMPANY_GROUPS_LIST;
  payload: LoadCompanyGroups;
}

export type GroupsByIdState = Dictionary<LoadCompanyGroup>;

export type GroupsAllIdsState = string[];

export interface ApiTokenData {
  name: string;
}

export interface ApiTokenState {
  id: string;
  secretKey: string;
  name: string;
}

export interface GetApiTokenList {
  id: string;
  name: string;
  active: boolean;
}
interface DescriptionItemsProp {
  primaryText: string;
  secondaryText: string;
}

interface UserItemProp {
  avatar: Nullable<string>;
  email: string;
  id: string;
  initialColor: string;
  name: string;
}
interface OwnerItemsProp {
  active: boolean;
  id: string;
  user: UserItemProp;
}

export interface AuditDetailsProps {
  descriptions: DescriptionItemsProp[];
  employeeDetails: Employee;
  groupId: string;
  ownerDetails: OwnerItemsProp;
  timestamp: string;
}

export enum ACTION_TITLE_MAPPING {
  AddedToGroups = 'AddedToGroups',
  AddedToGroup = 'AddedToGroup',
  CreatedNewUser = 'CreatedNewUser',
  CreatedNewUserEmail = 'CreatedNewUserEmail',
  DeactivateUser = 'DeactivateUser',
  ReactivateUser = 'ReactivateUser',
  ActivateUser = 'ActivateUser',
  Unknown = 'Unknown',
  EmployeeNameUpdated = 'EmployeeNameUpdated',
  DeletedFromGroup = 'DeletedFromGroup',
  DeletedFromGroups = 'DeletedFromGroups',
  AddedUserName = 'AddedUserName',
  AddedUserEmail = 'AddedUserEmail',
  ResetPassword = 'ResetPassword',
  ResentPassword = 'ResentPassword',
  ResetPasswordDescription = 'ResetPasswordDescription',
  ResentPasswordDescription = 'ResentPasswordDescription',
  ForUser = 'ForUser',
  EmployeesDeleteFromGroup = 'EmployeesDeleteFromGroup',
  EmployeesAddedToGroup= 'EmployeesAddedToGroup',
  EmployeesDeleteFromGroups = 'EmployeesDeleteFromGroups',
  EmployeesAddedToGroups= 'EmployeesAddedToGroups',
  RemovedUserEmail='RemovedUserEmail',
  RemovedUserName='RemovedUserName',
  RemovedGroupName='RemovedGroupName',
  GroupNameUpdated = 'GroupNameUpdated',
  AddedGroup = 'AddedGroup',
  AddedMembers = 'AddedMembers',
  AddedMember = 'AddedMember',
  AddedPermissions = 'AddedPermissions',
  AddedTags= 'AddedTags',
  AddedParentGroups='AddedParentGroups',
  RemovedMembers='RemovedMembers',
  RemovedMember='RemovedMember',
  RemovedPermissions='RemovedPermissions',
  RemovedTags='RemovedTags',
  RemovedParentGroups='RemovedParentGroups',
  UpdatedGroups='UpdatedGroups',
  UpdatedGroup='UpdatedGroup',
  Removed='Removed',
  Added='Added',
  UpdatedAvatar='UpdatedAvatar'
}

export enum UM_AUDIT_CONCAT_KEYS {
  NameSeparator = '-NAME-UPDATED-TO-',
  DeleteFromGroup = '-DELETED-FROM-GROUP-',
  AddToGroup = '-ADDED-TO-GROUP-',
  AvatarUpdated='-AVATAR-UPDATED-FOR-'
}

export interface UMAuditProps {
  fieldPath: string;
  type: string;
  employeeId: string;
  employeeName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  groupId: string;
  timestamp: string;
  id: string;
  nextValue: string;
  previousValue: string;
  userId: string;
}

export interface UMAuditGroupProps extends UMAuditProps {
  primaryText: string;
  secondaryText: string;
  auditType: ACTION_TITLE_MAPPING;
  sortedIndex: number;
  groupKey: string;
  ownerDetails: Partial<Employee>;
  employeeDetails: Partial<Employee>;
}

export interface GMAuditProps {
  fieldPath: string;
  type: string;
  employeeId: string;
  employeeName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  groupId: string;
  timestamp: string;
  companyId: string;
  companyGroupId: string;
  id: string;
  previousValue: string;
  nextValue: string;
}

export interface GMAuditGroupProps extends GMAuditProps {
  primaryText: string;
  secondaryText: string;
  auditType: ACTION_TITLE_MAPPING;
  sortedIndex: number;
  groupKey: string;
  ownerDetails: Partial<Employee>;
  employeeDetails: Partial<Employee>;
}

