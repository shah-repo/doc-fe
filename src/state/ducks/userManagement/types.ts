import { Group, GroupTag, Permission } from "../auth/types";
import { Nullable, User } from "../common";
import { Company, Employee } from "../company";

export interface GetEmployeeResponse {
  id: string;
  active: boolean;
  groups: Group[];
  user: User;
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

export interface LoadCompanyGroups extends Array<LoadCompanyGroup> {}
