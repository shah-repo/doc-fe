import { GroupTag, Permission } from "../auth";
import { Id } from "../common";
import { LoadCompanyGroups, SET_JOINED_DATA } from "../userManagement";

export interface GroupRequestBody {
  id?: string;
  name?: string;
  permissions: Permission[];
  defaultForNewUsers: boolean;
  isOfficial: boolean;
  tags: GroupTag[];
  employees: Id[];
  parents: Id[];
}

export interface LoadJoinedDataAction {
  type: typeof SET_JOINED_DATA;
  payload: LoadCompanyGroups;
}

