import { GroupTag, Permission } from "../auth/types";
import { Id } from "../common";
import { SET_JOINED_DATA } from "../userManagement/constants";
import { LoadCompanyGroups } from "../userManagement/types";

export interface GroupRequestBody {
  id: string;
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

