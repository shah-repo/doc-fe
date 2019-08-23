import moment from "moment-timezone";
import { Dispatch } from "redux";
import { Translation } from "../../../ui/translations/types";
import apiClient from "../../apiClient";
import { authActions } from "../../ducks/auth";
import { AuthResponse, Token } from "../../ducks/auth/types";
import { ApplicationState } from "../../reducers";
import { TokenRefreshRequestBody } from "./types";

let refreshTokenPromise: Promise<void> = Promise.resolve();
let isRefreshing = false;

const hasExpired = (expiresAt: string) => !expiresAt || moment().isAfter(moment(expiresAt));

export const REFRESH_TOKEN_URL = "/auth/token";
const refreshToken = async (token: Token, dispatch: Dispatch) => {
  try {
    const requestBody: TokenRefreshRequestBody = {
      RefreshToken: token.value,
    };

    const { data } = await apiClient.request<AuthResponse>({
      url: REFRESH_TOKEN_URL,
      data: requestBody,
      method: "post",
    });

    dispatch(authActions.authTokens(data));
  } catch {
    dispatch(authActions.logoutUser());
    throw new Error("errors.tokenRefresh" as Translation);
  } finally {
    isRefreshing = false;
  }
};

type RefreshTokenResult = "OK" | "Token expired" | "Refreshed";
const refreshTokenOperation = async (dispatch: Dispatch, state: ApplicationState): Promise<RefreshTokenResult> => {
  const { auth: { tokens: { id, refresh } } } = state;

  if (!(id.value && refresh.value)) {
    throw new Error("errors.userNotLoggedIn" as Translation);
  }

  const idTokenHasNotExpired = !hasExpired(id.expiresAt);
  const refreshTokenHasExpired = hasExpired(refresh.expiresAt);

  if (idTokenHasNotExpired) {
    return "OK";
  }

  if (refreshTokenHasExpired) {
    dispatch(authActions.logoutUser());
    return "Token expired";
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenPromise = refreshToken(refresh, dispatch);
  }

  await refreshTokenPromise;
  return "Refreshed";
};

export default refreshTokenOperation;
