import { ApiAction, Handlers } from "../../types";
import { apiActionWithCallbacks } from "../../factories";

const getChanges = (id: string, handlers: Handlers):
  ApiAction => apiActionWithCallbacks({
      url: `/audit_logs/${id}`,
      method: "get",
      handlers,
    });

export default {
  getChanges,
}