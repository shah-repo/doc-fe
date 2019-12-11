import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { Group } from "../auth/types";
import { tableSearchActions } from "../tableSearch";
import {
  ADD_EMPLOYEE_POST_ASYNC,
  COMPANY_GROUPS_GET_ASYNC,
  COMPANY_GROUPS_LIST,
  EMPLOYEE_GET_ASYNC,
  EMPLOYEES_URL,
  GROUPS_ME_GET_ASYNC,
  GROUPS_ME_URL,
  GROUPS_URL,
} from "./constants";
import {
  AddEmployeeRequest,
  CompanyGroupsListAction,
  EmployeeGroupsEditRequestBody,
  GetEmployeeResponse,
  LoadCompanyGroups,
} from "./types";

const companyGroupsList = (groups: LoadCompanyGroups): CompanyGroupsListAction => ({
  type: COMPANY_GROUPS_LIST,
  payload: groups,
});

const loadCompanyGroups = (): ApiAction<LoadCompanyGroups> =>
  apiAction({
    url: `${GROUPS_URL}`,
    asyncType: COMPANY_GROUPS_GET_ASYNC,
    method: "get",
    onSuccess: (groups, dispatch) => {
      dispatch(companyGroupsList(groups));
    },
  });

const addEmployee = (data: AddEmployeeRequest, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${EMPLOYEES_URL}`,
    asyncType: ADD_EMPLOYEE_POST_ASYNC,
    method: "post",
    data,
    handlers,
  });

const getEmployee = (params: any = {}, handlers: Handlers): ApiAction<GetEmployeeResponse[]> =>
  apiActionWithCallbacks({
    url: `${EMPLOYEES_URL}`,
    asyncType: EMPLOYEE_GET_ASYNC,
    method: "get",
    params,
    handlers,
  });

const loadGroupsMe = (handlers: Handlers): ApiAction<Group[]> =>
  apiActionWithCallbacks({
    url: `${GROUPS_ME_URL}`,
    asyncType: GROUPS_ME_GET_ASYNC,
    method: "get",
    handlers,
  });

const editEmployeeGroups = (employeeId: string, body: EmployeeGroupsEditRequestBody, handlers: Handlers):
  ApiAction<GetEmployeeResponse> => apiActionWithCallbacks({
    url: `${EMPLOYEES_URL}/${employeeId}`,
    method: "patch",
    data: body,
    onSuccess: (employee, dispatch) => {
      dispatch(tableSearchActions.editEmployee(employee));
    },
    handlers,
  });

export default {
  loadCompanyGroups,
  loadGroupsMe,
  editEmployeeGroups,
  addEmployee,
  getEmployee,
};
