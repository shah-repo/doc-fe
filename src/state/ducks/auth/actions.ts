import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApplicationState } from "../../reducers";
import { ApiAction, Handlers } from "../../types";
import { companyActions, Employee } from "../company";
import {
  AUTH_USER,
  GROUPS_URL,
  LOGIN_URL,
  LOGIN_WITH_CODE_URL,
  LOGOUT_URL,
  LOGOUT_USER,
  PING_SERVER_GET_ASYNC,
  PING_SERVER_URL,
  SET_EMPLOYEE,
  USER_GROUPS,
  USER_GROUPS_GET_ASYNC,
} from "./constants";
import {
  AuthResponse,
  AuthUserAction,
  Group,
  LoginRequestBody,
  LoginWithCodeRequestBody,
  LogoutRequestBody,
  LogoutUserAction,
  SelectEmployeeAction,
  User,
  UserGroupsAction,
} from "./types";

const authUser = (user: User): AuthUserAction => {
  return {
    type: AUTH_USER,
    payload: user,
  };
};

const logoutUser = (): LogoutUserAction => ({
  type: LOGOUT_USER,
});

const userGroups = (groups: Group[]): UserGroupsAction => {
  return {
    type: USER_GROUPS,
    payload: groups,
  };
};

const login = (loginValues: LoginRequestBody, handlers: Handlers):
  ApiAction<AuthResponse, LoginRequestBody> => apiActionWithCallbacks({
    url: LOGIN_URL,
    method: "post",
    data: loginValues,
    includeAuthorization: false,
    onSuccess: (data: AuthResponse, dispatch) => {
      dispatch(authUser({
        email: loginValues.email,
        name: data.name, id: data.id,
        sessionId: data.sessionId,
        employeeId: data.employees[0].id,
        employees: data.employees,
      }));

      if ((data.employees || []).length === 1) {
        dispatch(companyActions.selectCompany(data.employees[0].company));
      }
    },
    handlers,
  });

const loginWithCode = (loginValues: LoginWithCodeRequestBody, handlers: Handlers):
  ApiAction<AuthResponse, LoginWithCodeRequestBody> => apiActionWithCallbacks({
    url: LOGIN_WITH_CODE_URL,
    method: "post",
    data: loginValues,
    includeAuthorization: false,
    onSuccess: (response, dispatch) => {
      dispatch(authUser({
        email: response.email,
        name: response.name,
        id: response.id,
        sessionId: response.sessionId,
        employeeId: response.employees[0].id,
        employees: response.employees,
      }));
    },
    onFailure: (m, dispatch) => {
      dispatch(logoutUser());
    },
    handlers,
  });

const logout = (): ThunkAction<void, ApplicationState, any, AnyAction> => (dispatch, getState) => {
  const action: ApiAction<any, LogoutRequestBody> = apiAction({
    url: LOGOUT_URL,
    method: "delete",
    onCompleted: () => {
      dispatch(logoutUser());
    },
  });

  dispatch(action);
};

const withUserManagement: Group[] = [
  {
    id: "c628093a-79c0-4d65-9c28-8fe5be4a9d93",
    tags: null,
    permissions: [
      "SUPPLIER_SURVEY_CREATE",
      "SUPPLIER_SURVEY_GET",
    ],
  },
  {
    id: "a20a6714-502f-4585-94db-3cb1134a2951",
    tags: ["USER_MANAGEMENT"],
    permissions: [
      "CR_ON_APPROVER_LIST",
    ],
  },
];

const withoutUserManagement: Group[] = [
  {
    id: "c628093a-79c0-4d65-9c28-8fe5be4a9d93",
    tags: null,
    permissions: [
    ],
  },
  {
    id: "a20a6714-502f-4585-94db-3cb1134a2951",
    tags: null,
    permissions: [
      "CR_ON_APPROVER_LIST",
    ],
  },
];

const loadUserGroups = (employeeId: string): ApiAction<Group[]> =>
  apiAction({
    url: `${GROUPS_URL}`,
    asyncType: USER_GROUPS_GET_ASYNC,
    method: "get",
    onSuccess: (groups, dispatch) => {
      dispatch(userGroups(groups));
    },
    onFailure: (error, dispatch) => {
      // TODO: remove once endpoint ready
      const response = employeeId === "96bf2305-58af-4120-8d7a-06b6e9db8c8c" ?
        withUserManagement :
        withoutUserManagement;
      dispatch(userGroups(response));
    },
  });

const pingServer = ():
  ApiAction => apiAction({
    url: `${PING_SERVER_URL}`,
    asyncType: PING_SERVER_GET_ASYNC,
    method: "get",
    onFailure: (message, dispatch) => {
      dispatch(logoutUser());
    },
  });

const selectEmployee = (employee: Employee): SelectEmployeeAction => ({
  type: SET_EMPLOYEE,
  payload: employee,
});

export default {
  authUser,
  logoutUser,
  login,
  logout,
  loginWithCode,
  loadUserGroups,
  pingServer,
  selectEmployee,
};
