import moment from "moment";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import Config from "../../../config";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApplicationState } from "../../reducers";
import { ApiAction, Handlers } from "../../types";
import {
  AUTH_TOKENS,
  AUTH_TOKENS_REFRESH_THRESHOLD_SECONDS,
  AUTH_USER,
  LOGIN_URL,
  LOGIN_WITH_CODE_URL,
  LOGOUT_URL,
  LOGOUT_USER,
  PERMISSIONS_URL,
  USER_PERMISSIONS,
  USER_PERMISSIONS_GET_ASYNC,
  HEALTHCHECK_URL,
  HEALTHCHECK_GET_ASYNC,
} from "./constants";
import authSelectors from "./selectors";
import {
  AuthResponse,
  AuthTokensAction,
  AuthUserAction,
  AuthWithCodeResponse,
  LoginRequestBody,
  LoginWithCodeRequestBody,
  LogoutRequestBody,
  LogoutUserAction,
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

  if (authResponse.RefreshToken) {
    tokens.refresh = {
      expiresAt: moment().add(Config.RefreshTokenValidityInDays - 1, "days").toISOString(),
      value: authResponse.RefreshToken,
    };
  }

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
      dispatch(authUser({ email: loginValues.email, name: data.name, id: data.id }));
      dispatch(authTokens(data));
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
      dispatch(authUser({ email: response.email, name: response.name, id: response.id }));
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
    data: { AccessToken: authSelectors.accessToken(getState()) },
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
    url: `${HEALTHCHECK_URL}`,
    asyncType: HEALTHCHECK_GET_ASYNC,
    method: "get",
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
};
