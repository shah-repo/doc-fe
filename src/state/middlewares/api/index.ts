import { AxiosRequestConfig } from "axios";
import { Action, Dispatch, Middleware, MiddlewareAPI } from "redux";
import apiClient from "../../apiClient";
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
  message: string = "",
): void => {
  if (!type) {
    return;
  }

  const action: AsyncAction = { type, payload: { status, message } };
  dispatch(action);
};

const apiMiddleware: Middleware =
  ({ dispatch, getState }: MiddlewareAPI<Dispatch, ApplicationState>) =>
    (next: Dispatch) =>
      async <A extends Action>(action: A) => {

        if (!(isApiAction(action))) {
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

          if (action.includeAuthorization) {
            requestConfig.headers.Authorization =
            `bearer ${getState().auth.user.employeeId}:${getState().auth.user.sessionId}`;
          }

          if (action.password) {
            requestConfig.headers.Authorization =
            `bearer_password ${getState().auth.user.employeeId}:${getState().auth.user.sessionId}:${action.password}`;
          }

          const { data } = await apiClient.request(requestConfig);

          action.onSuccess(data, dispatch);
          dispatchAsyncStatusAction(dispatch, action.asyncType, AsyncStatus.Success);
        } catch (exception) {
          let responseMessage: string = "";

          if (exception.response) {
            const { data: { message } } = exception.response as AsyncActionErrorResponse;
            responseMessage = (Array.isArray(message)) ? message.join("; ") : message;
          }

          const errorMessage: string = responseMessage || exception.message;

          action.onFailure(errorMessage, dispatch);
          dispatchAsyncStatusAction(dispatch, action.asyncType, AsyncStatus.Error, errorMessage);
        } finally {
          action.onCompleted(dispatch);
        }
      };

export default apiMiddleware;
