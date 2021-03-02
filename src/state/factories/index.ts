import { CALL_API } from "../middlewares/api";
import { ApiAction, Handlers } from "../types";

export const apiAction =
  <R, B>(apiDefinition: Partial<ApiAction<R, B>>): ApiAction<R, B> => {
    const action: ApiAction<R, B> = {
      url: "/",
      method: "get",
      onCompleted: () => undefined,
      onSuccess: () => undefined,
      onFailure: () => undefined,
      includeAuthorization: true,
      ...apiDefinition,
      type: CALL_API,
    };

    return action;
  };

interface ApiDefinitionWithCallbacks<R, B> extends Partial<ApiAction<R, B>> {
  handlers: Handlers<R>;
}

export const apiActionWithCallbacks = <R, B>(apiDefinition: ApiDefinitionWithCallbacks<R, B>):
ApiAction<R, B> => {
  const action = apiAction(apiDefinition);
  const onSuccess = action.onSuccess;
  const onFailure = action.onFailure;

  const handlers = apiDefinition.handlers;

  action.onSuccess = (data, dispatch) => {
    onSuccess(data, dispatch);
    handlers.successHandler.execute(data);
  };

  action.onFailure = (message, dispatch) => {
    onFailure(message, dispatch);
    handlers.errorHandler.execute(message);
  };

  apiDefinition.cancelToken && handlers.setCancelToken(apiDefinition.cancelToken);

  return action;
};
