import { AddEmployeeFormValues } from "../../../ui/user.management/add.employee/form.container";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  ADD_EMPLOYEE_POST_ASYNC,
  COMPANY_GROUPS_GET_ASYNC,
  EMPLOYEES_URL,
  GROUPS_URL,
} from "./constants";
import { LoadCompanyGroups } from "./types";

const loadCompanyGroups = (handlers: Handlers): ApiAction<LoadCompanyGroups> =>
  apiActionWithCallbacks({
    url: `${GROUPS_URL}`,
    asyncType: COMPANY_GROUPS_GET_ASYNC,
    method: "get",
    handlers,
  });

const addEmployee = (data: AddEmployeeFormValues, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${EMPLOYEES_URL}`,
    asyncType: ADD_EMPLOYEE_POST_ASYNC,
    method: "post",
    data,
    handlers,
  });

export default {
  loadCompanyGroups,
  addEmployee,
};
