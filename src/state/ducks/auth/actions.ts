import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApplicationState } from "../../reducers";
import { ApiAction, Handlers } from "../../types";
import { companyActions, Employee } from "../company";
import { IotService } from "../../../common/utils/iot/mqttClient";
import {
  AUTH_USER,
  LOGIN_URL,
  LOGIN_WITH_CODE_URL,
  LOGOUT_URL,
  LOGOUT_USER,
  PERMISSIONS_URL,
  AUTH_AWS_IOT_URL,
  PING_SERVER_GET_ASYNC,
  PING_SERVER_URL,
  SET_EMPLOYEE,
  USER_PERMISSIONS,
  USER_PERMISSIONS_GET_ASYNC,
} from "./constants";
import {
  AuthResponse,
  AuthUserAction,
  LoginRequestBody,
  LoginWithCodeRequestBody,
  LogoutRequestBody,
  LogoutUserAction,
  SelectEmployeeAction,
  User,
  UserPermissionsAction,
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

const loadPermissions = (userId: string):
  ApiAction<string[]> => apiAction({
    url: `${PERMISSIONS_URL}/${userId}`,
    asyncType: USER_PERMISSIONS_GET_ASYNC,
    method: "get",
    onSuccess: (permissions, dispatch) => {
      dispatch(userPermissions(permissions));
    },
  });

const getIotCreds = ():
ApiAction => apiAction({
  url: AUTH_AWS_IOT_URL,
  method: "get",
  includeAuthorization: true,
  onSuccess: (credentials, dispatch) => {
    IotService.prototype.setMqttCreds(credentials);
    IotService.prototype.connectToClient();
    // new IotService()
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
  loadPermissions,
  getIotCreds,
  pingServer,
  selectEmployee,
};
