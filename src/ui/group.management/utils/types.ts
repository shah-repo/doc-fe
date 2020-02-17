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
