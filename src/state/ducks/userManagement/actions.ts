import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import {
  ADD_EMPLOYEE_POST_ASYNC,
  COMPANY_GROUPS_GET_ASYNC,
  COMPANY_GROUPS_LIST,
  EMPLOYEE_GET_ASYNC,
  EMPLOYEES_URL,
  GROUPS_URL,
} from "./constants";
import {
  AddEmployeeRequest,
  CompanyGroupsListAction,
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

export default {
  loadCompanyGroups,
  addEmployee,
  getEmployee,
};
