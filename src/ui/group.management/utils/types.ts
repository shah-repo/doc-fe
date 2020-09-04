import { COMPANY_DEFAULT_STATE } from "../../../state/ducks/company/reducers";
import { GroupRequestBody } from "../../../state/ducks/groupManagement/types";
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
  parents: [],
  joinedParents: [],
};

export const DEFAULT_ACTIVE_EMPLOYEES: GetEmployeeResponse[] = [{
  id: "",
  active: true,
  groups: [],
  user: {
    id: "",
    email: "",
    name: "",
  },
}];

export const DEFAULT_GROUP: GroupRequestBody = {
  name: "",
  permissions: [],
  defaultForNewUsers: false,
  isOfficial: false,
  tags: [],
  employees: [],
  parents: [],
  id: "",
};
