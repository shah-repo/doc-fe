import axios, { AxiosRequestConfig } from "axios";
import { first, get, has, isArray, join } from "lodash";
import { Action, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { redirectTo } from "../../../common/redirectHandler";
import { MAINTENANCE } from "../../../ui/constants/urls";
import apiClient from "../../apiClient";
import apiXClient from "../../apiXClient";
import { authActions } from "../../ducks/auth";
import { ApplicationState } from "../../reducers";
import { ApiAction, AsyncAction, AsyncStatus } from "../../types";
import { AsyncActionErrorResponse } from "./types";

export const CALL_API = "middlewares/CALL_API";

function isApiAction(action: Action): action is ApiAction {
  return action.type === CALL_API;
}

const dispatchAsyncStatusAction = (
  dispatch: Dispatch,
  type: string | undefined,
  status: AsyncStatus,
  message = "",
): void => {
  if (!type) {
    return;
  }

  const action: AsyncAction = { type, payload: { status, message } };
  dispatch(action);
};

const apiMiddleware: Middleware = ({
  dispatch,
  getState,
}: MiddlewareAPI<Dispatch, ApplicationState>) => (next: Dispatch) => async <
  A extends Action
>(
  action: A,
) => {
  if (!isApiAction(action)) {
    next(action);
    return;
  }

  dispatchAsyncStatusAction(dispatch, action.asyncType, AsyncStatus.Active);

  try {
    const requestConfig: AxiosRequestConfig = {
      data: action.data,
      method: action.method,
      params: action.params,
      url: action.url,
      headers: {},
    };

    if (action.contentType) {
      requestConfig.headers["Content-Type"] = action.contentType;
    }

    if (action.cancelToken) {
      requestConfig.cancelToken = action.cancelToken.token;
    }

    if (action.includeAuthorization) {
      const { employeeId, sessionId } = getState().auth.user;
      const authorization = `bearer ${employeeId}:${sessionId}`;
      requestConfig.headers.Authorization = authorization;
      // * Note mobx-rest
      apiXClient(authorization);
    }

    if (action.password) {
      const authorization = `bearer_password ${
        getState().auth.user.employeeId
      }:${getState().auth.user.sessionId}:${action.password}`;

      requestConfig.headers.Authorization = authorization;
    }

    const { data } = await apiClient.request(requestConfig);

    action.onSuccess(data, dispatch);
    dispatchAsyncStatusAction(dispatch, action.asyncType, AsyncStatus.Success);
  } catch (exception) {
    if (axios.isCancel(exception)) {
      return;
    }
    const redirectToMaintenance = exception?.response?.status === 491 && window.location.pathname !== MAINTENANCE;
    redirectToMaintenance && redirectTo(MAINTENANCE)();

    let responseMessage = "";
    const isUnauthorizedRequest = exception?.response?.status === 401 && action.includeAuthorization;
    const isPasswordAction = exception?.response?.status === 401 && action.password;

    if (isUnauthorizedRequest && !isPasswordAction) {
      dispatch(authActions.logoutUser());
    }

    if (exception.response) {
      const {
        data: { message },
      } = exception.response as AsyncActionErrorResponse;
      if (isArray(message) && has(first(message), "message")) {
        responseMessage = join(get(first(message), "message"), "\n");
      } else {
        responseMessage = Array.isArray(message) ? message.join("; ") : message;
      }
    }

    const errorMessage: string = responseMessage || exception.message;

    action.onFailure(errorMessage, dispatch);
    dispatchAsyncStatusAction(
      dispatch,
      action.asyncType,
      AsyncStatus.Error,
      errorMessage,
    );
  } finally {
    action.onCompleted(dispatch);
  }
};

export default apiMiddleware;
