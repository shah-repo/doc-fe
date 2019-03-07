import { CALL_API } from "../middlewares/api";
import { ApiAction, AsyncAction, AsyncStatus } from "../types";

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

export const resetAsyncStateAction = (type: string): AsyncAction => ({
  type,
  payload: {
    status: AsyncStatus.Idle,
    message: "",
  },
});
