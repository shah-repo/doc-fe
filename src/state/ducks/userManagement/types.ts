import { Dictionary } from "lodash";
import { Group, GroupTag, Permission } from "../auth/types";
import { Id, Nullable, User } from "../common";
import { Company, Employee } from "../company";
import { COMPANY_GROUPS_LIST, COMPANY_SLACK_URL } from "./constants";

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
}

export interface EmployeeGroupsEditRequestBody {
  groups: GroupsId[];
}

interface GroupsId {
  id: string;
}

export interface LoadCompanyGroups extends Array<LoadCompanyGroup> {}

export interface CompanyGroupsListAction {
  type: typeof COMPANY_GROUPS_LIST;
  payload: LoadCompanyGroups;
}

export type GroupsByIdState = Dictionary<LoadCompanyGroup>;

export type GroupsAllIdsState = string[];

export interface GetCompanyUrlAction {
  type: typeof COMPANY_SLACK_URL;
}
