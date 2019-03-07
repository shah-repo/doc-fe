import moment from "moment";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import Config from "../../../config";
import { apiAction, resetAsyncStateAction } from "../../factories";
import { ApplicationState } from "../../reducers";
import { ApiAction } from "../../types";
import {
  AUTH_TOKENS,
  AUTH_TOKENS_REFRESH_THRESHOLD_SECONDS,
  AUTH_USER,
  LOGIN_FORM_ASYNC_STATUS,
  LOGIN_URL,
  LOGOUT_URL,
  LOGOUT_USER,
} from "./constants";
import authSelectors from "./selectors";
import {
  AuthResponse, AuthTokensAction, AuthUserAction, LoginRequestBody, LogoutRequestBody, LogoutUserAction, Tokens, User,
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

const login = (loginValues: LoginRequestBody): ApiAction<AuthResponse, LoginRequestBody> => apiAction({
  url: LOGIN_URL,
  method: "post",
  data: loginValues,
  includeAuthorization: false,
  asyncType: LOGIN_FORM_ASYNC_STATUS,
  onSuccess: (data, dispatch) => {
    dispatch(authUser({ email: loginValues.email }));
    dispatch(authTokens(data));
    dispatch(resetAsyncStateAction(LOGIN_FORM_ASYNC_STATUS));
  },
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

export default {
  authUser,
  authTokens,
  logoutUser,
  login,
  logout,
};
