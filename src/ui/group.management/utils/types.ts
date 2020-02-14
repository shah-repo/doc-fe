import { LoadCompanyGroup } from "../../../state/ducks/userManagement";
import { COMPANY_DEFAULT_STATE } from "../../../state/ducks/company/reducers";

export const DEFAULT_SELECTED_GROUP: LoadCompanyGroup = {
    id: "",
    name: "",
    permissions: [],
    defaultForNewUsers: true,
    tags: null,
    company: COMPANY_DEFAULT_STATE,
    employees: [],
  };
