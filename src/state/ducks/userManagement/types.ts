import { Dictionary } from "lodash";
import { Group, GroupTag, GroupType, Permission } from "../auth/types";
import { Id, Nullable, User } from "../common";
import { Company, Employee } from "../company";
import { COMPANY_GROUPS_LIST } from "./constants";

export interface GetEmployeeResponse {
  id: string;
  active: boolean;
  groups: Group[];
  user: User;
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
export type LoadJoinedDataState = Dictionary<LoadCompanyGroup>;

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
