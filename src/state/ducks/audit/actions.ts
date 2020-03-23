import { apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { AUDIT_LOGS_ROOT_URL } from "./constants";

const getChanges = (id: string, handlers: Handlers):
ApiAction => apiActionWithCallbacks({
  url: `${AUDIT_LOGS_ROOT_URL}/${id}`,
  method: "get",
  handlers,
});

export default {
  getChanges,
};
