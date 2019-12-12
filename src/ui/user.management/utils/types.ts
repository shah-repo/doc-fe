import { GetEmployeeResponse } from "../../../state/ducks/userManagement";

export interface RouteParams {
  userId: string;
}

export const DEFAULT_SELECTED_EMPLOYEE: GetEmployeeResponse = {
  id: "",
  active: false,
  user: {
    id: "",
    name: "",
    email: "",
  },
  groups: [],
};
