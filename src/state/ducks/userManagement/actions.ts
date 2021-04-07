import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { authActions } from "../auth";
import { Group, User } from "../auth/types";
import { EDIT_EMPLOYEE_ACTIVE_STATUS, EDIT_EMPLOYEE_GROUPS, EDIT_EMPLOYEE_USER_INFO } from "../tableSearch/constants";
import { EditActiveStatusAction, EditGroupsAction, EditUserInfoAction } from "../tableSearch/types";
import { ADD_EMPLOYEE_POST_ASYNC, API_TOKEN, API_TOKEN_DELETE_ASYNC, API_TOKEN_GET_ASYNC, API_TOKEN_POST_ASYNC, API_TOKEN_REVOKE_URL, API_TOKEN_URL, COMPANY_GROUPS_GET_ASYNC, COMPANY_GROUPS_LIST, EMPLOYEES_URL, EMPLOYEE_GET_ASYNC, GROUPS_ME_GET_ASYNC, GROUPS_ME_URL, GROUPS_URL, GROUP_GET_BY_ID, SLACK_URL } from "./constants";
import { AddEmployeeRequest, ApiTokenData, CompanyGroupsListAction, EmployeeActiveStatusRequestBody, EmployeeGroupsEditRequestBody, GetApiTokenList, GetEmployeeResponse, GetSlackUrl, LoadCompanyGroups } from "./types";

const companyGroupsList = (
  groups: LoadCompanyGroups,
): CompanyGroupsListAction => ({
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

const getEmployee = (
  params: any = {},
  handlers: Handlers,
): ApiAction<GetEmployeeResponse[]> =>
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

const loadGroupById = (
  id: string,
  handlers: Handlers): ApiAction<Group> => apiActionWithCallbacks({
  url: `${GROUPS_URL}/${id}`,
  method: "get",
  asyncType: GROUP_GET_BY_ID,
  handlers,
});

const editSelectedEmployeeGroups = (
  employee: GetEmployeeResponse,
): EditGroupsAction => ({
  type: EDIT_EMPLOYEE_GROUPS,
  payload: employee,
});

const editSelectedEmployeeAciveStatus = (
  employee: GetEmployeeResponse,
): EditActiveStatusAction => ({
  type: EDIT_EMPLOYEE_ACTIVE_STATUS,
  payload: employee,
});

const editEmployeeGroups = (
  employeeId: string,
  body: EmployeeGroupsEditRequestBody,
  handlers: Handlers,
): ApiAction<GetEmployeeResponse> =>
  apiActionWithCallbacks({
    url: `${EMPLOYEES_URL}/${employeeId}`,
    method: "patch",
    data: body,
    onSuccess: (employee, dispatch) => {
      dispatch(editSelectedEmployeeGroups(employee));
      dispatch(authActions.loadUserGroups());
    },
    handlers,
  });

const editEmployeeActiveStatus = (
  employeeId: string,
  body: EmployeeActiveStatusRequestBody,
  handlers: Handlers,
): ApiAction<GetEmployeeResponse> =>
  apiActionWithCallbacks({
    url: `${EMPLOYEES_URL}/${employeeId}`,
    method: "patch",
    data: body,
    onSuccess: (employee, dispatch) => {
      dispatch(editSelectedEmployeeAciveStatus(employee));
    },
    handlers,
  });

const getSlackUrl = (
  redirectUriEnv: string,
  url: string,
  handlers: Handlers,
): ApiAction<GetSlackUrl> => apiActionWithCallbacks({
  url: `${url}`,
  method: "get",
  params: { redirectUriEnv },
  asyncType: SLACK_URL,
  handlers,
});

const editSelectedEmployeeUserInfo = (user: User): EditUserInfoAction => ({
  type: EDIT_EMPLOYEE_USER_INFO,
  payload: user,
});

const generateApiToken = (data: ApiTokenData, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${API_TOKEN_URL}`,
    asyncType: API_TOKEN_POST_ASYNC,
    method: "post",
    data,
    handlers,
  });


const getApiTokenList = (): ApiAction<GetApiTokenList[]> =>
  apiAction({
    url: `${API_TOKEN}`,
    asyncType: API_TOKEN_GET_ASYNC,
    method: "get",
  });

const revokeApiToken = (id: string, handlers: Handlers): ApiAction<GetApiTokenList> =>
  apiActionWithCallbacks({
    url: `${API_TOKEN_REVOKE_URL}/${id}`,
    asyncType: API_TOKEN_DELETE_ASYNC,
    method: "delete",
    handlers,
  });


export default {
  loadCompanyGroups,
  loadGroupsMe,
  editEmployeeGroups,
  addEmployee,
  getEmployee,
  getSlackUrl,
  editSelectedEmployeeUserInfo,
  companyGroupsList,
  editSelectedEmployeeGroups,
  editEmployeeActiveStatus,
  generateApiToken,
  getApiTokenList,
  revokeApiToken,
  loadGroupById,
};
