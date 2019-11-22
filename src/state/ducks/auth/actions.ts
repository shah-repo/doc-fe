import moment from "moment-timezone";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApplicationState } from "../../reducers";
import { ApiAction, Handlers } from "../../types";
import { companyActions, Employee } from "../company";
import {
  AUTH_TOKENS,
  AUTH_TOKENS_REFRESH_THRESHOLD_SECONDS,
  AUTH_USER,
  LOGIN_URL,
  LOGIN_WITH_CODE_URL,
  LOGOUT_URL,
  LOGOUT_USER,
  PERMISSIONS_URL,
  PING_SERVER_GET_ASYNC,
  PING_SERVER_URL,
  SET_EMPLOYEE,
  USER_PERMISSIONS,
  USER_PERMISSIONS_GET_ASYNC,
} from "./constants";
import {
  AuthResponse,
  AuthTokensAction,
  AuthUserAction,
  AuthWithCodeResponse,
  LoginRequestBody,
  LoginWithCodeRequestBody,
  LogoutRequestBody,
  LogoutUserAction,
  SelectEmployeeAction,
  Tokens,
  User,
  UserPermissionsAction,
} from "./types";

const authTokens = (authResponse: AuthResponse): AuthTokensAction => {
  const expiresAt = moment()
    .add(authResponse.ExpiresIn - AUTH_TOKENS_REFRESH_THRESHOLD_SECONDS, "seconds")
    .toISOString();

  const tokens: Tokens = {
    access: {
      value: authResponse.AccessToken,
      expiresAt,
    },
    id: {
      value: authResponse.IdToken,
      expiresAt,
    },
  };

  return {
    type: AUTH_TOKENS,
    payload: { tokens },
  };
};

const authUser = (user: User): AuthUserAction => {
  return {
    type: AUTH_USER,
    payload: user,
  };
};

const logoutUser = (): LogoutUserAction => ({
  type: LOGOUT_USER,
});

const userPermissions = (permissions: string[]): UserPermissionsAction => {
  return {
    type: USER_PERMISSIONS,
    payload: permissions,
  };
};

const login = (loginValues: LoginRequestBody, handlers: Handlers):
  ApiAction<AuthResponse, LoginRequestBody> => apiActionWithCallbacks({
    url: LOGIN_URL,
    method: "post",
    data: loginValues,
    includeAuthorization: false,
    onSuccess: (data, dispatch) => {
      dispatch(authUser({
        email: loginValues.email,
        name: data.name, id: data.id,
        sessionId: data.sessionId,
        employeeId: data.employees[0].id,
        employees: data.employees,
      }));
      dispatch(authTokens(data));
      dispatch(companyActions.selectCompany(data.company));
    },
    handlers,
  });

const loginWithCode = (loginValues: LoginWithCodeRequestBody, handlers: Handlers):
  ApiAction<AuthWithCodeResponse, LoginWithCodeRequestBody> => apiActionWithCallbacks({
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
      dispatch(authTokens(response));
    },
    onFailure: (m, dispatch) => {
      dispatch(logoutUser());
    },
    handlers,
  });

const logout = (): ThunkAction<void, ApplicationState, any, AnyAction> => (dispatch, getState) => {
  const action: ApiAction<any, LogoutRequestBody> = apiAction({
    url: LOGOUT_URL,
    method: "post",
    onCompleted: () => {
      dispatch(logoutUser());
    },
  });

  dispatch(action);
};

const loadPermissions = (userId: string):
  ApiAction<string[]> => apiAction({
    url: `${PERMISSIONS_URL}/${userId}`,
    asyncType: USER_PERMISSIONS_GET_ASYNC,
    method: "get",
    onSuccess: (permissions, dispatch) => {
      dispatch(userPermissions(permissions));
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
  authTokens,
  logoutUser,
  login,
  logout,
  loginWithCode,
  loadPermissions,
  pingServer,
  selectEmployee,
};
