import { GetEmployeeResponse } from "../../../state/ducks/userManagement/types";

export const DEFAULT_SELECTED_EMPLOYEE: GetEmployeeResponse = {
  id: "",
  active: false,
  user: {
    avatar: null,
    id: "",
    name: "",
    email: "",
  },
  groups: [],
};
