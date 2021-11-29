// import { store } from "../../../state/store";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { PasswordType } from "./types";

const executeAsyncTask = (payload: PasswordType, handlers: Handlers): ApiAction => {
  const { password, ...restPayload } = payload;
  return apiActionWithCallbacks({
    url: `/async_tasks`,
    method: "post",
    password,
    data: restPayload,
    handlers,
  }); };

export default {
  executeAsyncTask,
};
