// import { store } from "../../../state/store";
import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { PasswordType } from "./types";

const executeAsyncTask = (payload: PasswordType, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `/async_tasks`,
    method: "post",
    password: payload?.password,
    data: payload,
    handlers,
  });

export default {
  executeAsyncTask,
};
