import { GroupTag, Permission } from "../../../state/ducks/auth/types";
import { COMPANY_DEFAULT_STATE } from "../../../state/ducks/company/reducers";
import { GetEmployeeResponse, LoadCompanyGroup } from "../../../state/ducks/userManagement";

export const DEFAULT_SELECTED_GROUP: LoadCompanyGroup = {
    id: "",
    name: "",
    permissions: [],
    defaultForNewUsers: true,
    tags: null,
    company: COMPANY_DEFAULT_STATE,
    employees: [],
    isOfficial: true,
  };

export const DEFAULT_ACTIVE_EMPLOYEE: GetEmployeeResponse[] = [{
    id: "",
    active: true,
    groups: [],
    user: {
        id: "",
        email: "",
        name: "",
    },
  }];
// should move to ducks
export interface GroupRequestBody {
  name: string;
  permissions: Permission[];
  defaultForNewUsers: boolean;
  isOfficial: boolean;
  tags: GroupTag[];
}

export const DEFAULT_GROUP: GroupRequestBody = {
  name: "",
  permissions: [],
  defaultForNewUsers: false,
  isOfficial: false,
  tags: [],
};
